---
title: API reference tag overview
excerpt: Understand the tags used in the Timescale documentation API references
tags: [licenses, toolkit, experimental]
---

import ExperimentalUpgrade from "versionContent/_partials/_experimental-schema-upgrade.mdx";

# API Reference tag overview

The Timescale API Reference uses tags to categorize functions. The tags are
`Community`, `Experimental`, `Toolkit`, and `Experimental (Toolkit)`. This
section explains each tag.

## Community <Tag type="community">Community</Tag>

This tag indicates that the function is available under TimescaleDB Community
Edition, and are not available under the Apache 2 Edition. For more information,
visit our [TimescaleDB License comparison sheet][tsl-comparison].

## Experimental (TimescaleDB Experimental Schema) <Tag type="experimental">Experimental</Tag>

This tag indicates that the function is included in the TimescaleDB experimental
schema. Do not use experimental functions in production. Experimental features
could include bugs, and are likely to change in future versions. The
experimental schema is used by Timescale to develop new features more quickly.
If experimental functions are successful, they can move out of the experimental
schema and go into production use.

<ExperimentalUpgrade />

For more information about the experimental
schema, [read the Timescale blog post][experimental-blog].

## Toolkit <Tag type="toolkit">Toolkit</Tag>

This tag indicates that the function is included in the TimescaleDB Toolkit extension.
Toolkit functions are available under Timescale Community Edition.
For installation instructions, [see the installation guide][toolkit-install].

## Experimental (TimescaleDB Toolkit) <Tag type="experimental-toolkit">Experimental</Tag>

This tag is used with the Toolkit tag. It indicates a Toolkit function that is
under active development. Do not use experimental toolkit functions in
production. Experimental toolkit functions could include bugs, and are likely to
change in future versions.

These functions might not correctly handle unusual use cases or errors, and they
could have poor performance. Updates to the TimescaleDB extension drop database
objects that depend on experimental features like this function. If you use
experimental toolkit functions on Timescale Cloud, this function is
automatically dropped when the Toolkit extension is updated. For more
information, [see the TimescaleDB Toolkit docs][toolkit-docs].

[tsl-comparison]: /about/:currentVersion:/timescaledb-editions/
[toolkit-install]: /self-hosted/:currentVersion:/tooling/install-toolkit/
[toolkit-docs]: https://github.com/timescale/timescaledb-toolkit/tree/main/docs#a-note-on-tags-
[experimental-blog]: https://blog.timescale.com/blog/move-fast-but-dont-break-things-introducing-the-experimental-schema-with-new-experimental-features-in-timescaledb-2-4/
