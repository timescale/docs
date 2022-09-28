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

# Install Promscale from binary
You can install Promscale from a pre-complied binary on any operating systems. The
Promscale binary file is available at [GitHub releases page][gh-promscale-download].

Before you begin, you must have an already installed and working Prometheus or
OpenTelemetry collector environment.

## Install the Promscale pre-compiled binary
Download the Promscale binary file and run the file.

<procedure>

### Installing Promscale from binary
1.  At the command prompt, as a root user, download the appropriate file
    for your operating system (get the URL from the [GitHub repository releases page][releases]):
    ```bash
    curl -L -o promscale https://github.com/timescale/promscale/releases/download/<VERSION>/<PROMSCALE_DISTRIBUTION>
    ```
1.  Grant executable permissions to the `promscale` directory:
    ```bash
    chmod +x promscale
    ```
1.  Run Promscale by providing the connection details for your TimescaleDB
    service:
    ```bash
    ./promscale --db-uri <TS_CLOUD_DB_URI>
    ```

    <highlight type="note">
    Replace `&lt;TS_CLOUD_DB_URI&gt;` with the DB_URI you copied on service creation in Timescale cloud. [Here](/promscale/:currentVersion:/installation/promscale-with-timescale-cloud/#create-a-timescale-cloud-service) are the steps to create Timescale cloud service, 
    if you haven't created one already.
    </highlight>

</procedure>

[gh-promscale-download]: https://github.com/timescale/promscale/releases
[releases]: https://github.com/timescale/promscale/releases/