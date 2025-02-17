---
title: Timescale architecture for real-time analytics
excerpt: The architecture of Timescale, and the design choices that optimize PostgreSQL for real-time analytics. 
products: [cloud, mst, self_hosted]
keywords: [Apache, community, license]
tags: [learn, contribute]
---



# Timescale architecture for real-time analytics

Today's applications require real-time analytics to process high-ingestion workloads while ensuring low-latency query performance. Built on PostgreSQL, Timescale is an application database that extends Postgres with real-time analytics capabilities on time series and event data while preserving its full transactional capabilities and SQL compatibility.

This document describes the architecture of Timescale and the design choices that optimize PostgreSQL for real-time analytics. It explores the implementation of TimescaleDB, an open-source time series query engine for Postgres, and Timescale Cloud, a cloud-native database as a service product, detailing innovations that enhance scalability, query execution, operational experience, and data lifecycle management for mission-critical real-time analytics.


## What is a Real-Time Analytics Database?

A real-time analytics database processes incoming data as soon as it arrives, enabling immediate queries and insights with minimal latency. This approach contrasts with batch-based analytical systems, which rely on scheduled ETL processes and can delay analytics by hours or days. By prioritizing low-latency reads and writes, real-time databases ensure that applications can respond quickly to fast-changing conditions.

However, real-time analytics does not focus solely on an append only workload for newly arrived events. Many operational scenarios require mutable data, such as backfilling late-arriving records, correcting previously ingested measurements, or revising event logs to fix inaccuracies. This means the underlying storage engine must efficiently handle both high-throughput inserts and point updates, all while still supporting queries that blend fresh data with historical context. Achieving this balance ensures that real-time workloads can adapt to ongoing data revisions without compromising overall performance.


## The Limitations of Traditional Real-Time OLAP Databases

Efforts to deliver real-time queries on fresh data often rely on “real-time OLAP” databases, which combine analytical processing with near-current information. While they can reduce query latency compared to batch-based or data warehouse solutions, these databases generally remain separate from transactional systems, creating several challenges:



1. **Complex Architecture and Operational Overhead \
   **Most real-time OLAP setups require two separate systems (OLTP and OLAP), plus ETL pipelines to synchronize data. This increases complexity, inflates costs, and slows development as teams juggle multiple environments and tooling.
2. **Delayed Data Availability \
   **Data typically arrives in a stream from the transactional system to the OLAP store for loading. This introduces a lag between when data is written and when it becomes queryable, undermining truly immediate insights in time-critical scenarios. Because ingestion is often asynchronous, recent writes may also be lost on crash causing silent data drift from the souce database.


Etc
