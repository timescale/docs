---
title: Viewing service logs
excerpt: View logs for your services in Managed Service for TimescaleDB by using MST Console or the command-line tool
products: [mst]
keywords: [logging, services]
---

# Viewing service logs

Occasionally there is a need to inspect logs from $MST_LONG. For example, to debug query performance or inspecting errors caused
by a specific workload.

There are different built-in ways to inspect service logs at $MST_LONG:

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

[REST API]: https://docs.timescale.com/mst/latest/
[command-line-client]: https://github.com/aiven/aiven-client
