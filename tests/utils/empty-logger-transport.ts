import TransportStream from 'winston-transport'

/**
 * Custom transport stream to intercept and capture log output for testing purposes.
 */
export class EmptyLoggerTransport extends TransportStream {
  private logOutput: string[] = []

  constructor() {
    super()
  }

  /**
   * Captures log message chunks written to the stream.
   *
   * @param info - The log information.
   * @param callback - The callback function to signal completion.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Winston uses any for log info
  override log(info: any, callback: () => void) {
    this.logOutput.push(info[Symbol.for('message')] || info.message)
    callback()
  }

  /**
   * Retrieves captured log output.
   *
   * @returns An array of log messages written to the stream.
   */
  getLogOutput(): string[] {
    return this.logOutput
  }

  /**
   * Clears the captured log output.
   */
  clearLogOutput() {
    this.logOutput = []
  }
}
