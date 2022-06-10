# Analyze the Bitcoin blockchain
Blockchain data is fundamentally time-series data. In this tutorial we provide
a step-by-step guide on how to use TimescaleDB for ingesting, storing, and
analyzing Bitcoin blockchain transactions. Even though this tutorial focuses
on the Bitcoin network, after completing the steps you will be able to
apply the same principles and TimescaleDB features to efficiently work with
any kind of blockchain data, including Etheruem, Solana, and others.

This tutorial intends to show you one approach how to Do Your Own Research in
the blockchain space. This tutorial
might provide conclusions based on the data but they are only meant to educate
you about TimescaleDB capabilities and inspire you so you can get a head start
in your blockchain data journey. If you want to read about the
conclusions that we made based on
analyzing 5 years' worth of Bitcoin transactions, we suggest that you should
read our blog post about that. (LINK WHEN BLOG PUBLISHED)

This tutorial has two sections to get you started with blockchain data
ingestion and analyics in TimescaleDB:

* Ingest and query Bitcoin transactions
* Analyze the blockchain with hyperfunctions

Sourcing blockchain data can be difficult but don't worry in the next section
we provide a sample
file for you to download and ingest into your database so you can complete the
tutorial.

## Prerequisites
Before you begin, make sure you have:
* A TimescaleDB instance running locally or on the cloud. For more information, see [installation options](/install/latest/)
* [`psql`][psql-install], DBeaver, or any other PostgreSQL client





[install-timescale]: /install/latest/
[psql-install]: /how-to-guides/connecting/psql