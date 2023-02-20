---
title: Install Promscale Connector as binary with Timescale cloud
excerpt: Install Promscale from source on bare metal
product: promscale
keywords: [analytics]
tags: [install]
related_pages:
  - /promscale/:currentVersion:/guides/resource-recomm/
  - /promscale/:currentVersion:/send-data/
---

import PromscaleSendData from "versionContent/_partials/_promscale-send-data.mdx";
import PromscaleDeprecation from "versionContent/_partials/_deprecated-promscale.mdx";

# Install Promscale from binary

<PromscaleDeprecation />

You can install Promscale from a pre-compiled binary on any operating system. The
Promscale binary file is available at [GitHub releases page][gh-promscale-download].

## Before you begin

1.  Ensure that you have a working Prometheus or OpenTelemetry collector environment.
1.  Create a [TimescaleDB service] [create-service] on Timescale Cloud.

## Install the Promscale pre-compiled binary

Download the Promscale binary file and run the file.

<procedure>

### Installing Promscale from binary

1.  At the command prompt, as a root user, download the appropriate file
    for your operating system. You can find the correct URL on the
    [GitHub repository releases page][releases]:

    ```bash
    curl -L -o promscale https://github.com/timescale/promscale/releases/download/<VERSION>/<PROMSCALE_DISTRIBUTION>
    ```

1.  Grant executable permissions to the `promscale` directory:

    ```bash
    chmod +x promscale
    ```

1.  Run Promscale with the connection details for your TimescaleDB service.
    Replace `TS_CLOUD_DB_URI` with the `Service URL` that you made note of when
    you created the TimescaleDB service:

    ```bash
    ./promscale --db-uri <TS_CLOUD_DB_URI>
    ```

</procedure>

<PromscaleSendData />

[gh-promscale-download]: https://github.com/timescale/promscale/releases
[releases]: https://github.com/timescale/promscale/releases/
[create-service]: /promscale/:currentVersion:/installation/promscale-with-timescale-cloud/
