---
title: Integrate AWS Lambda with Timescale Cloud
excerpt: With AWS Lambda, you can run code without provisioning or managing servers, and scale automatically. Integrate AWS Lambda with Timescale Cloud and inject data into your service
products: [cloud, mst, self_hosted]
keywords: [connect, integrate, aws, lambda]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";
import OldCreateHypertable from "versionContent/_partials/_old-api-create-hypertable.mdx";

# Integrate AWS Lambda with Timescale Cloud

[AWS Lambda][AWS-Lambda] is a serverless computing service provided by Amazon Web Services (AWS) that allows you to run 
code without provisioning or managing servers, scaling automatically as needed.

This page shows you how to integrate AWS Lambda with $SERVICE_LONG to process and store time-series data efficiently.

## Prerequisites

<IntegrationPrereqs />

* Set up an [AWS Account][aws-sign-up].
* Install and configure [AWS CLI][install-aws-cli].
* Install [NodeJS v18.x or later][install-nodejs].


## Prepare your $SERVICE_LONG to ingest data from AWS Lambda

Create a table in $SERVICE_LONG to store time-series data.

<Procedure>

1. **Connect to your $SERVICE_LONG**

      For $CLOUD_LONG, open an [SQL editor][run-queries] in [$CONSOLE][open-console]. For self-hosted, use [`psql`][psql].

1. **Create a hypertable to store sensor data**

   [Hypertables][about-hypertables] are PostgreSQL tables that automatically partition your data by time. You interact
   with hypertables in the same way as regular PostgreSQL tables, but with extra features that make managing your
   time-series data much easier.

   ```sql
   CREATE TABLE sensor_data (
     time TIMESTAMPTZ NOT NULL,
     sensor_id TEXT NOT NULL,
     value DOUBLE PRECISION NOT NULL
   ) WITH (
     tsdb.hypertable,
     tsdb.partition_column='time'
   );
   ```
   <OldCreateHypertable />   

</Procedure>

## Create the code to inject data into a $SERVICE_LONG

Write an AWS Lambda function in a Node.js project that processes and inserts time-series data into a $SERVICE_LONG.

<Procedure>

1. **Initialize a new Node.js project to hold your Lambda function**

   ```shell
   mkdir lambda-timescale && cd lambda-timescale
   npm init -y
   ```

1. **Install the PostgreSQL client library in your project**

   ```shell
   npm install pg
   ```

1. **Write a Lambda Function that inserts data into your $SERVICE_LONG**

   Create a file named `index.js`, then add the following code:

   ```javascript
   const {
       Client
   } = require('pg');

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
            // 
           const query = `
               INSERT INTO sensor_data (time, sensor_id, value)
               VALUES ($1, $2, $3);
               `;

           const data = JSON.parse(event.body);
           const values = [new Date(), data.sensor_id, data.value];

           await client.query(query, values);

           return {
               statusCode: 200,
               body: JSON.stringify({
                   message: 'Data inserted successfully!'
               }),
           };
       } catch (error) {
           console.error('Error inserting data:', error);
           return {
               statusCode: 500,
               body: JSON.stringify({
                   error: 'Failed to insert data.'
               }),
           };
       } finally {
           await client.end();
       }

   };
   ```

</Procedure>

## Deploy your Node project to AWS Lambda

To create an AWS Lambda function that injects data into your $SERVICE_LONG:

<Procedure>

1. **Compress your code into a `.zip`**

   ```shell
   zip -r lambda-timescale.zip .
   ```

1. **Deploy to AWS Lambda**

   In the following example, replace `<IAM_ROLE_ARN>` with your [AWS IAM credentials][aws-iam-role], then use 
   AWS CLI to create a Lambda function for your project:

   ```shell
   aws lambda create-function \
      --function-name TimescaleIntegration \
      --runtime nodejs14.x \
      --role <IAM_ROLE_ARN> \
      --handler index.handler \
      --zip-file fileb://lambda-timescale.zip
   ```

1. **Set up environment variables**

   In the following example, use your [connection details][connection-info] to add your $SERVICE_LONG connection settings to your Lambda function:
   ```shell
   aws lambda update-function-configuration \
   --function-name TimescaleIntegration \
   --environment "Variables={TIMESCALE_HOST=<host>,TIMESCALE_PORT=<port>, \
                  TIMESCALE_USER=<Username>,TIMESCALE_PASSWORD=<Password>, \
                  TIMESCALE_DB=<Database name>}"
   ```

1. **Test your AWS Lambda function**

   1. Invoke the Lambda function and send some data to your $SERVICE_LONG:

      ```shell
      aws lambda invoke \
         --function-name TimescaleIntegration \
         --payload '{"body": "{\"sensor_id\": \"sensor-123\", \"value\": 42.5}"}' \
         --cli-binary-format raw-in-base64-out \
         response.json
      ```

   1. Verify that the data is in your $SERVICE_SHORT.

      Open an [SQL editor][run-queries] and check the `sensor_data` table:

      ```sql
      SELECT * FROM sensor_data;
      ```
      You see something like:

      | time | sensor_id | value  |
      |-- |-- |--------|
      | 2025-02-10 10:58:45.134912+00 | 	sensor-123 | 	42.5  |
   

</Procedure>

You can now seamlessly ingest time-series data from AWS Lambda into $CLOUD_LONG.

[AWS-Lambda]: https://docs.aws.amazon.com/lambda/latest/dg/welcome.html
[lambda-functions]: https://console.aws.amazon.com/lambda/home#/functions
[aws-sign-up]: https://signin.aws.amazon.com/signup?request_type=register
[install-aws-cli]: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html
[install-nodejs]: https://nodejs.org/en/download
[install-postgresql]: https://www.postgresql.org/download/
[console]: https://console.cloud.timescale.com/
[run-queries]: /getting-started/:currentVersion:/run-queries-from-console/
[psql]: /integrations/:currentVersion:/psql/
[about-hypertables]: /use-timescale/:currentVersion:/hypertables/
[aws-iam-role]: https://docs.aws.amazon.com/IAM/latest/UserGuide/access-keys-admin-managed.html#admin-list-access-key
[open-console]: https://console.cloud.timescale.com/dashboard/services
[connection-info]: /integrations/:currentVersion:/find-connection-details/
