# Service metrics
Timescale Cloud provides a Metrics dashboard for managing your services. You can
see the Metrics dashboard in your Timescale Cloud account by navigating to the
`Services` section, clicking the service you want to explore, and selecting the
`Metrics` tab.

You can view metrics for your services for any of these time ranges:
*   Last hour, with one minute granularity
*   Last 24 hours, with one minute granularity
*   Last seven days, with one hour granularity
*   Last 30 days, with one hour granularity

To change the view, select the time range from the drop-down menu.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-metrics_lastmonth.png" alt="Timescale Cloud Metrics dashboard"/>

Additionally, you can turn automatic metric refreshes on and off. When automatic
metric refresh is on, the dashboard updates every thirty seconds.

In some cases, gray vertical bars display on the metrics dashboard, like this:

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-metrics_graybar.png" alt="Timescale Cloud Metrics not collected"/>

This indicates that metrics have not been collected for the period shown. It
does not mean that your Timescale Cloud service was down.

## Continuous storage monitoring
Timescale Cloud continuously monitors the health and resource consumption of all
database services. You can check your health data by navigating to the `metrics`
tab in your service dashboard. These metrics are also monitored by the Timescale
operations team.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-disk-metrics.png" alt="Timescale Cloud metrics dashboard"/>

If your database exceeds a storage threshold of available resources, some
automated actions are triggered, including notifications, and preventative
actions.

## Automated user alerting
When your disk usage exceeds certain thresholds, you receive an email
notification. These notifications occur at:
*   75%
*   85%
*   95%

So that you aren't overwhelmed by automated message, the alerting thresholds use
low- and high-watermarks, and we limit the frequency of messages we send you
about a particular service.

## Automated overload protection
If your database continues to increase in size past these thresholds, automated
overload protection is activated when your disk becomes 99% full. When this
happens, your database is put into read-only mode, and you receive a
notification on email and the Timescale Cloud console shows the changed status.

When your disk is in read-only mode, you can still query your database, but you
cannot add any new data to it. This is to ensure that your disk does not fill up
to 100%, which could prevent you from crashing due to an out of memory (OOM)
error.

With your database in read-only mode, you need to decide if you are going to
increase your storage capacity, or reduce the size of your database. When you
have done that, you can also add a retention policy, or turn on compression, to
avoid the problem occurring again in the future.
