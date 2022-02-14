# Metrics
Timescale Cloud provides a Metrics dashboard for managing your services. You can
see the Metrics dashboard in your Timescale Cloud account by navigating to the
`Services` section, clicking the service you want to explore, and selecting the
`Metrics` tab.

You can view metrics for your services for any of these time ranges:
*   Last hour, with one minute granularity
*   Last 24 hours, with one minute granularity
*   Last seven days, with one hour granularity
*   Last thirty days, with one hour granularity

To change the view, select the time range from the drop down menu.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-metrics_lastmonth.png" alt="Timescale Cloud Metrics dashboard"/>

Additionally, you can turn automatic metric refreshes on and off. When automatic
metric refresh is on, the dashboard updates every thirty seconds.

In some cases, gray vertical bars display on the metrics dashboard, like this:

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-metrics_graybar.png" alt="Timescale Cloud Metrics not collected"/>

This indicates that metrics have not been collected for the period shown. It
does not mean that your Timescale Cloud service was down.
