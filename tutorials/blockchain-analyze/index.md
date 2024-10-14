---
title: Analyze the Bitcoin blockchain
excerpt: Analyze the Bitcoin blockchain
products: [cloud]
keywords: [intermediate, crypto, blockchain, Bitcoin, finance, analytics]
layout_components: [next_prev_large]
content_group: Analyze the Bitcoin blockchain
---

# Analyze the Bitcoin blockchain

[Blockchains][blockchain-def] are, at their essence, a distributed database. The
[transactions][transactions-def] in a blockchain are an example of time-series
data. You can use $COMPANY to query transactions on a blockchain, in exactly the
same way as you might query time-series transactions in any other database.

In this tutorial, you use $COMPANY hyperfunctions to analyze transactions
on the Bitcoin blockchain. You can use these instructions to query any type of data on a
blockchain, including other cryptocurrencies, smart contracts, or health data.

## Prerequisites

Before you begin, make sure you have:

*   Signed up for a [free $COMPANY account][cloud-install].
*   [](#)<Optional />Signed up for a [Grafana account][grafana-setup] to graph your queries.

## Steps in this tutorial

This tutorial covers:

1.  [Setting up your dataset][blockchain-dataset]
1.  [Querying your dataset][blockchain-analyze]

## About analyzing the Bitcoin blockchain with $COMPANY

This tutorial uses a sample Bitcoin dataset to show you how to aggregate
blockchain transaction data, and construct queries to analyze information from
the aggregations. The queries in this tutorial help you
determine if a cryptocurrency has a high transaction fee, shows any correlation
between transaction volumes and fees, or if it's expensive to mine.

It starts by setting up and connecting to a $COMPANY database, create tables,
and load data into the tables using `psql`. If you have already completed the
[beginner blockchain tutorial][blockchain-query], then you already have the
dataset loaded, and you can skip straight to the queries.

You then learn how to conduct analysis on your dataset using $COMPANY
hyperfunctions. It walks you through creating a series of $CAGGs,
and querying the aggregates to analyze the data. You can also use those queries
to graph the output in Grafana.

[cloud-install]: /getting-started/:currentVersion:/#create-your-timescale-account
[blockchain-dataset]: /tutorials/:currentVersion:/blockchain-analyze/blockchain-dataset/
[blockchain-analyze]: /tutorials/:currentVersion:/blockchain-analyze/analyze-blockchain-query/
[blockchain-query]: /tutorials/:currentVersion:/blockchain-query/beginner-blockchain-query/
[blockchain-def]: https://www.pcmag.com/encyclopedia/term/blockchain
[transactions-def]: https://www.pcmag.com/encyclopedia/term/bitcoin-transaction
[grafana-setup]: /use-timescale/:currentVersion:/integrations/observability-alerting/grafana/installation/
