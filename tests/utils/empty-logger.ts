import { ConsoleLogger } from '@nestjs/common'

export class EmptyLogger extends ConsoleLogger {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override log(message: string): void {
    // Sonar doesn't like empty blocks
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override error(message: string): void {
    // Sonar doesn't like empty blocks
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override warn(message: string): void {
    // Sonar doesn't like empty blocks
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override debug(message: string): void {
    // Sonar doesn't like empty blocks
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override verbose(message: string): void {
    // Sonar doesn't like empty blocks
  }
}
