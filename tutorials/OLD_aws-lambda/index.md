---
title: TimescaleDB with AWS Lambda
excerpt: Learn to use AWS Lambda and TimescaleDB together
products: [cloud, mst, self_hosted]
keywords: [finance, analytics, AWS Lambda, psycopg2, pandas, GitHub Actions, pipeline]
---

# $TIMESCALE_DB with AWS Lambda

This section contains tutorials for working with AWS Lambda and $TIMESCALE_DB.

*   Create a data API for $TIMESCALE_DB using AWS Lambda and
    API Gateway.
*   Pull data from third-party API and ingest into $TIMESCALE_DB
    using AWS Lambda and Docker. This is great if you have a lot of dependencies.
*   Continuously deploy your Lambda function with GitHub Actions
    using Github Actions.

## Prerequisites

Before you begin, make sure you have completed the
Analyze intraday stock data tutorial.
This tutorial needs the tables and data that you set up in that tutorial.

To complete this tutorial, you need an AWS account. You also need access to the
AWS command-line interface (CLI). To check if you have AWS CLI installed, use
this command at the command prompt. If it is installed, the command shows the
version number, like this:

```bash
aws --version
aws-cli/2.2.18 Python/3.8.8 Linux/5.10.0-1044-oem exe/x86_64.ubuntu.20 prompt/off
```

For more information about installing the AWS CLI, see
[the AWS installation instructions][install-aws-cli].

<Highlight type="cloud" header="VPC on Timescale" button="Try for free">
If you are completing this tutorial in Timescale, make sure you have
created a VPC on both AWS, and on your database in Timescale. For more
information about setting up a VPC, see the
[VPC section](/use-timescale/:currentVersion:/vpc/).
</Highlight>

## Programming language

The code examples in this tutorial use Python, but you can use any language
[supported by AWS Lambda][lambda-supported-langs].

## Resources

For more information about the topics in this tutorial, check out these resources:

*   AWS CLI Version 2 References
*   Creating Lambda container images
*   Getting started with AWS Lambda
*   Analyze historical intraday stock data
*   Analyze cryptocurrency market data

[install-aws-cli]: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html
[lambda-supported-langs]: https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html
