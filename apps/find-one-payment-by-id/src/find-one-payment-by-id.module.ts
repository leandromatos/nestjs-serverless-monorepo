import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { join } from 'path'
import { cwd } from 'process'

import { FindOnePaymentByIdController } from '@/apps/find-one-payment-by-id/find-one-payment-by-id.controller'
import { FindOnePaymentByIdService } from '@/apps/find-one-payment-by-id/find-one-payment-by-id.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(cwd(), 'apps/find-one-payment-by-id/.env'),
    }),
  ],
  controllers: [FindOnePaymentByIdController],
  providers: [FindOnePaymentByIdService],
})
export class FindOnePaymentByIdModule {}
