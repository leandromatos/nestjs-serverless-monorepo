import { Body, Controller, Post } from '@nestjs/common'
import { SQSBatchResponse, SQSEvent } from 'aws-lambda'

import { PaymentProcessorService } from './payment-processor.service'

@Controller()
export class PaymentProcessorController {
  constructor(private readonly paymentProcessorService: PaymentProcessorService) {}

  @Post()
  async processMessage(@Body() body: SQSEvent): Promise<SQSBatchResponse> {
    const records = body.Records
    const batchItemFailures = await this.paymentProcessorService.processBatch(records)

    return {
      batchItemFailures,
    }
  }
}
