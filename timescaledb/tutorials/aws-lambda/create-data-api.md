# Create a data API for TimescaleDB
This tutorial covers creating an API to fetch data from your TimescaleDB
instance. It uses an API gateway to trigger a Lambda function, that then fetches
the requested data from TimescaleDB and returns it in JSON format.

## Connect to TimescaleDB from Lambda
To connect to the TimescaleDB instance, you need to use a database connector
library. This tutorial uses [`psycopg2`][psycopg2].

The `psycopg2` database connector is not part of the standard Python library,
and is not included in AWS Lambda, so you need to manually include the library
in your deployment package to make it available to use. This tutorial uses
[Lambda Layers][lambda-layers] to include `psycopg2`. A Lambda Layer is an
archive containing additional code, such as libraries or dependencies. Layers
help you use external libraries in your function code that are not be available
otherwise.

Additionally, `psycopg2` needs to be built and compiled with statically linked
libraries, something that you can't do directly in a Lambda function or layer. A
workaround to this issue is to download the
[compiled version of the library][lambda-psycopg2] and use that as a Lambda Layer.

### Procedure: Adding the psycopg2 library as a Lambda layer
1.  Download and unzip the compiled `psycopg2` library:
    ```bash
    wget https://github.com/jkehler/awslambda-psycopg2/archive/refs/heads/master.zip
    unzip master.zip
    ```
1.  In the directory you downloaded the library to, copy the `psycopg2` files
    into a new directory called `python`. Make sure you copy the directory that
    matches your Python version:
    ```bash
    cd awslambda-psycopg2-master/
    mkdir python
    cp -r psycopg2-3.8/ python/
    ```
1.  Zip the `python` directory and upload the zipped file as a Lambda layer:
  ```bash
  zip -r psycopg2_layer.zip python/
  aws lambda publish-layer-version --layer-name psycopg2 \
  --description "psycopg2 for Python3.8" --zip-file fileb://psycopg2_layer.zip \
  --compatible-runtimes python3.8
  ```
