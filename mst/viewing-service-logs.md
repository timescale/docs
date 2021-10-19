# Viewing service logs

Occasionally there is a need to inspect logs from Managed Service for
TimescaleDB. For example, to debug query performance or inspecting errors caused
by a specific workload.

There are different built-in ways to inspect service logs at Managed Service for
TimescaleDB:

 * In the [portal][mst-portal], when selecting a specific service, under "Logs" tab
recent events are available. Logs can be browsed back in time, but scrolling up
several thousand lines is not very convenient.
 * [Command-line client][] supports programmatically downloading logs. avn service l
ogs -S desc -f --project your-project-name your-service-name will show all stored logs.
 * [REST API][] endpoint is available for fetching the same information two above methods
output, in case programmatic access is needed.

Service logs included on the normal service price are stored only for a few days. Unless you are using logs integration to another service, older logs are not accessible.

[mst-portal]: https://portal.managed.timescale.com
[Command-line client]: https://github.com/aiven/aiven-client
[REST API]: https://kb.timescale.cloud/en/articles/2949775-rest-api
