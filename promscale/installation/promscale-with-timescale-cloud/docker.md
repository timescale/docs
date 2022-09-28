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

# Install Promscale Connector using a Docker image with Timescale cloud

<highlight type="important">
Running Promscale directly using `docker run` is not recommended for production
environments. This can be useful for testing purposes and is just provided as an
example.
</highlight>

## Install Promscale with Docker

Before you begin, you must have Docker installed on your local system. For
packages and instructions, see the [Docker installation documentation][docker-install].

<procedure>

### Installing Promscale using Docker

1.  Run the Promscale Connector Docker container on a network named `promscale`.
    It also port forwards to port `9201` on your local system:

    ```bash
    docker run --name promscale -d -p 9201:9201 \
    -db.uri=<TS_CLOUD_DB_URI>
    ```

    <highlight type="note">
    Replace `&lt;TS_CLOUD_DB_URI&gt;` with the `DB_URI` you copied on service creation in Timescale cloud. [Here](/promscale/:currentVersion:/installation/promscale-with-timescale-cloud/#create-a-timescale-cloud-service) are the steps to create Timescale cloud service, 
    if you haven't created one already.
    </highlight>

</procedure>

<PromscaleSendData />

For upgrading the Promscale, see the [upgrade] section.

[docker-install]: https://docs.docker.com/get-docker/
[promscale-docker-image]: https://hub.docker.com/r/timescale/promscale/tags
[promscale-install-kubernetes]: /promscale/:currentVersion:/installation/kubernetes/