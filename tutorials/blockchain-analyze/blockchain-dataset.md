---
title: Analyze the Bitcoin blockchain - set up dataset
excerpt: Set up a dataset so you can analyze the Bitcoin blockchain
products: [cloud]
keywords: [intermediate, crypto, blockchain, Bitcoin, finance, analytics]
layout_components: [next_prev_large]
content_group: Analyze the Bitcoin blockchain
---

import Install from "versionContent/_partials/_cloud-installation.mdx";
import CreateService from "versionContent/_partials/_cloud-create-service.mdx";
import Connect from "versionContent/_partials/_cloud-connect.mdx";
import CreateHypertableBlockchain from "versionContent/_partials/_create-hypertable-blockchain.mdx";
import AddDataBlockchain from "versionContent/_partials/_add-data-blockchain.mdx";
import GrafanaConnect from "versionContent/_partials/_grafana-connect.mdx";

# Create the dataset

This tutorial uses a dataset that contains Bitcoin blockchain data for
the past five days, in a hypertable named `transactions`.

<Collapsible heading="Sign up for Timescale">

<Install />

</Collapsible>

<Collapsible heading="Create a service">

<CreateService demoData={false} />

</Collapsible>

<Collapsible heading="Connect to your service">

<Connect />

</Collapsible>

<Collapsible heading="The dataset">

The dataset is updated daily and contains data from the last five days,
typically around 1.5 million Bitcoin transactions. The data includes information
about each transaction, including the value of the transaction in
[satoshi][satoshi-def], the smallest denomination of Bitcoin. It also states if
a transaction is the first transaction in a block, known as a
[coinbase][coinbase-def] transaction, which includes the reward a coin miner
receives for mining the coin.

<CreateHypertableBlockchain />

<AddDataBlockchain />

</Collapsible>

<Collapsible heading="Connect to Grafana">

The queries in this tutorial are suitable for graphing in Grafana. If you want
to visualize the results of your queries, connect your Grafana account to the
Bitcoin blockchain dataset.

<GrafanaConnect />

</Collapsible>

[satoshi-def]: https://www.pcmag.com/encyclopedia/term/satoshi
[coinbase-def]: https://www.pcmag.com/encyclopedia/term/coinbase-transaction
