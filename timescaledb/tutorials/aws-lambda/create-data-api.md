# Create a data API for TimescaleDB
This tutorial covers how to create an API to fetch data from your TimescaleDB instance. We are using API Gateway to 
trigger a Lambda function which fetches the requested data from TimescaleDB and returns it in JSON format.

## Connect to TimescaleDB from Lambda
To connect to the TimescaleDB instance, you need to use a database connector library. For this tutorial we 
chose [`psycopg2`](https://www.psycopg.org/docs/).

Because `psycopg2` is not part of the standard Python library, and it’s not included in AWS Lambda either, you need to 
manually include this library in your deployment package so that it is available to use. We are going to use [Lambda Layers](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html) for this purpose.

**What’s a Lambda Layer?**

A Lambda Layer is an archive containing additional code, such as libraries or dependencies. Layers help you use external 
libraries in your function code that would not be available otherwise.

Let’s add `psycopg2` as a Lambda Layer so the function will be able to use this library.

One issue is that `psycopg2` needs to be built and compiled with statically linked libraries, something that you can't 
do directly in a Lambda function. A workaround to this issue is to download the [compiled version of the library](https://github.com/jkehler/awslambda-psycopg2) and upload it as a Lambda Layer.

### Procedure: Adding psycopg2 library as a Lambda layer

Download and unzip the compiled `psycopg2` library.
```bash
wget https://github.com/jkehler/awslambda-psycopg2/archive/refs/heads/master.zip
unzip master.zip
```

Cd into the folder and copy the psycopg2 files into a new directory called python.
Note: copy the folder which fits your Python version
```bash
cd awslambda-psycopg2-master/
Mkdir python
cp -r psycopg2-3.8/ python/
```

Zip the python folder and upload the zipped file as a lambda layer using the `lambda publish-layer-version` command.
```bash
zip -r psycopg2_layer.zip python/ 
aws lambda publish-layer-version --layer-name psycopg2 \
--description "psycopg2 for Python3.8" --zip-file fileb://psycopg2_layer.zip \
--compatible-runtimes python3.8
```

Check the AWS Lambda console to see if your `psycopg2` has been uploaded as a Lambda Layer.

![aws layers](https://assets.timescale.com/docs/images/tutorials/aws-lambda-tutorial/layers.png)


Now that the layer is available to your Lambda function, we can create our first API to return data from the database.

## Create a function to fetch and return data from the database
In this step, you create the Python function that returns data from the database and upload it to AWS Lambda.

Create a new project folder called `timescaledb_api` where you will put the function code.
```bash
mkdir timescaledb_api
cd timescaledb_api
```

Create *function.py* with this content:
```python
import json
import psycopg2
import psycopg2.extras
import os
 
def lambda_handler(event, context):
  
   db_name = os.environ['DB_NAME']
   db_user = os.environ['DB_USER']
   db_host = os.environ['DB_HOST']
   db_port = os.environ['DB_PORT']
   db_pass = os.environ['DB_PASS']
  
   conn = psycopg2.connect(user=db_user, database=db_name, host=db_host,
                           password=db_pass, port=db_port)
  
   sql = "SELECT * FROM stocks_intraday"
  
   cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
  
   cursor.execute(sql)
  
   result = cursor.fetchall()
   list_of_dicts = []
   for row in result:
       list_of_dicts.append(dict(row))
  
   return {
       'statusCode': 200,
       'body': json.dumps(list_of_dicts, default=str),
       'headers': {
           "Content-Type": "application/json"
       }
   }
```

## Upload the function in AWS Lambda
ZIP the Python file and upload it to Lambda using the *create-function* AWS command.

```bash
zip function.zip function.py
aws lambda create-function --function-name simple_api_function \
--runtime python3.8 --handler function.lambda_handler \
--role arn:aws:iam::818196790983:role/Lambda --zip-file fileb://function.zip
```

If you go to the AWS console you should see the uploaded Lambda function.
![aws lambda uploaded](https://assets.timescale.com/docs/images/tutorials/aws-lambda-tutorial/lambda_function.png)


Whenever you want to apply changes to your function code, you can just zip the file again and use the 
*update-function-code* command.

```bash
zip function.zip function.py
aws lambda update-function-code --function-name simple_api_function --zip-file fileb://function.zip
```
## Add database configuration to AWS Lambda
Before we can test that the function works, we need to provide database connection information. You may have noticed in 
the Python code above, that we specified retrieving values from environment variables, something you need to specify 
within the Lambda environment 

**Define environment variables**

To upload your connection details, you can use the *update-function-configuration* command with the --environment 
parameter. This command needs a JSON file as an input that contains the variables required for the script. 

Example json file, `env.json`:

```json
{
  "Variables": {"DB_NAME": "db",
          "DB_USER": "user",
          "DB_HOST": "host",
          "DB_PORT": "5432",
          "DB_PASS": "pass"}
}
```

Update the configuration using this JSON file:
```bash
aws lambda update-function-configuration \
--function-name simple_api_function --environment file://env.json
```

When uploaded to AWS Lambda, you can reach these variables using *os.environ* in the function:
```python
import os
config = {'DB_USER': os.environ['DB_USER'],
          'DB_PASS': os.environ['DB_PASS'],
          'DB_HOST': os.environ['DB_HOST'],
          'DB_PORT': os.environ['DB_PORT'],
          'DB_NAME': os.environ['DB_NAME']}
```

Now your function code is uploaded along with the database connection details. Let's see if it retrieves the data we expect!

Lambda function output:
```json
[
   {
     "bucket_day": "2021-02-01 00:00:00",
     "symbol": "AAPL",
     "avg_price": 135.32576933380264,
     "max_price": 137.956910987,
     "min_price": 131.131547781
   },
   {
     "bucket_day": "2021-01-18 00:00:00",
     "symbol": "AAPL",
     "avg_price": 136.7006897398394,
     "max_price": 144.628477898,
     "min_price": 126.675666886
   },
   {
     "bucket_day": "2021-05-24 00:00:00",
     "symbol": "AAPL",
     "avg_price": 125.4228325920157,
     "max_price": 128.32,
     "min_price": 123.21
   },
   ...
]
```
## Create a new API Gateway
Now that the Lambda function works, let’s create the API Gateway.
In AWS terms, you are setting up a [custom Lambda integration](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-custom-integrations.html).

Create the API using the `apigateway create-rest-api` command:
```bash
aws apigateway create-rest-api --name 'TestApiTimescale' --region us-east-1
{
    "id": "4v5u26yw85",
    "name": "TestApiTimescale2",
    "createdDate": "2021-08-23T13:21:13+02:00",
    "apiKeySource": "HEADER",
    "endpointConfiguration": {
        "types": [
            "EDGE"
        ]
    },
    "disableExecuteApiEndpoint": false
}
```
One important field to note in the response is the “id”. You will need to reference this id to make changes to the API Gateway.

You also need to get the id of the root (/) resource to add a new GET endpoint.
Call the `get-resources` command to get the root resource id.

```bash
aws apigateway get-resources --rest-api-id <API_ID> --region us-east-1
{
    "items": [
        {
            "id": "hs26aaaw56",
            "path": "/"
        },
        {
            "id": "r9cakv",
            "parentId": "hs26aaaw56",
            "pathPart": "ticker",
            "path": "/ticker",
            "resourceMethods": {
                "GET": {}
            }
        }
    ]
}

```

Create a new resource with the desired name (in this example ticker).

```bash
aws apigateway create-resource --rest-api-id <API_ID> \
--region us-east-1 --parent-id <RESOURCE_ID> --path-part ticker
{
    "id": "r9cakv",
    "parentId": "hs26aaaw56",
    "pathPart": "ticker",
    "path": "/ticker"
}
```

Create a GET request for the root resource.
```bash
aws apigateway put-method --rest-api-id <API_ID> \
--region us-east-1 --resource-id <RESOURCE_ID> \
--http-method GET --authorization-type "NONE" \
--request-parameters method.request.querystring.symbol=false
```

Set up a *200 OK* response to the method request of GET /ticker?symbol={symbol}.
```bash
aws apigateway put-method-response --region us-east-1 \
--rest-api-id <API_ID> --resource-id r9cakv \
--http-method GET --status-code 200
```

Connect the API Gateway to the Lambda function.
```bash
aws apigateway put-integration --region us-east-1 \
--rest-api-id <API_ID> --resource-id <RESOURCE_ID> \
--http-method GET --type AWS --integration-http-method POST \
--uri arn:aws:lambda:us-east-1:818196790983:function:simple_timescale/invocations \
--request-templates file://path/to/integration-request-template.json
```

Pass the Lambda function output to the client as *200 OK* response.
```bash
aws apigateway put-integration-response --region us-east-1 \
--rest-api-id <API_ID> / --resource-id <RESOURCE_ID> \
--http-method GET --status-code 200 --selection-pattern ""
```

Finally, deploy.
```bash
aws apigateway create-deployment --rest-api-id <API_ID> --stage-name test
```
## Test the API

Let’s make a GET request to the API endpoint using `curl`.
```bash
curl 'https://hlsu4rwrkl.execute-api.us-east-1.amazonaws.com/test/ticker?symbol=MSFT’
[
   {
     "time": "2021-07-12 20:00:00",
     "price_open": 277.31,
     "price_close": 277.31,
     "price_low": 277.31,
     "price_high": 277.31,
     "trading_volume": 342,
     "symbol": "MSFT"
   }
]

```

If you did everything correctly, you should see the output of the Lambda function, which in this example, is the 
latest stock price of MSFT (Microsoft) in JSON format.