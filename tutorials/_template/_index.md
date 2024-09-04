---
title: Verb the widget in the tool
excerpt: Verb your widgets to achieve an outcome using the tool
keywords: [noun, verb, tutorial]
tags: [noun, noun]
---

{/* markdown-link-check-disable */}

# Verb the widget in the tool

A single paragraph description of the tutorial. Make sure to cover what the
tutorial does in one or two sentences, including the desired learning outcome.
For example:

```txt
This tutorial shows you how to efficiently store raw financial tick
data, create different candlestick views, and query aggregated data in
TimescaleDB using the OHLCV format.
```

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
