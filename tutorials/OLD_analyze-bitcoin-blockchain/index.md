---
title: Analyze the Bitcoin blockchain
excerpt: Learn how to store and analyze your Bitcoin blockchain data to uncover trends
products: [cloud, mst, self_hosted]
keywords: [crypto, blockchain, Bitcoin, finance, analytics]
layout_components: [next_prev_large]
content_group: Analyze the Bitcoin blockchain
---

# Analyze the Bitcoin blockchain

Blockchain data is time-series data. You can use
TimescaleDB to ingest, store, and
analyze data on blockchain transactions. This tutorial focuses
on Bitcoin analysis, but you can
apply the same principles and TimescaleDB features on
any blockchain data. This includes Etheruem, Solana, and others.

<Highlight type="note">
This tutorial shows you one approach to Doing Your Own Research in
the blockchain space. Any
conclusions made from the data are illustrative examples only. They're meant to help
you learn about TimescaleDB features, and to inspire your own
data analysis and conclusions. To read about the
conclusions we made from
analyzing 5 years' worth of Bitcoin transactions,
[see our blog post](https://www.timescale.com/blog/analyzing-the-bitcoin-blockchain-looking-behind-the-hype-with-postgresql/).
</Highlight>

## What you'll learn

This tutorial teaches you to ingest and analyze blockchain data
in TimescaleDB.

## Prerequisites

Before you begin, make sure you have:

*   A TimescaleDB instance running locally or on the cloud. For more information, see [installation options][install-timescale]
*   [`psql`][psql-install], DBeaver, or any other PostgreSQL client

<Highlight type="note">
The easiest way to get a new TimescaleDB instance up and running and complete
this tutorial is to
[sign up for a free Timescale account](https://www.timescale.com/timescale-signup/)
(no credit card required).
</Highlight>

[install-timescale]: /getting-started/latest/
[psql-install]: /use-timescale/:currentVersion:/connecting/psql
