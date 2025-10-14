---
title: Query the Bitcoin blockchain
excerpt: Learn to use Tiger to query and analyze transactions on a blockchain as you would any other time-series data. In this tutorial, you use Tiger to ingest, store, and analyze transactions
products: [cloud, self_hosted, mst]
keywords: [beginner, crypto, blockchain, Bitcoin, finance, analytics]
layout_components: [next_prev_large]
content_group: Query the Bitcoin blockchain
---

import FinancialIndustry from "versionContent/_partials/_financial-industry-data-analysis.mdx";

# Query the Bitcoin blockchain

<FinancialIndustry />

In this tutorial, you use $CLOUD_LONG to ingest, store, and analyze transactions
on the Bitcoin blockchain. 

[Blockchains][blockchain-def] are, at their essence, a distributed database. The
[transactions][transactions-def] in a blockchain are an example of time-series data. You can use
$TIMESCALE_DB to query transactions on a blockchain, in exactly the same way as you
might query time-series transactions in any other database.

## Steps in this tutorial

This tutorial covers:

1.  [Ingest data into a $SERVICE_SHORT][blockchain-dataset]: set up and connect to a $SERVICE_LONG, create tables and $HYPERTABLEs, and ingest data.  
1.  [Query your data][blockchain-query]: obtain information, including finding the most recent transactions on the blockchain, and 
   gathering information about the transactions using aggregation functions.
1.  [Compress your data using $HYPERCORE][blockchain-compress]: compress data that is no longer needed for highest performance queries, but is still accessed regularly
    for real-time analytics.

When you've completed this tutorial, you can use the same dataset to  [Analyze the Bitcoin data][analyze-blockchain], 
using $TIMESCALE_DB hyperfunctions.

[cloud-install]: /getting-started/:currentVersion:/#create-your-timescale-account
[blockchain-dataset]: /tutorials/:currentVersion:/blockchain-query/blockchain-dataset/
[blockchain-query]: /tutorials/:currentVersion:/blockchain-query/beginner-blockchain-query/
[blockchain-compress]: /tutorials/:currentVersion:/blockchain-query/blockchain-compress/
[blockchain-def]: https://www.pcmag.com/encyclopedia/term/blockchain
[transactions-def]: https://www.pcmag.com/encyclopedia/term/bitcoin-transaction
[analyze-blockchain]: /tutorials/:currentVersion:/blockchain-analyze/analyze-blockchain-query/
