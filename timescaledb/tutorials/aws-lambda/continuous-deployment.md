# Lambda continuous deployment with Github Actions

This tutorial builds a continuous deployment (CD) pipeline between Github and AWS Lambda using Github Actions.

When using AWS Lambda, packaging and deploying your function and its dependencies can be a tedious job. What if you
also want to use a source code management platform like Github to develop your code before pushing it to AWS Lambda?

Luckily, you can use Github actions to set up automatic deployment for AWS Lambda from a Github repository.
You just need to push a commit to your main/master branch of your repository then let Github Actions do the heavy
lifting, creating the deployment package and deploying your code to AWS Lambda.

## Prerequisites
* Git ([installation options here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git))
* Github CLI tool ([installation options here](https://github.com/cli/cli#installation))
* AWS account

## Create a new Lambda function in AWS console

Create a new Lambda function called "lambda-cd"
Navigate to the AWS Lambda console and create a new function:
![create new function](https://docs.timescale.com/timescaledb/latest/tutorials/aws-lambda/create_new_function.png)


Add "lambda-cd" as your function name and choose your preferred runtime environment:

![create lambda from scratch](https://docs.timescale.com/timescaledb/latest/tutorials/aws-lambda/from_scratch.png)


After clicking "Create function", you have created a Lambda function called "lambda-cd". Remember the name of the function because later you'll need to reference this
to configure the deployment file.

## Create a new Github repository

Now let's create a new Github repository which contains the function code.

1. Create a new Github [repository](https://github.com/new).
![lambda github repo](image url)
2. On your computer, create a new project folder called `lambda-cd`:
```bash
mkdir lambda-cd
cd lambda-cd
```
3. Create the Lambda function that you want to upload.
As an example, here's a Python Lambda function which returns data from a TimescaleDB table called `stocks_intraday`
([read the tutorial to build a TimescaleDB API with Lambda here](/tutorials/aws-lambda/create-data-api/)).
```bash
touch function.py
```

```python
# function.py:
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
    
    sql = "SELECT * FROM stocks_intraday ORDER BY time DESC LIMIT 10"
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cursor.execute(sql)
    result = cursor.fetchall()
    
    return {
        'statusCode': 200,
        'body': json.dumps(list_of_dicts, default=str),
        'headers': {
            "Content-Type": "application/json"
        }
    }
```
4. Initialize a git repository and push the project to Github:
```bash
git init
git add function.py
git commit -m "Initial commit: add Lambda function"
git branch -M master
git remote add origin <YOUR_GITHUB_PROJECT_URL.git>
git push -u origin master
```

At this point, you have a Github repo with just the Lambda function in it. Let's see how to connect this repo to the AWS Lambda function.

## Connect Github and AWS Lambda
### Add your AWS credentials to the repository
You need to add your AWS credentials to the repository so it will have permission to connect to Lambda. You can do this
by adding [Github secrets](https://docs.github.com/en/actions/reference/encrypted-secrets) using the Github CLI.

1. Authenticate with a GitHub:
```bash
gh auth login
```
This will prompt you to choose what account you want to log into using either your password or Github
authentication token.

2. Add AWS credentials as Github secrets. By using Github secrets, your credentials are encrypted and cannot be seen 
publicly. Use the `gh secret set` command to upload your AWS credentials one by one 
(you'll be prompted to paste the values for each one):

AWS_ACCESS_KEY_ID:
```bash
gh secret set AWS_ACCESS_KEY_ID
```

AWS_SECRET_ACCESS_KEY:
```bash
gh secret set AWS_SECRET_ACCESS_KEY
```

AWS_REGION:
```bash
gh secret set AWS_REGION
```

To make sure your credentials have been uploaded correctly, you can list the available Github secrets:
```bash
gh secret list
AWS_ACCESS_KEY_ID      Updated 2021-09-13
AWS_SECRET_ACCESS_KEY  Updated 2021-09-13
AWS_REGION             Updated 2021-09-13
```

Now you know that you have your AWS credentials available for the repository to use.

### Set up Github Actions
You will set up a new automation based on the ["AWS Lambda Deploy" Github Action](https://github.com/marketplace/actions/aws-lambda-deploy)
to auto-deploy to AWS Lambda.

Create a new YAML file (this will contain the deployment configuration):

```bash
touch .github/workflows/main.yml
```

And add this to the file:
```yml
name: deploy to lambda
on:
  # Trigger the workflow on push or pull request,
  # but only for the main branch
  push:
    branches:
      - master
jobs:

  deploy_source:
    name: deploy lambda from source
    runs-on: ubuntu-latest
    steps:
      - name: checkout source code
        uses: actions/checkout@v1
      - name: default deploy
        uses: appleboy/lambda-action@master
        with:
          aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws_region: ${{ secrets.AWS_REGION }}
          function_name: lambda-cd
          source: function.py
```

This configuration will make sure to deploy the code to Lambda when there's a new push to the master branch.

As you can also see in the YAML file, the AWS credentials are accessed using the `${{ secrets.AWS_ACCESS_KEY_ID }}` syntax.

Also make sure the use the same function name in this configuration file as what's the name of the Lambda function in
the AWS console ("lambda-cd" in this example).

### Test the pipeline

You can test if the hook works by pushing the changes.

```bash
git add .github/workflows/main.yml
git commit -m "Add deploy configuration file"
git add function.py
git commit -m "Update function code"
git push
```

After pushing the changes, you can navigate to the Github Actions page of your repository, to see the build run and succeed:

![github action build](https://docs.timescale.com/timescaledb/latest/tutorials/aws-lambda/github_action_lambda.png)

With this step completed, you have a continuous deployment pipeline set up between Github and AWS Lambda.
