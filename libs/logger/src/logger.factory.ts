import { utilities } from 'nest-winston'
import { createLogger, format, Logger, transports } from 'winston'

export class LoggerFactory {
  /**
   * Factory method to create a logger based on the current environment.
   *
   * @param environment - The current environment ('production' or 'development').
   * @param appName - The application name for log formatting.
   * @returns A configured logger instance.
   */
  static createLogger(environment: string, appName: string): Logger {
    return environment === 'production' ? this.createProductionLogger(appName) : this.createDevelopmentLogger(appName)
  }

  /**
   * Creates a logger instance configured for the production environment with JSON format.
   *
   * @param appName - The name of the application to include in each log entry.
   * @returns Production-ready logger instance.
   */
  private static createProductionLogger(appName: string): Logger {
    const ignoredContexts = [
      'NestFactory',
      'InstanceLoader',
      'RoutesResolver',
      'RouterExplorer',
      'NestApplication',
      'Bootstrap',
    ]

    return createLogger({
      level: 'info',
      format: format.combine(
        format(info => {
          if (ignoredContexts.includes(info?.context as string)) return false

          return info
        })(),
        format.label({ label: appName }),
        format.timestamp(),
        format.ms(),
        format.json(),
      ),
      transports: [new transports.Console()],
    })
  }

  /**
   * Creates a logger instance configured for the development environment with human-readable format.
   *
   * @param appName - The application name for custom log formatting.
   * @returns Development-ready logger instance.
   */
  private static createDevelopmentLogger(appName: string): Logger {
    return createLogger({
      level: 'debug',
      format: format.combine(
        format.timestamp(),
        format.ms(),
        utilities.format.nestLike(appName, {
          colors: true,
          prettyPrint: true,
          appName: true,
        }),
      ),
      transports: [new transports.Console()],
    })
  }
}
