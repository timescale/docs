---
title: About configuration in Timescale
excerpt: About Timescale configuration
products: [cloud]
keywords: [configuration, memory, workers, settings]
---

# About configuration in Timescale

By default, Timescale uses the default PostgreSQL server configuration settings.
Most configuration values for a service are initially set in accordance with
best practices given the compute and storage settings of the service. Any time
you increase or decrease the compute for a Service, the most essential values
are set to reflect the size of the new service.

There are times, however, when your specific workload could require tuning some
of the many available Timescale and PostgreSQL parameters. By providing the
ability to tune various runtime settings, Timescale provides the balance
and flexibility you need when running your workloads in a hosted environment.
You can use [Service settings][settings] and [Service operations][operations] to
customize Timescale configurations.

[settings]: /use-timescale/:currentVersion:/configuration/advanced-parameters/
[operations]: /use-timescale/:currentVersion:/configuration/customize-configuration/
