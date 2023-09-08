---
title: Data tiering
excerpt: Learn about high availability
products: [self_hosted]
keywords: [high availability]
---

import ConsiderCloud from "versionContent/_partials/_consider-cloud.mdx";

# Data tiering

Save on storage costs by tiering data to a low-cost object-storage layer.

Timescale includes traditional disk storage, and a low-cost object-storage
layer built on Amazon S3. You can move your hypertable data across the different
storage tiers to get the best price performance. You can use primary storage for
data that requires quick access, and low-cost object storage for historical
data. Regardless of where your data is stored, you can query it with standard
SQL.

For more information about how data tiering works, see the
[about data tiering][about-data-tiering] section.

This section describes how to manually tier and untier data in a self-hosted
enviornment. If you are using Timescale, you can turn data tiering on and off
within the Timescale Console. For more information about data tiering in
Timescale, see the [Timescale data tiering][cloud-data-tiering] section

<ConsiderCloud />

[about-ha]: /self-hosted/:currentVersion:/replication-and-ha/about-ha/
[replication-enable]: /self-hosted/:currentVersion:/replication-and-ha/configure-replication/
[cloud-data-tiering]: /use-timescale/:currentVersion:/data-tiering/
[about-data-tiering]: /use-timescale/:currentVersion:/data-tiering/about-data-tiering/
