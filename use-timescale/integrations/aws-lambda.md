---
title: Integrate AWS Lambda with $CLOUD_LONG
excerpt: ADD
products: [cloud, mst, self_hosted]
keywords: [connect, integrate, aws_lambda]
---


# Integrate AWS Lambda with $CLOUD_LONG

This guide demonstrates how to integrate AWS Lambda with $CLOUD_LONG to process and store time-series data efficiently. AWS Lambda allows you to run code in response to events without provisioning or managing servers. $CLOUD_LONG provides a scalable and reliable platform for managing time-series data.

---

## Prerequisites

Before you begin, ensure you have the following:

1. **AWS Account**: An active AWS account with permissions to create and manage Lambda functions.
2. **$CLOUD_LONG Account**: A $CLOUD_LONG account with a database provisioned.
3. **Database Connection Details**: $CLOUD_LONG connection details, including:
   - Host
   - Port
   - Username
   - Password
   - Database name
4. **AWS CLI**: Installed and configured. [Install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).
5. **Node.js Installed**: Ensure Node.js is installed for developing and deploying the Lambda function.
6. **psql CLI**: (Optional) Installed for testing database connectivity.

---

## Step 1: Set Up Your $CLOUD_LONG Database

1. **Create a $CLOUD_LONG Account**
   - Sign up for a $CLOUD_LONG account at [$CLOUD_LONG](<https://www.timescale.com/>).
   - Follow the instructions to provision a database.

2. **Note Database Connection Details**
   - Access your database connection information from the $CLOUD_LONG console.
   - Make a note of the following values:
   - Host
   - Port
   - Username
   - Password
   - Database name

3. **Create a Table for Storing Data**
   - Use the `psql` CLI or $CONSOLE to create a table for your time-series data:

   ```sql
   CREATE TABLE sensor_data (

  time TIMESTAMPTZ NOT NULL,
  sensor_id TEXT NOT NULL,
  value DOUBLE PRECISION NOT NULL
 );

 ```

   - Convert the table to a hypertable for better performance:

 ```sql
 SELECT create_hypertable('sensor_data', 'time');
 ```

---

## Step 2: Create an AWS Lambda Function

1. **Initialize a New Lambda Function**
   - Open a terminal and create a new directory for your Lambda function.
   - Initialize a new Node.js project:

 ```bash
 mkdir lambda-timescale && cd lambda-timescale
 npm init -y
 ```

2. **Install Dependencies**
   - Install the PostgreSQL client library for Node.js:

 ```bash
 npm install pg
 ```

3. **Write the Lambda Function**
   - Create a file named `index.js` and add the following code:

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

4. **Set Up Environment Variables**
   - In the AWS Lambda console, navigate to your function's settings and add the following environment variables:
   - `TIMESCALE_HOST`
   - `TIMESCALE_PORT`
   - `TIMESCALE_USER`
   - `TIMESCALE_PASSWORD`
   - `TIMESCALE_DB`

---

## Step 3: Deploy the Lambda Function

1. **Zip Your Code**
   - Compress your code into a `.zip` file:

  ```bash
  zip -r lambda-timescale.zip .
  ```

2. **Deploy to AWS Lambda**
   - Use the AWS CLI to create or update your Lambda function:

  ```bash
  aws lambda create-function \
   --function-name TimescaleIntegration \
   --runtime nodejs14.x \
   --role <IAM_ROLE_ARN> \
   --handler index.handler \
   --zip-file fileb://lambda-timescale.zip
  ```

3. **Test the Lambda Function**
   - Invoke the Lambda function with a test event:

  ```bash
  aws lambda invoke \
   --function-name TimescaleIntegration \
   --payload '{"sensor_id": "sensor-123", "value": 42.5}' \
   response.json
  ```

4. **Verify Data in $CLOUD_LONG**
   - Check the `sensor_data` table to verify the data insertion:

  ```sql
  SELECT * FROM sensor_data;
  ```

---

## Next Steps

- **Scaling**: Configure concurrency settings for your Lambda function to handle higher loads.
- **Monitoring**: Use AWS CloudWatch to monitor Lambda execution and $CLOUD_LONG to monitor database performance.
- **Optimization**: Implement batching in the Lambda function for efficient data insertion.

---

## Troubleshooting

1. **Connection Issues**
   - Verify that your Lambda function's VPC allows outbound connections to the $CLOUD_LONG database.
   - Confirm that your $CLOUD_LONG database accepts connections from your Lambda function's IP range.

2. **Data Insertion Errors**
   - Check the logs in AWS CloudWatch for detailed error messages.
   - Ensure the Lambda function's environment variables are correctly configured.

---

By completing this integration, you can seamlessly ingest and store time-series data from AWS Lambda into $CLOUD_LONG. For advanced use cases, consider exploring Timescale's continuous aggregates and compression features.
