import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { join } from 'path'
import { cwd } from 'process'

import { PaymentProcessorController } from '@/apps/payment-processor/payment-processor.controller'
import { PaymentProcessorService } from '@/apps/payment-processor/payment-processor.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(cwd(), 'apps/payment-processor/.env'),
    }),
  ],
  controllers: [PaymentProcessorController],
  providers: [PaymentProcessorService],
})
export class PaymentProcessorModule {}
