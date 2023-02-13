---
title: PromQL dashboard doesn't show Promscale data
section: troubleshooting
products: [promscale]
topics: [visualization]
keywords: [PromQL, disk, memory, CPU, backfilling]
---

<!---
* Keep this section in alphabetical order
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
-->

import PromscaleDeprecation from "versionContent/_partials/_deprecated-promscale.mdx";

<PromscaleDeprecation />

Backfilling data which has not been ingested into Prometheus can cause the
PromQL dashboard to not show Promscale data.

To fix this error, enable the `read_recent` option for Promscale in the
Prometheus configuration's `remote_read` section. This ensures that backfilled
data is shown in the PromQL dashboard:

```yml
remote_read:
  - url: "http://<CONNECTOR-ADDRESS>:9201/read"
    read_recent: true
```

For more information, see the
[Prometheus remote read documentation][prometheus-remote-read].

[prometheus-remote-read]: https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_read
