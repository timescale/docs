---
title: Viewing service logs
excerpt: View logs for your Managed Service for TimescaleDB service
products: [mst]
keywords: [logging, services]
---

# Viewing service logs

Occasionally there is a need to inspect logs from Managed Service for
TimescaleDB. For example, to debug query performance or inspecting errors caused
by a specific workload.

There are different built-in ways to inspect service logs at Managed Service for
TimescaleDB:

*   When you select a specific service, navigate to the `Logs` tab to see recent
    events. Logs can be browsed back in time.
*   Download logs using the [command-line client][command-line-client] by
    running:

    ```bash
    avn service logs -S desc -f --project <PROJECT_NAME> <SERVICE_NAME>
    ```

*   [REST API][] endpoint is available for fetching the same information two
    above methods output, in case programmatic access is needed.

Service logs included on the normal service price are stored only for a few
days. Unless you are using logs integration to another service, older logs are
not accessible.

[REST API]: https://kb.timescale.cloud/en/articles/2949775-rest-api
[command-line-client]: https://github.com/aiven/aiven-client
