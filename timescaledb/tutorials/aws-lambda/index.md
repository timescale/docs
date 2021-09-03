# TimescaleDB with AWS Lambda 

In this section, you will find tutorials for working with AWS Lambda and TimescaleDB. 

* [Create a data API for TimescaleDB (AWS Lambda + API Gateway)](/tutorials/aws-lambda/create-data-api)
* [Pull data from 3rd party API and ingest into TimescaleDB (AWS Lambda + Docker)](/tutorials/aws-lambda/3rd-party-api-ingest)

In some cases you may need to use Lambda to run a Docker image when your dependencies grow beyond the supported size, 
something we cover in the second tutorial.

## Prerequisites
To complete this tutorial, you will need an AWS account and AWS CLI.

To check if you have AWS CLI installed, run the `aws --version` command:
```bash
aws --version
aws-cli/2.2.18 Python/3.8.8 Linux/5.10.0-1044-oem exe/x86_64.ubuntu.20 prompt/off
```

If you do not have it installed, please follow the [instructions provided by AWS here.](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)

It’s also required that you complete the [Analyze intraday stock data tutorial](https://docs.timescale.com/timescaledb/latest/tutorials/analyze-intraday-stocks/) first because it sets up the needed tables and data that is used in this tutorial.

## Programming language

The code examples throughout the tutorial use Python as the programming language but you can use any other language 
you prefer as long as it’s [supported by AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html).
