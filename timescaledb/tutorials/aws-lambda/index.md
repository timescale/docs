# TimescaleDB with AWS Lambda
This section contains tutorials for working with AWS Lambda and TimescaleDB.

*   [Create a data API for TimescaleDB](/tutorials/aws-lambda/create-data-api)
    using AWS Lambda and API Gateway.
*   [Pull data from 3rd party API and ingest into TimescaleDB](/tutorials/aws-lambda/3rd-party-api-ingest)
    using AWS Lambda and Docker. This is great if you have a lot of dependencies.
*   [Continuously deploy your Lambda function with GitHub Actions](/tutorials/aws-lambda/continuous-deployment)
    using Github Actions.

## Prerequisites
Before you begin, make sure you have completed the
[Analyze intraday stock data tutorial](https://docs.timescale.com/timescaledb/latest/tutorials/analyze-intraday-stocks/).
This tutorial needs the tables and data that you set up in that tutorial.

To complete this tutorial, you need an AWS account, and be able to access the
AWS command-line interface (CLI). To check if you have AWS CLI installed, use
this command at the command prompt. If it is installed, the command shows the
version number, like this:

```bash
aws --version
aws-cli/2.2.18 Python/3.8.8 Linux/5.10.0-1044-oem exe/x86_64.ubuntu.20 prompt/off
```

For more information about installing the AWS CLI, see
[the AWS installation instructions][aws-install].

<highlight type="cloud" header="VPC on Timescale Cloud" button="Try for free">
If you are completing this tutorial in Timescale Cloud, make sure you have
created a VPC on both AWS, and on your database in Timescale Cloud. For more
information about setting up a VPC, see the
[Timescale Cloud VPC section](https://docs.timescale.com/cloud/latest/service-operations/vpc/).
</highlight>

## Programming language
The code examples in this tutorial use Python, but you can use any language
[supported by AWS Lambda][lambda-supported-langs].

## Resources
For more information about the topics in this tutorial, check out these resources:

*   [AWS CLI Version 2 References](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/index.html)
*   [Creating Lambda container images](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html)
*   [Getting started with AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/getting-started.html)
*   [Analyze historical intraday stock data](/tutorials/analyze-intraday-stocks)
*   [Analyze cryptocurrency market data](/tutorials/analyze-cryptocurrency-data)

[aws-install]: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html
[lambda-supported-langs]: https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html
