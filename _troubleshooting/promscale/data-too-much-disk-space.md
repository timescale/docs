---
title: Data takes up too much disk space
section: troubleshooting
products: [promscale]
topics: [compression]
keywords: [disk, storage]
tags: [promscale, resources, disk, storage, compression]
---

import PromscaleDeprecation from "versionContent/_partials/_deprecated-promscale.mdx";

<!---
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
-->

<PromscaleDeprecation />

Promscale keeps metric data in chunks. The most recent chunk is kept
uncompressed as a cache for faster querying, and chunks are compressed as they
age. If your data is taking up more disk space than expected, compression might
not be working correctly. If compression is not working correctly, older chunks
might not be getting compressed, and they might be taking up too much room on
disk. To check that compression is working correctly, query the
`prom_info.metric` view and make sure that
`total_chunks-number_compressed_chunks` is not larger than 2.

If compression is not working correctly, make sure that you have enough
background workers to do scheduled jobs like compression and retention. To
calculate the number of background workers you require, start with the number of
databases you have in your environment, plus 2. If you are using TimescaleDB
version 2.0.0 or earlier, make sure that you are running the maintenance `cron`
jobs, and that they are returning success. When compression is working
correctly, your data is being compressed as it ages.

If compression is working properly, then do the following:

*   Check you are using the most recent version of Promscale, to ensure you have
    the latest features.
*   Consider reducing the length of time that you retain data for.
*   Reduce the chunk interval to 4&nbsp;hours or 2&nbsp;hours. This could slow
    down query performance.
