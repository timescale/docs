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

Returns the background [telemetry][telemetry] string sent to our servers
(or that would be, if telemetry is disabled).

### Sample usage

View the telemetry report.

```sql
SELECT get_telemetry_report();
```

[telemetry]: /timescaledb/:currentVersion:/how-to-guides/configuration/telemetry
