---
title: Query the Bitcoin blockchain
excerpt: Query the Bitcoin blockchain
products: [cloud]
keywords: [beginner, crypto, blockchain, Bitcoin, finance, analytics]
layout_components: [next_prev_large]
content_group: Query the Bitcoin blockchain
---

# Query the Bitcoin blockchain

[Blockchains][blockchain-def] are, at their essence, a distributed database. The
[transactions][transactions-def] in a blockchain are an example of time-series data. You can use
Timescale to query transactions on a blockchain, in exactly the same way as you
might query time-series transactions in any other database.

In this tutorial, you use Timescale to ingest, store, and analyze transactions
on the Bitcoin blockchain. You can use these skills to query any data on a
blockchain, including other cryptocurrencies, smart contracts, or health data.

## Prerequisites

Before you begin, make sure you have:

*   Signed up for a [free Timescale account][cloud-install].

## Steps in this tutorial

This tutorial covers:

1.  [Setting up your dataset][blockchain-dataset]
1.  [Querying your dataset][blockchain-query]
1.  [Bonus: Store data efficiently][blockchain-compress]

## About querying the Bitcoin blockchain with Timescale

This tutorial uses a sample Bitcoin dataset to show you how to construct queries
for blockchain data. The queries you do in this tutorial is used to do things
like determine if a cryptocurrency is performing as expected, graph currency
values over time, and compare currencies.

It starts by teaching you how to set up and connect to a Timescale database,
create tables, and load data into the tables using `psql`.

You then learn how to conduct analysis on your dataset. It walks you through
using PostgreSQL queries to obtain information, including finding the most
recent transactions on the blockchain, and gathering information about the
transactions using aggregation functions.

When you've completed this tutorial, you can use the same dataset to complete
the [advanced blockchain tutorial][analyze-blockchain], which shows you how to
analyze the blockchain data using Timescale hyperfunctions.

[cloud-install]: /getting-started/:currentVersion:/#create-your-timescale-account
[blockchain-dataset]: /tutorials/:currentVersion:/blockchain-query/blockchain-dataset/
[blockchain-query]: /tutorials/:currentVersion:/blockchain-query/beginner-blockchain-query/
[blockchain-compress]: /tutorials/:currentVersion:/blockchain-query/blockchain-compress/
[blockchain-def]: https://www.pcmag.com/encyclopedia/term/blockchain
[transactions-def]: https://www.pcmag.com/encyclopedia/term/bitcoin-transaction
[analyze-blockchain]: /tutorials/:currentVersion:/blockchain-analyze/
