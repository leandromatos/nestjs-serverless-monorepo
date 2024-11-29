import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'

import { FindOnePaymentByIdModule } from '@/apps/find-one-payment-by-id/find-one-payment-by-id.module'

describe('FindOnePaymentByIdController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [FindOnePaymentByIdModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/payments/{id} (GET)', () => {
    return request(app.getHttpServer()).get('/payments/1234567890').expect(200).expect({
      body: 'This action returns a #1234567890 payment',
      statusCode: 200,
    })
  })
})
