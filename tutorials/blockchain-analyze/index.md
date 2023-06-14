---
title: Analyze the Bitcoin blockchain
excerpt: Use Timescale hyperfunctions to analyze the Bitcoin blockchain
products: [cloud, self-hosted]
keywords: [advanced, crypto, blockchain, Bitcoin, finance, analytics]
layout_components: [next_prev_large]
content_group: Analyze the Bitcoin blockchain
---

# Analyze the Bitcoin blockchain

Blockchain data is time-series data. You can use TimescaleDB to ingest, store,
and analyze data on blockchain transactions. This tutorial focuses on Bitcoin
analysis, but you can apply the same principles and TimescaleDB features on any
blockchain data. This includes Etheruem, Solana, and others.

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

## Prerequisites

Before you begin, make sure you have:

*   A TimescaleDB instance running locally or on the cloud.
  For more information, see [installation options][install-docs].
*   [`psql`][psql], or any other PostgreSQL client.

## Steps in this tutorial

A numbered list of the sub-pages in the tutorial. Remember that this is
curricula content, so these steps must be in order:

1.  [Set up up your dataset][tutorial-dataset]
1.  [Query your dataset][tutorial-query]
1.  [More things to try][tutorial-advanced]

## About the widget and the tool

This section collects all the concept information related to the tutorial, and
the tools that are being used throughout. It answers the question "What is it?"
This section should not include any procedures, but it can contain code samples
if they are being used to explain the feature. Break this page up in a way that
is logical, starting from simpler concepts and moving to more complicated ones.
Use diagrams and screenshots sparingly, and ensure they add value. Try to keep
this section succinct, by linking to lengthier material that exists elsewhere.

For example:

```txt
Candlestick charts are used in the financial sector to visualize the price
change of an asset. Each candlestick represents a time frame, such as 1
minute, 1 hour, or similar, and shows how the asset's price changed
during that time.
```

Include reference-style links at the bottom of the page.

[install-docs]: install/:currentVersion:/
[psql]: timescaledb/:currentVersion:/how-to-guides/connecting/
[tutorial-dataset]: timescaledb/tutorials/_template/_dataset-tutorial
[tutorial-query]: timescaledb/tutorials/_template/_query-template
[tutorial-advanced]: timescaledb/tutorials/_template/_advanced-tutorial
