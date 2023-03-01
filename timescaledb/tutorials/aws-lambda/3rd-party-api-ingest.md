---
title: Pull and ingest data from a third-party API
excerpt: Build a data pipeline to pull data from a third-party finance API into TimescaleDB
products: [cloud, mst, self_hosted]
keywords: [finance, analytics, AWS Lambda, psycopg2, pandas, GitHub Actions, pipeline]
---

# Pull and ingest data from a third-party API

This tutorial builds a data pipeline that pulls data from a third-party finance
API and loads it into TimescaleDB.

This tutorial requires multiple libraries. This can make your deployment package
size  larger than the 250&nbsp;MB limit of Lambda. You can use a Docker
container to extend the package size up to 10&nbsp;GB, giving you much more
flexibility in libraries and dependencies. For more about AWS Lambda container
support, see the [AWS documentation][aws-lambda-docs].

The libraries used in this tutorial:

*   [`pandas`][pandas]
*   `requests`
*   [`psycopg2`][psycopg2]
*   [`pgcopy`][pgcopy]

## Create an ETL function

Extract, transform, and load (ETL) functions are used to pull data from one
database and ingest the data into another. In this tutorial, the ETL function
pulls data from a finance API called Alpha Vantage, and inserts the data into
TimescaleDB. The connection is made using the values from environment variables.

This is the ETL function used in this tutorial:

```python
# function.py:
import csv
import pandas as pd
import psycopg2
from pgcopy import CopyManager
import os

config = {'DB_USER': os.environ['DB_USER'],
         'DB_PASS': os.environ['DB_PASS'],
         'DB_HOST': os.environ['DB_HOST'],
         'DB_PORT': os.environ['DB_PORT'],
         'DB_NAME': os.environ['DB_NAME'],
         'APIKEY': os.environ['APIKEY']}

conn = psycopg2.connect(database=config['DB_NAME'],
                           host=config['DB_HOST'],
                           user=config['DB_USER'],
                           password=config['DB_PASS'],
                           port=config['DB_PORT'])
columns = ('time', 'price_open', 'price_close',
          'price_low', 'price_high', 'trading_volume', 'symbol')

def get_symbols():
   """Read symbols from a csv file.

   Returns:
       [list of strings]: symbols
   """
   with open('symbols.csv') as f:
       reader = csv.reader(f)
       return [row[0] for row in reader]

def fetch_stock_data(symbol, month):
   """Fetches historical intraday data for one ticker symbol (1-min interval)

   Args:
       symbol (string): ticker symbol
       month (int): month value as an integer 1-24 (for example month=4 fetches data from the last 4 months)

   Returns:
       list of tuples: intraday (candlestick) stock data
   """
   interval = '1min'
   slice = 'year1month' + str(month) if month <= 12 else 'year2month1' + str(month)
   apikey = config['APIKEY']
   CSV_URL = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY_EXTENDED&' \
             'symbol={symbol}&interval={interval}&slice={slice}&apikey={apikey}' \
             .format(symbol=symbol, slice=slice, interval=interval,apikey=apikey)
   df = pd.read_csv(CSV_URL)
   df['symbol'] = symbol

   df['time'] = pd.to_datetime(df['time'], format='%Y-%m-%d %H:%M:%S')
   df = df.rename(columns={'time': 'time',
                           'open': 'price_open',
                           'close': 'price_close',
                           'high': 'price_high',
                           'low': 'price_low',
                           'volume': 'trading_volume'}
                           )
   return [row for row in df.itertuples(index=False, name=None)]

def handler(event, context):
   symbols = get_symbols()
   for symbol in symbols:
       print("Fetching data for: ", symbol)
       for month in range(1, 2):
           stock_data = fetch_stock_data(symbol, month)
           print('Inserting data...')
           mgr = CopyManager(conn, 'stocks_intraday', columns)
           mgr.copy(stock_data)
           conn.commit()
```

## Add a requirements file

When you have created the ETL function, you need to include the libraries you want to install. You can do this by creating a text file in your project called `requirements.txt` that lists the libraries. This is the `requirements.txt` file used in this tutorial:

```txt
pandas
requests
psycopg2-binary
pgcopy
```

