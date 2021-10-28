# Analyze Non-fungible token (NFT) sales data

This tutorial is a step-by-step guide to collecting, storing, and analyzing NFT 
([non-fungible tokens][nft-wiki]) sales data from the largest NFT marketplace, 
[OpenSea][opensea]. 

NFTs, like much of the data related to blockchains and cryptocurrencies, can 
seem complicated at first, but in this tutorial we take you from zero to NFT hero 
and give you a foundation for analyzing NFT trends.

This tutorial shows you how to:
* Design a schema for NFT transactions
* Ingest time-series NFT data and additional relevant relational data
* Query the dataset using PostgreSQL and TimescaleDB to unlock insights from the data

## NFT Starter Kit

This tutorial is part of the [Timescale NFT Starter Kit][starter-kit], designed 
to get you up and running with analyzing NFT data, and give you the inspiration 
to build your own, more complex projects. 
The NFT Starter Kit contains: 
* A data ingestion script, which collects real-time data from OpenSea and ingests 
it into TimescaleDB
* A sample dataset, to get started quickly, if you don't want to ingest real-time data
* A schema for storing NFT sales, assets, collections, and owners
* A local TimescaleDB database, pre-loaded with sample NFT data
* Pre-built dashboards and charts in [Apache Superset][superset] and [Grafana][grafana] 
for visualizing your data analysis
* Queries to use as a starting point for your own analysis

To get started, clone the NFT Starter Kit [Github repo][starter-kit] and follow 
along with this tutorial.
 
## Complete this tutorial. Earn an NFT!
Because we love NFTs as much as you do, we created [Time Travel Tigers][eon-collection], 
a limited edition set of 20 
NFT about our Timescale mascot, Eon! The first 20 people to complete this tutorial 
can earn a limited edition NFT from 
the collection, for free! 

Claiming your NFT is simple. All you need to do is complete the tutorial below, 
answer the questions in [this form][nft-form], and we’ll send one of the 
limited-edition Eon NFTs to your ETH address (at no cost to you!).

You can see all NFTs in the Time Travel Tigers collection live on [OpenSea][eon-collection].

1. [NFT schema design and ingestion][nft-schema]
1. [Analyzing NFT transactions][nft-analyze]

## Prerequisites
* TimescaleDB ([installation options][install-ts])
* Psql or any other PostgreSQL client (for example DBeaver, or PgAdmin)


[nft-wiki]: https://en.wikipedia.org/wiki/Non-fungible_token
[opensea]: https://opensea.io
[starter-kit]: https://github.com/timescale/nft-starter-kit
[install-ts]: /how-to-guides/install-timescaledb/
[nft-schema]: /tutorials/analyze-nft-data/nft-schema-ingestion
[nft-analyze]: /tutorials/analyze-nft-data/analyzing-nft-transactions
[superset]: https://superset.apache.org
[grafana]: https://grafana.com
[eon-collection]: https://opensea.io/collection/time-travel-tigers-by-timescale
[nft-form]: https://docs.google.com/forms/d/e/1FAIpQLSdZMzES-vK8K_pJl1n7HWWe5-v6D9A03QV6rys18woGTZr0Yw/viewform?usp=sf_link