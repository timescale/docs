---
title: Manual compression
excerpt: Manually compress a hypertable
products: [cloud, mst, self_hosted]
keywords: [compression, hypertables]
---

# Manual compression

In most cases, an automated compression policy is sufficient. However, if you
want more control over compression, you can also manually compress specific
chunks.

<Highlight type="warning">
Compression alters data on your disk, so always back up before you start.
</Highlight>

## Setting a compression policy from Timescale Cloud console

You can set a compression policy on a hypertable directly from the Timescale
Cloud console.

<Procedure>

### Set a compression policy from Timescale Cloud console

1.  Inside the Timescale Cloud Service Explorer, select a hypertable.
1.  Select the `Policies` tab.
1.  In the `Compression policy` section, click `Create compression policy`. A
    suggested policy interval is pre-selected for you, but you can change this
    in the next step.

    <img
    class="main-content__illustration"
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-explorer-compression-policy.png"
    alt="A screenshot of the compression policy section, showing the Create compression policy button and a default policy interval of 14 days."
    />

1.  A modal is shown with options for different compression policy intervals.
    Select your desired interval, and click `Save changes`.
1.  Your new compression policy appears in the list of policies. You can expand
    each row to see the policy details and change your configuration.

    <Highlight type="note">
    Compression begins immediately if you already have data older than the
    selected interval. The order of compression is from oldest to newest chunks.
    </Highlight>

</Procedure>