1.  At the AWS Lambda console, check to see if your `psycopg2` has been uploaded
    as a Lambda layer:
    ![aws layers](https://assets.timescale.com/docs/images/tutorials/aws-lambda-tutorial/layers.png)

## Create a function to fetch and return data from the database
When the layer is available to your Lambda function, you can create an API to
return data from the database. This section shows you how to create the Python
function that returns data from the database and uploads it to AWS Lambda.

### Procedure: Creating a function to fetch and return data from the database
1.  Create a new directory called `timescaledb_api`, to store the function
    code, and change into the new directory:
    ```bash
    mkdir timescaledb_api
    cd timescaledb_api
    ```
1.  In the new directory, create a new function called `function.py`, with this
    content:
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
When you have created the function, you can zip the Python file and upload it to
Lambda using the `create-function` AWS command.

## Procedure: Uploading the function to AWS Lanbda
1.  At the command prompt, zip the function directory:
  ```bash
  zip function.zip function.py
  ```
1.  Upload the function:
  ```bash
  aws lambda create-function --function-name simple_api_function \
  --runtime python3.8 --handler function.lambda_handler \
  --role <ARN_LAMBDA_ROLE> --zip-file fileb://function.zip
  ```
1.  You can check that the function has been uploaded correctly by using this
    command in the AWS console:
    ![aws lambda uploaded](https://assets.timescale.com/docs/images/tutorials/aws-lambda-tutorial/lambda_function.png)
1.  If you make changes to your function code, you need to zip the file again and use the
`update-function-code` command to upload the changes:
  ```bash
  zip function.zip function.py
  aws lambda update-function-code --function-name simple_api_function --zip-file fileb://function.zip
  ```

## Add database configuration to AWS Lambda
Before you can use the functions, you need to ensure it can connect to the database. In
the Python code above, you specified retrieving values from environment variables, and you also need to specify these within the Lambda environment.

### Procedure: Adding database configuration to AWS Lambda with environment variables
1.  Create a JSON file that contains the variables required for the function:
    ```json
    {
        "Variables": {"DB_NAME": "db",
          "DB_USER": "user",
          "DB_HOST": "host",
          "DB_PORT": "5432",
          "DB_PASS": "pass"}
    }
    ```
1.  Upload your connection details. In this example, the JSON file that contains
    the variables is saved at `file://env.json`:
    ``` bash
    aws lambda update-function-configuration \
    --function-name simple_api_function --environment file://env.json
    ```
1.  When the configuration is uploaded to AWS Lambda, you can reach the
    variables using the `os.environ` parameter in the function:
    ```python
    import os
    config = {'DB_USER': os.environ['DB_USER'],
          'DB_PASS': os.environ['DB_PASS'],
          'DB_HOST': os.environ['DB_HOST'],
          'DB_PORT': os.environ['DB_PORT'],
          'DB_NAME': os.environ['DB_NAME']}
    ```

## Test the database connection
When your function code is uploaded along with the database connection details, you can check to see if it retrieves the data you expect it to.

### Procedure: Testing the database connection
1.  Invoke the function. Make sure you include the name of the function, and
    provide a name for an output file. In this example, the output file is
    called `output.json`:
    ```bash
    aws lambda invoke --function-name simple_api_function output.json
    ```
1.  If your function is working correctly, your output file looks like this:
    ```json
    {
      "statusCode": 200,
      "body": "[
                {
                  \"bucket_day\": \"2021-02-01 00:00:00\",
                  \"symbol\": \"AAPL\",
                  \"avg_price\": 135.32576933380264,
                  \"max_price\": 137.956910987,
                  \"min_price\": 131.131547781
                },
                {
                  \"bucket_day\": \"2021-01-18 00:00:00\",
                  \"symbol\": \"AAPL\",
                  \"avg_price\": 136.7006897398394,
                  \"max_price\": 144.628477898,
                  \"min_price\": 126.675666886
                },
                {
                  \"bucket_day\": \"2021-05-24 00:00:00\",
                  \"symbol\": \"AAPL\",
                  \"avg_price\": 125.4228325920157,
                  \"max_price\": 128.32,
                  \"min_price\": 123.21
                },
                ...
              ]",
      "headers": {
      "Content-Type": "application/json"
      }
    }
    ```

## Create a new API gateway
Now that you have confirmed that the Lambda function works, you can create the
API gateway. In AWS terms, you are setting up a
[custom Lambda integration][custom-lambda-integration].

### Procedure: Creating a new API gateway
1.  Create the API. In this example, the new API is called `TestApiTimescale`.
    Take note of the `id` field in the response, you need to use this to make
    changes later on:
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
1.  Retrieve the `id` of the root resource, to add a new GET endpoint:
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
1.  Create a new resource. In this example, the new resource is called `ticker`:
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
1.  Create a GET request for the root resource:
    ```bash
    aws apigateway put-method --rest-api-id <API_ID> \
    --region us-east-1 --resource-id <RESOURCE_ID> \
    --http-method GET --authorization-type "NONE" \
    --request-parameters method.request.querystring.symbol=false
    ```
1.  Set up a `200 OK` response to the method request
    of `GET /ticker?symbol={symbol}`:
    ```bash
    aws apigateway put-method-response --region us-east-1 \
    --rest-api-id <API_ID> --resource-id <RESOURCE_ID> \
    --http-method GET --status-code 200
    ```
1.  Connect the API Gateway to the Lambda function:
    ```bash
    aws apigateway put-integration --region us-east-1 \
    --rest-api-id <API_ID> --resource-id <RESOURCE_ID> \
    --http-method GET --type AWS --integration-http-method POST \
    --uri <ARN_LAMBDA_FUNCTION> \
    --request-templates file://path/to/integration-request-template.json
    ```
1.  Pass the Lambda function output to the client as a `200 OK` response:
    ```bash
    aws apigateway put-integration-response --region us-east-1 \
    --rest-api-id <API_ID> / --resource-id <RESOURCE_ID> \
    --http-method GET --status-code 200 --selection-pattern ""
    ```
1.  Deploy the API:
    ```bash
    aws apigateway create-deployment --rest-api-id <API_ID> --stage-name test
    ```

## Test the API
You can test the API is working correctly by making a GET request to the
endpoint with `curl`:
```bash
curl 'https://hlsu4rwrkl.execute-api.us-east-1.amazonaws.com/test/ticker?symbol=MSFT'
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

If everything is working properly, you see the output of the Lambda function. In
this example, it's the latest stock price of MSFT (Microsoft) in JSON format.


[psycopg2]: https://www.psycopg.org/docs/
[lambda-layers]: https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html
[lambda-psycopg2]: https://github.com/jkehler/awslambda-psycopg2
[custom-lambda-integration]: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-custom-integrations.html
