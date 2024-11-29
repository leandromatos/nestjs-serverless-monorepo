import { NestFactory } from '@nestjs/core'
import serverlessExpress from '@vendia/serverless-express'
import { Callback, Context, Handler } from 'aws-lambda'
import { WinstonModule } from 'nest-winston'
import { firstValueFrom, ReplaySubject } from 'rxjs'

import { FindOnePaymentByIdModule } from '@/apps/find-one-payment-by-id/find-one-payment-by-id.module'
import { LoggerFactory } from '@/libs/logger'

const bootstrap = async (): Promise<Handler> => {
  const environment = process.env.NODE_ENV ?? 'development'
  const appName = process.env.APP_NAME ?? 'payment-processor'
  const port = String(process.env.APP_PORT ?? 4000)
  const app = await NestFactory.create(FindOnePaymentByIdModule, {
    logger: WinstonModule.createLogger(LoggerFactory.createLogger(environment, appName)),
  })
  await app.listen(port)
  const expressApp = app.getHttpAdapter().getInstance()

  return serverlessExpress({ app: expressApp })
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
  // Handle edge cases for root path. This seems to be a bug in the serverless-offline plugin.
  // https://github.com/dherault/serverless-offline/issues/1832
  if (event.path === '' || event.path === undefined) event.path = '/'
  // Convert the ReplaySubject to a Promise.
  // Wait for bootstrap to finish, then start handling requests.
  const server = await firstValueFrom(serverSubject)

  return server(event, context, callback)
}
