---
title: Lambda continuous deployment with GitHub actions
excerpt: Build a continuous deployment pipeline between GitHub and AWS Lambda
products: [cloud, mst, self_hosted]
keywords: [finance, analytics, AWS Lambda, psycopg2, pandas, GitHub Actions, pipeline]
---

# Lambda continuous deployment with GitHub actions

This tutorial builds a continuous deployment (CD) pipeline between GitHub and
AWS Lambda using GitHub actions.

Packaging and deploying your function and its dependencies with AWS Lambda can
sometimes be a tedious job. Especially if you also want to use a source code
management platform like GitHub to develop your code before pushing  it to AWS
Lambda.

You can use GitHub actions to set up automatic deployment for AWS Lambda from a
Github repository. You need to push a commit to the `main` or `master` branch of
your repository, then let GitHub actions create the deployment  package, and
deploy your code to AWS Lambda.

## Prerequisites

*   Git ([installation options here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git))
*   GitHub CLI tool ([installation options here](https://github.com/cli/cli#installation))
*   AWS account

<Procedure>

## Creating a new Lambda function in AWS console

1.  Create a new Lambda function called `lambda-cd` by navigating to the AWS Lambda console and creating a new function:
    ![create new function](https://assets.timescale.com/docs/images/tutorials/aws-lambda-tutorial/create_new_function.png)
1.  Add `lambda-cd` as your function name, choose your preferred runtime environment, and click `Create function`:
    ![create lambda from scratch](https://assets.timescale.com/docs/images/tutorials/aws-lambda-tutorial/from_scratch.png)
    Take a note of the function name, you need it later to configure the deployment file.

</Procedure>

<Procedure>

## Creating a new GitHub repository

Now you can create a new GitHub repository which contains the function code.

1.  Create a new GitHub [repository](https://github.com/new).
1.  On your local system, create a new project folder called `lambda-cd`:

    ```bash
    mkdir lambda-cd
    cd lambda-cd
    ```

1.  Create the Lambda function that you want to upload.
    As an example, here's a Python Lambda function which returns data from a TimescaleDB table called `stocks_intraday`
    ([read the tutorial to build a TimescaleDB API with Lambda here][create-data-api]).

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

1.  Initialize a git repository and push the project to GitHub:

    ```bash
    git init
    git add function.py
    git commit -m "Initial commit: add Lambda function"
    git branch -M main
    git remote add origin <YOUR_GITHUB_PROJECT_URL.git>
    git push -u origin main
    ```

</Procedure>

At this point, you have a GitHub repository with just the Lambda function in it. Now you can connect this repository
to the AWS Lambda function.

## Connect GitHub and AWS Lambda

Connect the Github repository to AWS Lambda using Github actions.

<Procedure>

### Adding your AWS credentials to the repository

You need to add your AWS credentials to the repository so it has permission to connect to Lambda.
You can do this by adding [GitHub secrets][github-secrets] using the GitHub command-line.

1.  Authenticate with GitHub:

    ```bash
    gh auth login
    ```

    Choose which account you want to log in to. Authenticate with your GitHub
    password or authentication token.
1.  Add AWS credentials as GitHub secrets.
    By using GitHub secrets, your credentials are encrypted and cannot be seen
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

1.  To make sure your credentials have been uploaded correctly, you can list the available GitHub secrets:

    ```bash
    gh secret list
    AWS_ACCESS_KEY_ID      Updated 2021-09-13
    AWS_SECRET_ACCESS_KEY  Updated 2021-09-13
    AWS_REGION             Updated 2021-09-13
    ```

</Procedure>

Now you know that you have your AWS credentials available for the repository to use.

<Procedure>

### Setting up GitHub actions

You can now set up some automation based on the ["AWS Lambda Deploy" GitHub action](https://github.com/marketplace/actions/aws-lambda-deploy)
to auto-deploy to AWS Lambda.

1.  Create a new YAML file that contains the deployment configuration:

    ```bash
    touch .github/workflows/main.yml
    ```

1.  Add this content to the file:

    ```yml
    name: deploy to lambda
    on:
      # Trigger the workflow on push or pull request,
      # but only for the main branch
      push:
        branches:
          - main
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

    This configuration deploys the code to Lambda when there's a new push to the main branch.

    As you can also see in the YAML file, the AWS credentials are accessed using the `${{ secrets.AWS_ACCESS_KEY_ID }}`
    syntax.
    Make sure to use the name of the Lambda function (as displayed in the AWS console) for the `function_name`
    property in this configuration file. ("lambda-cd" in this example).

</Procedure>

<Procedure>

### Testing the pipeline

You can test if the hook works by pushing the changes to GitHub.

1.  Push the changes to the repository:

    ```bash
    git add .github/workflows/main.yml
    git commit -m "Add deploy configuration file"
    git add function.py
    git commit -m "Update function code"
    git push
    ```

1.  Navigate to the GitHub actions page of your repository, to see the build run and succeed:
    ![github action build](https://assets.timescale.com/docs/images/tutorials/aws-lambda-tutorial/github_action_lambda.png)

</Procedure>

You now have a continuous deployment pipeline set up between GitHub and AWS Lambda.

[create-data-api]: /tutorials/:currentVersion:/aws-lambda/create-data-api/
[github-secrets]: https://docs.github.com/en/actions/reference/encrypted-secrets
