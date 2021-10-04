# API Reference Tag Overview

Timescale Documentation utilizes a tagging system to describe functions in the API Reference section. These tags include "Community", "Experimental", "Toolkit", and "Experimental" (for TimescaleDB Toolkit functions). Below is more information on what each tag represents.

## Community <tag type="community">Community</tag>

The community tag signifies that a TimescaleDB function is available under the Timescale Community Edition license, and not available under the Apache 2 Edition license. For more information, visit our [Timescale License comparison sheet][tsl-comparison].

## Experimental (TimescaleDB Experimental Schema) <tag type="experimental">Experimental</tag>

The experimental tag denotes that a function is a part of the TimescaleDB experimental schema. This schema is not to be used in production, may include bugs and is subject to change in future versions. The objective of the schema is to allow for faster development of new features. The ultimate goal is to move experimental features and functions out of the experimental schema when they reach full maturity for normal production usage. [More information can be found on the Timescale blog][experimental-blog].

## Tookit <tag type="toolkit">Toolkit</tag>

The toolkit tag marks functions that belong to the TimescaleDB Toolkit extension. The functionality provided by the Toolkit is availble under the Timescale Community Edition license. For installation instructions, [visit our install guide][toolkit-install].

## Experimental (TimescaleDB Toolkit) <tag type="experimental-toolkit">Experimental</tag>

The experimental tag, when used with the Toolkit tag, signfies that a function is still under active development. It may not handle corner cases or errors, and may have poor performance. Extion updates will drop database objects that depend on experimental features. This is particularly important for Timescale Cloud users, as the Toolkit extension is updated automatically. For more information, [read the TimescaleDB Toolkit docs][toolkit-docs].

[tsl-comparison]: /timescaledb/:currentVersion/timescaledb-license-comparison/
[toolkit-install]: /timescaledb/:currentVersion/how-to-guides/install-timescaledb-toolkit/
[toolkit-docs]: https://github.com/timescale/timescaledb-toolkit/tree/main/docs#a-note-on-tags-
[experimental-blog]: https://blog.timescale.com/blog/move-fast-but-dont-break-things-introducing-the-experimental-schema-with-new-experimental-features-in-timescaledb-2-4/
