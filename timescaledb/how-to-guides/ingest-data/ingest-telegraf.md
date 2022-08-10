---
title: Telegraf
excerpt: Ingest data into TimescaleDB using the Telegraf plugin (deprecated)
keywords: [ingest, Telegraf]
tags: [insert]
---

import Deprecated from 'versionContent/_partials/_deprecated.mdx';

# Telegraf
Telegraf collects, processes, aggregates, and writes metrics. Telegraf is highly
extensible, and has over 200 plugins for gathering and writing different types
of data.

<Deprecated />

For some suggestions of workarounds, see this
[Timescale Forum post](https://www.timescale.com/forum/t/telegraf-plugin/118).

Timescale have an unofficial build of Telegraf version 1.13.0 with the plugin
added. For more information about installing the Timescale Telegraf binaries
with the plugin, see the [telegraf-tutorial][telegraf-tutorial].

[telegraf-tutorial]: /timescaledb/:currentVersion:/tutorials/telegraf-output-plugin/
