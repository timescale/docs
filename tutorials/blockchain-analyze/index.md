---
title: Analyze the Bitcoin blockchain
excerpt: Use TimescaleDB hyperfunctions to analyze transactions on the Bitcoin blockchain. This tutorial illustrates how to analyze the fees, the impact on BTC-USD, the average miner revenue, and more
products: [cloud, self_hosted, mst]
keywords: [intermediate, crypto, blockchain, Bitcoin, finance, analytics]
layout_components: [next_prev_large]
content_group: Analyze the Bitcoin blockchain
---

import FinancialIndustry from "versionContent/_partials/_financial-industry-data-analysis.mdx";

# Analyze the Bitcoin blockchain

<FinancialIndustry />

In this tutorial, you use $CLOUD_LONG to ingest, store, and analyze transactions
on the Bitcoin blockchain.

[Blockchains][blockchain-def] are, at their essence, a distributed database. The
[transactions][transactions-def] in a blockchain are an example of time-series data. You can use
$TIMESCALE_DB to query transactions on a blockchain, in exactly the same way as you
might query time-series transactions in any other database.

## Prerequisites

Before you begin, make sure you have:

*   Signed up for a [free $ACCOUNT_LONG][cloud-install].
*   [](#)<Optional />Signed up for a [Grafana account][grafana] to graph your queries.

## Steps in this tutorial

This tutorial covers:

1.  [Setting up your dataset][blockchain-dataset]
1.  [Querying your dataset][blockchain-analyze]

## About analyzing the Bitcoin blockchain with $CLOUD_LONG

This tutorial uses a sample Bitcoin dataset to show you how to aggregate
blockchain transaction data, and construct queries to analyze information from
the aggregations. The queries in this tutorial help you
determine if a cryptocurrency has a high transaction fee, shows any correlation
between transaction volumes and fees, or if it's expensive to mine.

It starts by setting up and connecting to a $SERVICE_LONG, create tables,
and load data into the tables using `psql`. If you have already completed the
[beginner blockchain tutorial][blockchain-query], then you already have the
dataset loaded, and you can skip straight to the queries.

You then learn how to conduct analysis on your dataset using Timescale
hyperfunctions. It walks you through creating a series of continuous aggregates,
and querying the aggregates to analyze the data. You can also use those queries
to graph the output in Grafana.

[cloud-install]: /getting-started/:currentVersion:/services/#create-a-tiger-cloud-account
[blockchain-dataset]: /tutorials/:currentVersion:/blockchain-analyze/blockchain-dataset/
[blockchain-analyze]: /tutorials/:currentVersion:/blockchain-analyze/analyze-blockchain-query/
[blockchain-query]: /tutorials/:currentVersion:/blockchain-query/beginner-blockchain-query/
[blockchain-def]: https://www.pcmag.com/encyclopedia/term/blockchain
[transactions-def]: https://www.pcmag.com/encyclopedia/term/bitcoin-transaction
[grafana]: /integrations/:currentVersion:/grafana/