<Highlight type="note">
This example uses `psycopg2-binary` instead of `psycopg2` in the
`requirements.txt` file. The binary version of the library contains all its
dependencies, so that you don't need to install them separately.
</Highlight>

## Create the Dockerfile

When you have the requirements set up, you can create the Dockerfile for the project.

<Procedure>

### Creating the Dockerfile

1.  Use an AWS Lambda base image:

    ```docker
    FROM public.ecr.aws/lambda/python:3.8
    ```

1.  Copy all project files to the root directory:

    ```docker
    COPY function.py .
    COPY requirements.txt .
    ```

1.  Install the libraries using the requirements file:

    ```docker
    RUN pip install -r requirements.txt
    CMD ["function.handler"]
    ```

</Procedure>

## Upload the image to ECR

To connect the container image to a Lambda function, you need to upload it to
the AWS Elastic Container Registry (ECR).

<Procedure>

### Uploading the image to ECR

1.  Log in to the Docker command line interface:

    ```bash
    aws ecr get-login-password --region us-east-1 \
    | docker login --username AWS \
    --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
    ```

1.  Build the image:

    ```bash
    docker build -t lambda-image .
    ```

1.  Create a repository in ECR. In this example, the repository is
    called `lambda-image`:

    ```bash
    aws ecr create-repository --repository-name lambda-image
    ```

1.  Tag your image using the same name as the repository:

    ```bash
    docker tag lambda-image:latest <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/lambda-image:latest
    ```

1.  Deploy the image to Amazon ECR with Docker:

    ```bash
    docker push <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/lambda-image:latest        
    ```

</Procedure>

## Create a Lambda function from the container

To create a Lambda function from your container, you can use the Lambda
`create-function` command. You need to define the `--package-type` parameter as
`image`, and add the ECR Image URI using the `--code` flag:

```bash
aws lambda create-function --region us-east-1 \
--function-name docker_function --package-type Image \
--code ImageUri=<ECR Image URI> --role <ARN_LAMBDA_ROLE>
```

## Schedule the Lambda function

If you want to run your Lambda function according to a schedule, you can set up
an EventBridge trigger. This creates a rule using a [`cron` expression][cron-examples].

<Procedure>

### Scheduling the Lambda function

1.  Create the schedule. In this example, the function runs every day at 9 AM:

    ```bash
    aws events put-rule --name schedule-lambda --schedule-expression 'cron(0 9 * * ? *)'
    ```

1.  Grant the necessary permissions for the Lambda function:

    ```bash
    aws lambda add-permission --function-name <FUNCTION_NAME> \
    --statement-id my-scheduled-event --action 'lambda:InvokeFunction' \
    --principal events.amazonaws.com
    ```

1.  Add the function to the EventBridge rule, by creating a `targets.json` file
    containing a memorable, unique string, and the ARN of the Lambda Function:

    ```json
    [
      {
        "Id": "docker_lambda_trigger",
        "Arn": "<ARN_LAMBDA_FUNCTION>"
      }
    ]
    ```

1.  Add the Lambda function, referred to in this command as the `target`, to
    the rule:

    ```bash
    aws events put-targets --rule schedule-lambda --targets file://targets.json
    ```

</Procedure>

<Highlight type="important">
If you get an error saying `Parameter ScheduleExpression is not valid`, you
might have made a mistake in the cron expression. Check the [cron expression examples](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule-schedule.html#eb-cron-expressions)
documentation.
</Highlight>

You can check if the rule is connected correctly to the Lambda function in the
AWS console. Navigate to Amazon EventBridge → Events → Rules, and click the rule
you created. The Lambda function's name is listed under `Target(s)`:

<img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/aws-lambda-tutorial/targets.png" alt="Lamdba function target in AWS Console"/>

[aws-lambda-docs]: https://docs.aws.amazon.com/lambda/latest/dg/images-create.html
[cron-examples]: https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule-schedule.html#eb-cron-expressions
[pandas]: https://pandas.pydata.org/
[pgcopy]: https://github.com/G-Node/pgcopy
[psycopg2]: https://github.com/jkehler/awslambda-psycopg2
