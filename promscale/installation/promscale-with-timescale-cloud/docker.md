---
title: Install Promscale using a Docker image
excerpt: Install Promscale using Docker
product: promscale
keywords: [analytics, Docker]
tags: [install]
related_pages:
  - /promscale/:currentVersion:/guides/resource-recomm/
  - /promscale/:currentVersion:/send-data/
---

import PromscaleSendData from "versionContent/_partials/_promscale-send-data.mdx";

# Install Promscale Connector using a Docker image with Timescale Cloud

<highlight type="important">
Running Promscale directly using `docker run` is not recommended for production
environments. This can be useful for testing purposes and is just provided as an
example.
</highlight>

## Before you begin

*   Install Docker on your local system. For packages and instructions, see 
    the [Docker installation documentation][docker-install].
*   Create a [TimescaleDB service] [create-service] on Timescale Cloud.

<procedure>

### Installing Promscale using Docker

1.  Run the [Promscale Connector][promscale-docker-image] container on a network
    named `promscale`. It also port forwards to port `9201` on your local system:

    ```bash
    docker run --name promscale -d -p 9201:9201 \
    -db.uri=<TS_CLOUD_DB_URI>
    ```

    <highlight type="note">
    Replace `&lt;TS_CLOUD_DB_URI&gt;` with the `Service URL` that you made note of
    when you created the TimescaleDB service.

</highlight>

</procedure>

<PromscaleSendData />

For upgrading the Promscale, see the [upgrade][upgrade-promscale] section.

[docker-install]: https://docs.docker.com/get-docker/
[promscale-docker-image]: https://hub.docker.com/r/timescale/promscale/tags
[create-service]: /promscale/:currentVersion:/installation/promscale-with-timescale-cloud/
[upgrade-promscale]: /promscale/:currentVersion:/guides/upgrade/