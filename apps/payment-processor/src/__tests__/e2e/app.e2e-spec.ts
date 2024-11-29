import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'

import { PaymentProcessorModule } from '@/apps/payment-processor/payment-processor.module'

describe('PaymentProcessorController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PaymentProcessorModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/ (POST)', async () => {
    const payload = {
      Records: [
        {
          body: JSON.stringify({
            paymentId: '123',
            amount: 100,
          }),
        },
      ],
    }

    const response = await request(app.getHttpServer()).post('/').send(payload)

    expect(response.status).toBe(201)
    expect(response.body).toEqual({ batchItemFailures: [] })
  })
})
