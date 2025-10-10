---
title: About configuration in Tiger Cloud
excerpt: Tiger configures your service automatically based on your compute and storage settings. However, you can also configure a wide range af advanced parameters in Tiger Cloud Console
products: [cloud]
keywords: [configuration, memory, workers, settings]
---

# About configuration in $CLOUD_LONG

By default, $CLOUD_LONG uses the default $PG server configuration settings.
Most configuration values for a $SERVICE_LONG are initially set in accordance with
best practices given the compute and storage settings of the $SERVICE_SHORT. Any time
you increase or decrease the compute for a $SERVICE_SHORT, the most essential values
are set to reflect the size of the new $SERVICE_SHORT.

There are times, however, when your specific workload could require tuning some
of the many available $CLOUD_LONG-specific and $PG parameters. By providing the
ability to tune various runtime settings, $CLOUD_LONG provides the balance
and flexibility you need when running your workloads in a hosted environment.
You can use [$SERVICE_SHORT settings][settings] and [$SERVICE_SHORT operations][operations] to
customize $CLOUD_LONG configurations.

[settings]: /use-timescale/:currentVersion:/configuration/advanced-parameters/
[operations]: /use-timescale/:currentVersion:/configuration/customize-configuration/
