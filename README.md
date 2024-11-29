# AWS Lambda with NestJS Monorepo Example

This repository demonstrates how to create a monorepo architecture for **AWS Lambda functions** using the **NestJS framework** in **monorepo mode** with the **Serverless Framework** and **Serverles Compose**. It includes two Lambdas:

1. **Payment Processor**
   Processes incoming **SQS** messages and returns a response of type `SQSBatchResponse`.

2. **Find One Payment by ID**
   Handles **HTTP GET requests** with a path parameter and returns a response of type `APIGatewayProxyResult`.

---

## Features

- **Local Development**: Simulate Lambda behavior and SQS message processing offline.
- **Testing Support**: Includes both unit and end-to-end tests using Jest.
- **Code Coverage**: Generates code coverage reports using Jest.
- **Monorepo Architecture**: Share code between Lambdas using a NestJS monorepo structure.
- **Flexible Deployment**: Compatible with **Serverless Framework** or manual deployment using the **AWS CLI**.

---

## Prerequisites

- Node.js 20 or later
- Yarn package manager
- Docker and Docker Compose
- AWS CLI (Optional)

---

## Project Structure

```txt
.
├── apps/
│   ├── find-one-payment-by-id/
│   │   ├── src/
│   │   ├── events/                # Example HTTP events
│   │   └── serverless.yaml        # Serverless Framework config
│   ├── payment-processor/
│   │   ├── src/
│   │   ├── events/                # Example SQS events
│   │   └── serverless.yaml        # Serverless Framework config
├── libs/                          # Shared libraries
├── docker-compose.yaml            # ElasticMQ for local SQS testing
├── serverless-compose.yaml        # Monorepo Serverless Framework setup
└── package.json
```

As you can see, the project is divided into two main directories:

- **`apps/`**: Contains the Lambda applications.
- **`libs/`**: Contains shared libraries that can be used by the Lambda applications.

The `apps` directory contains two subdirectories, one for each Lambda:

- **`payment-processor/`**: Contains the code for the `Payment Processor` Lambda and in development mode, it runs on port 3000.
- **`find-one-payment-by-id/`**: Contains the code for the `Find One Payment by ID` Lambda and in development mode, it runs on port 4000.

---

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:leandromatos/nestjs-serverless-monorepo.git
   cd nestjs-serverless-monorepo
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

---

## Running Locally

### Using the NestJS CLI

This is the recommended way to run the Lambdas locally during development because it provides a hot reload feature.

1. Start both Lambdas in watch mode:

   ```bash
   yarn start:dev
   ```

2. Test the `Payment Processor` Lambda:

   - Send a message using `curl`:

     ```bash
     curl -X POST \
     -H "Content-Type: application/json" \
     --data @./apps/payment-processor/events/success.json \
     http://localhost:3000/
     ```

     **Note:** The `success.json` file contains an SQS event that Lambda will process. To test Lambda's behavior, you can create additional files with different messages.

3. Test the `Find One Payment by ID` Lambda:

   - Access the endpoint at `http://localhost:4000/payments/{id}` or test the endpoint using `curl`:

     ```bash
     curl http://localhost:4000/payments/{id}
     ```

### Using the Serverless Framework

This is an alternative way to run the Lambdas locally. It is useful when you want to simulate the behavior of the Lambdas in a production-like environment. The `serverless-offline` and `serverless-sqs-offline` plugins are used to simulate the Lambda and SQS services.

#### Starting Lambdas Offline

1. Test the `Payment Processor` Lambda:

   - Start the Docker Compose service to simulate the SQS service in the background:

     ```bash
     docker-compose up -d
     ```

   - Start the `Payment Processor` Lambda:

     ```bash
     yarn sls:offline:payment-processor
     ```

   - Send a message using `curl`:

     ```bash
     curl -X \
     POST -H "Content-Type: application/json" \
     --data @./apps/payment-processor/events/success.json \
     http://localhost:3002/2015-03-31/functions/payment-processor-dev-payment-processor/invocations
     ```

2. Test the `Find One Payment by ID` Lambda:

   - Start the `Find One Payment by ID` Lambda:

     ```bash
     yarn sls:offline:find-one-payment-by-id
     ```

   - Access the endpoint at `http://localhost:4000/dev/payments/{id}` or test the endpoint using `curl`:

     ```bash
     curl http://localhost:4000/dev/payments/{id}
     ```

> [!TIP]
> You can also use the **AWS CLI** to send messages to the `Payment Processor` Lambda since we are using the `serverless-offline` and `serverless-sqs-offline` plugins.
>
> Ensure that the Docker Compose service is running and the `Payment Processor` Lambda is started using the `yarn sls:offline:payment-processor` command. Then, send a message using the **AWS CLI**:
>
> ```bash
>  aws sqs send-message \
>   --queue-url http://localhost:9324/queue/payments-main-queue \
>   --message-body '{
>     "paymentId": "1234567890",
>     "amount": 350.00,
>     "currency": "USD",
>     "status": "received",
>     "action": "success"
>   }' \
>   --endpoint-url http://localhost:9324
> ```
>
> Some delays may occur when using the **AWS CLI** to send messages to the Lambda. This is due to the way that the SQS service is emulated by ElasticMQ.

#### Invoking Lambdas Locally

1. Invoke `Payment Processor` Lambda by passing an HTTP event:

   ```bash
   yarn sls:invoke:payment-processor -p events/success.json
   ```

2. Invoke `Find One Payment by ID` Lambda by passing an SQS event:

   ```bashgit
   yarn sls:invoke:find-one-payment-by-id -p events/payment.json
   ```

   **Note:** The `payment.json` file contains a partial Api Gateway HTTP event containing only the necessary fields to invoke the Lambda. You can create additional files with different events to test the Lambda's behavior.

> [!TIP]
> You can also use the **AWS CLI** to invoke Lambdas locally. To do that, you need to start the Lambdas using the appropriate `yarn sls:offline:<lambda-name>` command and then invoke them using the **AWS CLI**.
> For example, to invoke the `Find One Payment by ID` Lambda:
>
> First, start the Lambda using the `yarn sls:offline:find-one-payment-by-id` command. Then, invoke the Lambda using the following command:
>
> ```bash
> aws lambda invoke --endpoint-url http://localhost:4002 --function-name find-one-payment-by-id-dev-find-one-payment-by-id --cli-binary-format raw-in-base64-out --payload file://./apps/find-one-payment-by-id/events/payment.json --log-type Tail /dev/stdout | jq .
> ```
>
> The `jq` command formats the output for better readability. You can install it using brew install jq on macOS or sudo apt-get install jq on Linux.

---

## Testing

Run unit tests:

```bash
yarn test
```

Run end-to-end tests:

```bash
yarn test:e2e
```

Check coverage:

```bash
yarn test:cov
```

If you want to run tests for individual Lambdas, you can use the following commands:

```bash
yarn test:find-one-payment-by-id
yarn test:payment-processor
```

or

```bash
yarn test:e2e:find-one-payment-by-id
yarn test:e2e:payment-processor
```

---

## Build

The build will be done using Webpack and the artifacts will be placed in the `dist` folder.

To build all Lambdas:

```bash
yarn build
```

If you want to build individual Lambdas for some reason, you can use the following commands:

  ```bash
  yarn build:find-one-payment-by-id
  yarn build:payment-processor
  ```

---

## Deployment

Each organization has its own deployment strategy, so this repository does not enforce a specific deployment method. Its objective is just to exemplify how to create a monorepo architecture with NestJS and AWS Lambda.
