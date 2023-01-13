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

If background [telemetry][telemetry] is enabled, returns the string sent to our servers.
If telemetry is not enabled, outputs INFO message affirming telemetry is disabled
and returns a NULL report.

### Optional arguments

|Name|Type|Description|
|---|---|
| `always_display_report` | BOOLEAN | Set to true to always view the report, even if telemetry is disabled |

### Sample usage

If telemetry is enabled, view the telemetry report.

```sql
SELECT get_telemetry_report();
```

If telemetry is disabled, view the telemetry report locally.

```sql
SELECT get_telemetry_report(always_display_report := true);
```

[telemetry]: /timescaledb/:currentVersion:/how-to-guides/configuration/telemetry
