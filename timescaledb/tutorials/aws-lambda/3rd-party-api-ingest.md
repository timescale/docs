# Pull data from third-party API and ingest into TimescaleDB (Docker)
In this section, you build a data pipeline which pulls data from a third-party finance API and loads it into TimescaleDB.

**Required libraries:**

* pandas
* requests
* psycopg2
* pgcopy

This tutorial requires multiple libraries. This can make your deployment package size 
larger than the 250MB limit of Lambda. With a Docker container, your package
size can be up to 10GB which gives you much more flexibility regarding what 
libraries and dependencies you can use. For more about AWS Lambda container support, see the 
[AWS documentation](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html).
To complete this tutorial, you need to complete these procedures:
1. Create ETL function
1. Add requirements.txt
1. Create the Dockerfile
1. Upload the image to ECR
1. Create Lambda function from the container

## Create ETL function
This is an example function that pulls data from a finance API called Alpha Vantage, and 
inserts the data into TimescaleDB. The connection is made using the values from 
environment variables:
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
       month (int): month value as an integer 1-24 (for example month=4 will fetch data from the last 4 months)
 
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

## Add requirements.txt
Add a text file to your project called `requirements.txt` that includes all the libraries that 
you need installed. For example, if you need pandas, requests, psycopg2 and pgcopy 
your `requirements.txt` looks like this:

```
pandas
requests
psycopg2-binary
pgcopy
```

<highlight type="note">
We use `psycopg2-binary` instead of `psycopg2` in the `requirements.txt` file. The binary version
of the library contains all its dependencies, which means that you don’t need to install them separately.
</highlight>

## Create the Dockerfile

Dockerfile:
```dockerfile
# Use a AWS Lambda base image
FROM public.ecr.aws/lambda/python:3.8

# Copy all project files to the root folder
COPY function.py .
COPY requirements.txt .

# Install libraries
RUN pip install -r requirements.txt

CMD ["function.handler"]
```

## Upload the image to ECR
To connect the container image to a Lambda function, you need to start by uploading 
it to the AWS Elastic Container Registry (ECR).

Login to Docker CLI:
```bash
aws ecr get-login-password --region us-east-1 \
| docker login --username AWS \
--password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
```

Build image:
```bash
docker build -t lambda-image .
```

Create repository in ECR:
```bash
aws ecr create-repository --repository-name lambda-image
```

Tag your image to match the repository name, and deploy the image to Amazon ECR 
using the `docker push` command:
```bash
docker tag lambda-image:latest <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/lambda-image:latest
docker push <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/lambda-image:latest        

```

## Create Lambda function from the container
You can use the same Lambda `create-function` command as you used earlier, but this 
time you need to define the `--package-type` parameter as `image`, and add the ECR 
Image URI using the `--code` flag:

```bash
aws lambda create-function --region us-east-1 \
--function-name docker_function --package-type Image \
--code ImageUri=<ECR Image URI> --role arn:aws:iam::818196790983:role/Lambda
```

## Schedule your Lambda function
If you want to run your Lambda function periodically, you can set up an EventBridge trigger.
Create a new rule with a cron-like expression. For example, if you want to run the function everyday at 9am, 
you can use this expression: `cron(0 9 * * ? *)`.

```bash
aws events put-rule --name schedule-lambda --schedule-expression 'cron(0 9 * * ? *)'
```

If you encounter the `Parameter ScheduleExpression is not valid` error message, have a look at the [cron expression examples in the EventBridge docs](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule-schedule.html#eb-cron-expressions).

Grant the necessary permissions for the Lambda function:
```bash
aws lambda add-permission --function-name <FUNCTION_NAME> \
--statement-id my-scheduled-event --action 'lambda:InvokeFunction' \
--principal events.amazonaws.com
```

To add the function to the EventBridge rule, create a `targets.json` file containing a memorable, unique string, 
and the ARN of the Lambda Function:
```json
[
  {
    "Id": "docker_lambda_trigger",
    "Arn": "<FUNCTION_ARN>"
  }
]
```

When you have finished, use the `events put-target` command to add the target (the lambda function to be invoked) to the rule.
```bash
aws events put-targets --rule schedule-lambda --targets file://targets.json
```

To check if the rule is connected to the Lambda function, in the AWS console, navigate to Amazon EventBridge > Events > Rules, and
select your rule and the Lambda function’s name should be under “Target(s)”.

![aws eventbridge lambda](https://assets.timescale.com/docs/images/tutorials/aws-lambda-tutorial/targets.png)


## Conclusion
AWS Lambda is a popular tool of choice for running your data pipelines. It’s scalable, serverless and works like magic. I hope this tutorial was useful to get you started using TimescaleDB with AWS Lambda. 

## Resources

* [AWS CLI Version 2 References](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/index.html)
* [Creating Lambda container images](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html)
* [Getting started with AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/getting-started.html)
* [Analyze historical intraday stock data](/tutorials/analyze-intraday-stocks)
* [Analyze cryptocurrency market data](/tutorials/analyze-cryptocurrency-data)
