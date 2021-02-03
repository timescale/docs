# What Is Time-series Data?

What is this "time-series data" that we keep talking about, and how and why is
it different from other data?

Many applications or databases actually take an overly narrow view, and equate
time-series data with something like server metrics of a specific form:

```bash
Name:    CPU

Tags:    Host=MyServer, Region=West

Data:
2017-01-01 01:02:00    70
2017-01-01 01:03:00    71
2017-01-01 01:04:00    72
2017-01-01 01:05:01    68
```

But in fact, in many monitoring applications, different metrics are often
collected together (e.g., CPU, memory, network statistics, battery life). So, it
does not always make sense to think of each metric separately.  Consider this
alternative "wider" data model that maintains the correlation between metrics
collected at the same time.

```bash
Metrics: CPU, free_mem, net_rssi, battery

Tags:    Host=MyServer, Region=West

Data:
2017-01-01 01:02:00    70    500    -40    80
2017-01-01 01:03:00    71    400    -42    80
2017-01-01 01:04:00    72    367    -41    80
2017-01-01 01:05:01    68    750    -54    79
```


This type of data belongs in a much **broader** category,
whether temperature
readings from a sensor, the price of a stock, the status of a machine,
or even the number of logins to an app.

**Time-series data is data that
collectively represents how a system, process, or behavior changes
over time.**


## Characteristics of Time-series Data [](characteristics)

If you look closely at how it’s produced and ingested, there are important
characteristics that time-series databases like TimescaleDB typically leverage:

- **Time-centric**: Data records always have a timestamp.
- **Append-only**: Data is almost solely append-only (INSERTs).
- **Recent**: New data is typically about recent time intervals, and we
more rarely make updates or backfill missing data about old intervals.

The frequency or regularity of data is less important though; it can be
collected every millisecond or hour.  It can also be collected at regular or
irregular intervals (e.g., when some *event* happens, as opposed to at
pre-defined times).

But haven't databases long had time fields?  A key difference between
time-series data (and the databases that support them), compared to other
data like standard relational "business" data, is that **changes to the
data are inserts, not overwrites**.

## Time-series Data Is Everywhere [](is-everywhere)

Time-series data is everywhere, but there are environments where it is especially
being created in torrents.

- **Monitoring computer systems**: VM, server, container metrics (CPU, free memory, net/disk IOPs),
service and application metrics (request rates, request latency).

- **Financial trading systems**: Classic securities, newer cryptocurrencies,
payments, transaction events.

- **Internet of Things**: Data from sensors on industrial machines and equipment,
wearable devices, vehicles, physical containers, pallets,
consumer devices for smart homes, etc.

- **Eventing applications**: User/customer interaction data like clickstreams,
pageviews, logins, signups, etc.

- **Business intelligence**: Tracking key metrics and the overall health of the business.

- **Environmental monitoring**: Temperature, humidity, pressure, pH, pollen count,
air flow, carbon monoxide (CO), nitrogen dioxide (NO2), particulate matter (PM10).

- (and more)

**Next:** [TimescaleDB's data model][data-model]

[data-model]: /introduction/data-model
