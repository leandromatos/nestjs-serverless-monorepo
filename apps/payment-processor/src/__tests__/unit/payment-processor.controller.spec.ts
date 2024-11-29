import { Test, TestingModule } from '@nestjs/testing'
import { SQSEvent } from 'aws-lambda'

import { PaymentProcessorController } from '@/apps/payment-processor/payment-processor.controller'
import { PaymentProcessorService } from '@/apps/payment-processor/payment-processor.service'
import { EmptyLogger } from '@/tests/utils/empty-logger'

describe('PaymentProcessorController', () => {
  let paymentProcessorController: PaymentProcessorController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PaymentProcessorController],
      providers: [PaymentProcessorService],
    })
      .setLogger(new EmptyLogger())
      .compile()

    paymentProcessorController = app.get<PaymentProcessorController>(PaymentProcessorController)
  })

  describe('processMessage', () => {
    it('should return a list of batchItemFailures', async () => {
      const records = [
        {
          messageId: '1',
          body: JSON.stringify({ amount: 100 }),
        },
        {
          messageId: '2',
          body: JSON.stringify({ amount: 200 }),
        },
      ] as SQSEvent['Records']

      const batchItemFailures = await paymentProcessorController.processMessage({ Records: records })

      expect(batchItemFailures).toEqual({
        batchItemFailures: [],
      })
    })
  })
})
