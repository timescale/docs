## get_telemetry_report() 

If background [telemetry][] is enabled, returns the string sent to our servers.
If telemetry is not enabled, outputs INFO message affirming telemetry is disabled
and returns a NULL report.

### Optional Arguments

|Name|Type|Description|
|---|---|
| `always_display_report` | Set to true to always view the report, even if telemetry is disabled |

### Sample Usage 
If telemetry is enabled, view the telemetry report.
```sql
SELECT get_telemetry_report();
```
If telemetry is disabled, view the telemetry report locally.
```sql
SELECT get_telemetry_report(always_display_report := true);
```