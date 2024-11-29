import { NestFactory } from '@nestjs/core'
import serverlessExpress from '@vendia/serverless-express'
import { Callback, Context, Handler } from 'aws-lambda'
import { WinstonModule } from 'nest-winston'
import { firstValueFrom, ReplaySubject } from 'rxjs'

import { PaymentProcessorModule } from '@/apps/payment-processor/payment-processor.module'
import { LoggerFactory } from '@/libs/logger'

const bootstrap = async (): Promise<Handler> => {
  const environment = process.env.NODE_ENV ?? 'development'
  const appName = process.env.APP_NAME ?? 'payment-processor'
  const port = String(process.env.APP_PORT ?? 3000)
  const app = await NestFactory.create(PaymentProcessorModule, {
    logger: WinstonModule.createLogger(LoggerFactory.createLogger(environment, appName)),
  })
  await app.listen(port)
  const expressApp = app.getHttpAdapter().getInstance()

  return serverlessExpress({
    app: expressApp,
    eventSourceRoutes: {
      AWS_SQS: '/',
    },
  })
}

// Declare a ReplaySubject to store the serverlessExpress instance.
const serverSubject = new ReplaySubject<Handler>()

// Do not wait for lambdaHandler to be called before bootstraping Nest.
// Pass the result of bootstrap() into the ReplaySubject
bootstrap().then(server => serverSubject.next(server))

export const handler: Handler = async (
  event: Record<string, unknown>,
  context: Context,
  callback: Callback,
): Promise<Handler> => {
  // Convert the ReplaySubject to a Promise.
  // Wait for bootstrap to finish, then start handling requests.
  const server = await firstValueFrom(serverSubject)

  return await server(event, context, callback)
}
