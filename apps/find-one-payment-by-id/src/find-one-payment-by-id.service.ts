import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class FindOnePaymentByIdService {
  private readonly logger = new Logger(FindOnePaymentByIdService.name)

  findOnePaymentById(id: string): string {
    this.logger.log(`Finding payment by ID: ${id}`)

    return `This action returns a #${id} payment`
  }
}
