import { Logger } from 'winston'

import { LoggerFactory } from '@/libs/logger/logger.factory'
import { EmptyLoggerTransport } from '@/tests/utils/empty-logger-transport'

describe('LoggerFactory', () => {
  let emptyLoggerTransport: EmptyLoggerTransport

  beforeEach(() => {
    emptyLoggerTransport = new EmptyLoggerTransport()
  })

  afterEach(() => {
    emptyLoggerTransport.clearLogOutput()
    jest.clearAllMocks()
  })

  describe('createLogger', () => {
    it('should return a production logger with correct format in production environment', () => {
      const environment = 'production'
      const appName = 'graphabits-api'
      const message = 'Test production log message'
      const logger: Logger = LoggerFactory.createLogger(environment, appName)
      logger.clear()
      logger.add(emptyLoggerTransport)
      logger.info(message)

      const logOutput = emptyLoggerTransport.getLogOutput()
      const parsedLog = JSON.parse(logOutput.at(0) as string)
      expect(logOutput.length).toBeGreaterThan(0)
      expect(parsedLog.level).toBe('info')
      expect(parsedLog.message).toBe(message)
      expect(parsedLog.label).toBe(appName)
      expect(parsedLog).toHaveProperty('timestamp')
      expect(parsedLog).toHaveProperty('ms')
    })

    it('should return a development logger when the environment is development', () => {
      const environment = 'development'
      const appName = 'graphabits-api'
      const message = 'Test development log message'
      const logger: Logger = LoggerFactory.createLogger(environment, appName)
      logger.clear()
      logger.add(emptyLoggerTransport)

      logger.info(message)

      const logOutput = emptyLoggerTransport.getLogOutput()
      expect(logOutput.length).toBeGreaterThan(0)
      expect(logOutput.at(0)).toContain(message)
      expect(logger.level).toBe('debug')
    })

    it('should return a development logger when the environment is not recognized', () => {
      const environment = 'test'
      const appName = 'graphabits-api'
      const message = 'Test development log message'
      const logger: Logger = LoggerFactory.createLogger(environment, appName)
      logger.clear()
      logger.add(emptyLoggerTransport)

      logger.info(message)

      const logOutput = emptyLoggerTransport.getLogOutput()
      expect(logOutput.length).toBeGreaterThan(0)
      expect(logOutput.at(0)).toContain(message)
      expect(logger.level).toBe('debug')
    })
  })
})
