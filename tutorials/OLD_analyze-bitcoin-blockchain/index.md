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
$TIMESCALE_DB to ingest, store, and
analyze data on blockchain transactions. This tutorial focuses
on Bitcoin analysis, but you can
apply the same principles and $TIMESCALE_DB features on
any blockchain data. This includes Etheruem, Solana, and others.

<Highlight type="note">
This tutorial shows you one approach to Doing Your Own Research in
the blockchain space. Any
conclusions made from the data are illustrative examples only. They're meant to help
you learn about $TIMESCALE_DB features, and to inspire your own
data analysis and conclusions. To read about the
conclusions we made from
analyzing 5 years' worth of Bitcoin transactions,
[see our blog post][see-our-blog-post].
</Highlight>

## What you'll learn

This tutorial teaches you to ingest and analyze blockchain data
in $TIMESCALE_DB.

## Prerequisites

Before you begin, make sure you have:

*   A $TIMESCALE_DB instance running locally or on the cloud. For more information, see [installation options][install-timescale]
*   [`psql`][psql], DBeaver, or any other $PG client

<Highlight type="note">
The easiest way to get a new $TIMESCALE_DB instance up and running and complete
this tutorial is to
[sign up for a free $ACCOUNT_LONG][sign-up-for-a-free-account_long]
(no credit card required).
</Highlight>

[install-timescale]: /getting-started/:currentVersion:/
[psql]: /integrations/:currentVersion:/psql/
[see-our-blog-post]: https://www.tigerdata.com/blog/building-blockchain-apps-on-postgres
[sign-up-for-a-free-account_long]: http://console.cloud.timescale.com/signup
