import { Test, TestingModule } from '@nestjs/testing'

import { FindOnePaymentByIdController } from '@/apps/find-one-payment-by-id/find-one-payment-by-id.controller'
import { FindOnePaymentByIdService } from '@/apps/find-one-payment-by-id/find-one-payment-by-id.service'

describe('FindOnePaymentByIdController', () => {
  let findOnePaymentByIdController: FindOnePaymentByIdController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FindOnePaymentByIdController],
      providers: [FindOnePaymentByIdService],
    }).compile()

    findOnePaymentByIdController = app.get<FindOnePaymentByIdController>(FindOnePaymentByIdController)
  })

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(findOnePaymentByIdController.findOnePaymentById('1234567890')).toEqual({
        body: 'This action returns a #1234567890 payment',
        statusCode: 200,
      })
    })
  })
})
