import { Injectable, Logger } from '@nestjs/common'
import { SQSBatchItemFailure, SQSRecord } from 'aws-lambda'
import { inspect } from 'util'

@Injectable()
export class PaymentProcessorService {
  protected readonly logger = new Logger(PaymentProcessorService.name)

  /**
   * Processes a batch of SQS records and collects failures.
   *
   * @param records - The list of SQS records.
   * @returns A list of batchItemFailures for AWS SQS retry.
   * @see https://docs.aws.amazon.com/lambda/latest/dg/example_serverless_SQS_Lambda_batch_item_failures_section.html
   * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#sendMessageBatch-property
   * @throws Error if any record fails to process.
   */
  async processBatch(records: SQSRecord[]): Promise<SQSBatchItemFailure[]> {
    const batchItemFailures: SQSBatchItemFailure[] = []
    await Promise.allSettled(
      records.map(async record => {
        try {
          await this.processSingleRecord(record)
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          const errorStack = error instanceof Error ? error.stack : 'Unknown stack'
          this.logger.error(`Failed to process record ${record.messageId}: ${errorMessage}`, errorStack)
          batchItemFailures.push({
            itemIdentifier: record.messageId,
          })
        }
      }),
    )

    return batchItemFailures
  }

  /**
   * Processes a single SQS record.
   *
   * @param record - The SQS record to process.
   * @throws Error if the record fails to process.
   */
  private async processSingleRecord(record: SQSRecord): Promise<void> {
    let body: unknown
    try {
      body = JSON.parse(record.body)
    } catch {
      throw new Error(`Invalid JSON format in record: ${record.messageId}`)
    }
    console.log('Processing record:', body)
    await this.processPayment(body)
  }

  /**
   * Processes an individual payment.
   *
   * @param payment - The parsed payment object.
   */
  async processPayment(payment: unknown): Promise<void> {
    this.logger.log(
      `Processing payment: ${inspect(payment, {
        colors: true,
        depth: null,
      })}`,
    )
  }
}
