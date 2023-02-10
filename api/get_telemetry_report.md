---
api_name: get_telemetry_report()
excerpt: Get the telemetry string that is sent to Timescale servers
topics: [administration]
keywords: [admin]
tags: [telemetry, report]
api:
  license: apache
  type: function
---

# get_telemetry_report()

Returns the background [telemetry][telemetry] string sent to Timescale 
servers. If telemetry is disabled, it sends the string that would be sent 
if telemetry was enabled.

### Sample usage

View the telemetry report:

```sql
SELECT get_telemetry_report();
```

[telemetry]: /timescaledb/:currentVersion:/how-to-guides/configuration/telemetry
