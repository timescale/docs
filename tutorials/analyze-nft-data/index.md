---
title: Analyze non-fungible token (NFT) sales data
excerpt: Learn how to collect, store, and analyze NFT sales data from the largest NFT marketplace
products: [cloud, mst, self_hosted]
keywords: [crypto, blockchain, finance, analytics]
tags: [nft]
---

# Analyze non-fungible token (NFT) sales data

This tutorial is a step-by-step guide to collecting, storing, and analyzing NFT
([non-fungible tokens][nft-wiki]) sales data from the largest NFT marketplace,
[OpenSea][opensea].

NFTs, like much of the data related to blockchains and cryptocurrencies, can
seem complicated at first, but in this tutorial we take you from zero to NFT hero
and give you a foundation for analyzing NFT trends.

This tutorial shows you how to:

*   Design a schema for NFT transactions
*   Ingest time-series NFT data and additional relevant relational data
*   Query the dataset using PostgreSQL and TimescaleDB to unlock insights from the data

## NFT Starter Kit

This tutorial is part of the [Timescale NFT Starter Kit][starter-kit], designed
to get you up and running with analyzing NFT data, and give you the inspiration
to build your own, more complex projects.
The NFT Starter Kit contains:

*   Data ingestion script, which collects historical data from OpenSea and ingests
it into TimescaleDB
*   Sample dataset, to get started quickly, if you don't want to wait too much time ingesting data
*   Schema for storing NFT sales, assets, collections, and accounts
*   Local TimescaleDB database, pre-loaded with sample NFT data
*   Pre-built dashboards and charts in [Apache Superset][superset] and [Grafana][grafana]
for visualizing your data analysis
*   Queries to use as a starting point for your own analysis

To get started, clone the NFT Starter Kit [Github repo][starter-kit] and follow
along with this tutorial.

## Complete this tutorial. Earn an NFT!

Because we love NFTs as much as you do, we created [Time Travel Tigers][eon-collection],
a limited edition set of 20
NFT about our Timescale mascot, Eon! The first 20 people to complete this tutorial
can earn a limited edition NFT from
the collection, for free!

Claiming your NFT is simple. All you need to do is complete the tutorial below,
answer the questions in [this form][nft-form], and we'll send one of the
limited-edition Eon NFTs to your ETH address (at no cost to you!).

You can see all NFTs in the Time Travel Tigers collection live on [OpenSea][eon-collection].

1.  [NFT schema design and ingestion][nft-schema]
1.  [Analyzing NFT transactions][nft-analyze]

## Prerequisites

*   OpenSea API key ([request one from here][opensea-key])
*   TimescaleDB ([installation options][install-ts])
*   Psql or any other PostgreSQL client (for example DBeaver, or PgAdmin)

[eon-collection]: https://opensea.io/collection/time-travel-tigers-by-timescale
[grafana]: https://grafana.com
[install-ts]: /getting-started/latest/
[nft-analyze]: /tutorials/:currentVersion:/analyze-nft-data/analyzing-nft-transactions
[nft-form]: https://docs.google.com/forms/d/e/1FAIpQLSdZMzES-vK8K_pJl1n7HWWe5-v6D9A03QV6rys18woGTZr0Yw/viewform?usp=sf_link
[nft-schema]: /tutorials/:currentVersion:/analyze-nft-data/nft-schema-ingestion
[nft-wiki]: https://en.wikipedia.org/wiki/Non-fungible_token
[opensea-key]: https://docs.opensea.io/reference/api-keys
[opensea]: https://opensea.io/
[starter-kit]: https://github.com/timescale/nft-starter-kit
[superset]: https://superset.apache.org
