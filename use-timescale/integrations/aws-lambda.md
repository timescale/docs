---
title: Integrate AWS Lambda with $CLOUD_LONG
excerpt: ADD
products: [cloud, mst, self_hosted]
keywords: [connect, integrate, aws_lambda]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate AWS Lambda with $CLOUD_LONG

[AWS Lambda][AWS-Lambda] is a serverless computing service provided by Amazon Web Services (AWS) that allows you to run code without provisioning or managing servers, scaling automatically as needed.

This page shows you how to integrate AWS Lambda with $SERVICE_LONG to process and store time-series data efficiently.

## Prerequisites

Before integrating:

<IntegrationPrereqs />

* Setup an [AWS Account][aws-sign-up]
* [Install the latest version of AWS CLI][install-aws-cli]
* [Install NodeJS version 18.x or later][install-nodejs]
* [Install psql cli][install-postgresql](Optional)

## Create a Table in $SERVICE_LONG

Create a table in $SERVICE_LONG to store time-series data.

<Procedure>

1. **Use the `psql` CLI or [$CONSOLE][console] to create the table**

   ```sql
   CREATE TABLE sensor_data (
   time TIMESTAMPTZ NOT NULL,
   sensor_id TEXT NOT NULL,
   value DOUBLE PRECISION NOT NULL);
   ```

1. **Convert the table to a hypertable for better performance**

   ```sql
   SELECT create_hypertable('sensor_data', 'time');
   ```

</Procedure>

## Create an AWS Lambda Function

<Procedure>

1. **Initialize a New Lambda Function**

   Create a new directory for your Lambda function and initialize a new Node.js project:

   ```bash
   mkdir lambda-timescale && cd lambda-timescale
   npm init -y
   ```

1. **Install the PostgreSQL dependencies**

   Install the PostgreSQL client library for Node.js:

   ```bash
   npm install pg
   ```

1. **Write the Lambda Function**

   Create a file named `index.js` and add the following code:

   ```javascript
   const { Client } = require('pg');

   exports.handler = async (event) => {
   const client = new Client({
      host: process.env.TIMESCALE_HOST,
      port: process.env.TIMESCALE_PORT,
      user: process.env.TIMESCALE_USER,
      password: process.env.TIMESCALE_PASSWORD,
      database: process.env.TIMESCALE_DB,
      });

      try {
      await client.connect();

      const query = `
      INSERT INTO sensor_data (time, sensor_id, value)
      VALUES ($1, $2, $3);
      `;

      const data = JSON.parse(event.body);
      const values = [new Date(), data.sensor_id, data.value];

      await client.query(query, values);

      return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Data inserted successfully!' }),
      };
      } catch (error) {
      console.error('Error inserting data:', error);
      return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to insert data.' }),
      };
      } finally {
      await client.end();
      }

   };
   ```

</Procedure>

## Deploy the AWS Lambda Function

To store time-series data between AWS Lambda and $SERVICE_LONG:

<Procedure>

1. **Zip Your Code**

   Compress your code into a `.zip` file:

   ```bash
   zip -r lambda-timescale.zip .
   ```

1. **Set Up Environment Variables**

   In the AWS Lambda console, navigate to your function's settings and add the following environment variables:
   * `TIMESCALE_HOST`
   * `TIMESCALE_PORT`
   * `TIMESCALE_USER`
   * `TIMESCALE_PASSWORD`
   * `TIMESCALE_DB`

1. **Deploy to AWS Lambda**

   Use the AWS CLI to create or update your Lambda function:

   ```bash
   aws lambda create-function \
      --function-name TimescaleIntegration \
      --runtime nodejs14.x \
      --role <IAM_ROLE_ARN> \
      --handler index.handler \
      --zip-file fileb://lambda-timescale.zip
   ```

1. **Test the Lambda Function**

   Invoke the Lambda function with a test event:

   ```bash
   aws lambda invoke \
      --function-name TimescaleIntegration \
      --payload '{"sensor_id": "sensor-123", "value": 42.5}' \
      response.json
   ```

1. **Verify Data in $CLOUD_LONG**

   Check the `sensor_data` table to verify the data insertion:

   ```sql
   SELECT * FROM sensor_data;
   ```

</Procedure>

By completing this integration, you can seamlessly ingest and store time-series data from AWS Lambda into $CLOUD_LONG. For advanced use cases, consider exploring Timescale's continuous aggregates and compression features.

[AWS-Lambda]: https://docs.aws.amazon.com/lambda/latest/dg/welcome.html
[aws-sign-up]: https://signin.aws.amazon.com/signup?request_type=register
[install-aws-cli]: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html
[install-nodejs]: https://nodejs.org/en/download
[install-postgresql]: https://www.postgresql.org/download/
[console]: https://console.cloud.timescale.com/
