const TerserPlugin = require('terser-webpack-plugin')

const lazyImports = [
  '@nestjs/microservices',
  '@nestjs/microservices/microservices-module',
  '@nestjs/websockets/socket-module',
  '@nestjs/platform-express',
  '@grpc/grpc-js',
  '@grpc/proto-loader',
  'kafkajs',
  'mqtt',
  'nats',
  'ioredis',
  'amqplib',
  'amqp-connection-manager',
  'pg-native',
  'cache-manager',
  'class-validator',
  'class-transformer',
]

const externals = ['aws-lambda']

module.exports = (options, webpack) => ({
  ...options,
  externals,
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
          keep_classnames: true,
        },
        extractComments: false,
      }),
    ],
  },
  output: {
    ...options.output,
    libraryTarget: 'commonjs2',
  },
  plugins: [
    ...options.plugins,
    new webpack.IgnorePlugin({
      checkResource(resource) {
        if (lazyImports.includes(resource)) {
          try {
            require.resolve(resource)
          } catch {
            return true
          }
        }

        return false
      },
    }),
  ],
})
