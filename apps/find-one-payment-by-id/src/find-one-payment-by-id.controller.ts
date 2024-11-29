import { Controller, Get, HttpStatus, Param } from '@nestjs/common'
import { APIGatewayProxyResult } from 'aws-lambda'

import { FindOnePaymentByIdService } from '@/apps/find-one-payment-by-id/find-one-payment-by-id.service'

@Controller()
export class FindOnePaymentByIdController {
  constructor(private readonly findOnePaymentByIdService: FindOnePaymentByIdService) {}

  @Get('payments/:id')
  findOnePaymentById(@Param('id') id: string): APIGatewayProxyResult {
    const body = this.findOnePaymentByIdService.findOnePaymentById(id)

    return {
      statusCode: HttpStatus.OK,
      body,
    }
  }
}
