# Set up Grafana alerts

>:TOPLIST:
> ### Contents
> - [Prerequisites](#prereqs)
> - [Alerting principles](#alerting-principles)
> - [Introduction alerts in Grafana](#intro-grafana-alerts)
> - [Alert 1: Integrating with Slack](#alert1)
> - [Alert 2: Integrating with PagerDuty](#alert2)
> - [Alert 3: Integrating with other notifications platforms](#alert3)
> - [Summary](#summary)

Alerts are an important aspect of monitoring because they proactively 
inform us when things go wrong and need our attention. This could be:

- When something crashes
- You’re consuming too many resources (e.g., memory, CPU) 
- There’s an outage
- Users report performance degradation, via support tickets

In this tutorial, you'll learn how to setup Grafana to alert you when
something goes wrong using many of the communication channels you already
use:

- [Prerequisites](#prereqs)
- [Alerting principles](#alerting-principles)
- [Introduction alerts in Grafana](#intro-grafana-alerts)
- [Alert 1: Integrating TimescaleDB, Grafana, and Slack](#alert1). This type of integration uses web hooks to send alerts.
- [Alert 2: Integrating TimescaleDB, Grafana, and PagerDuty](#alert2). This type of integration uses an API key and direct integration to send alerts.
- [Alert 3: Integrating TimescaleDB, Grafana, and other notifications platforms](#alert3)
- [Summary](#summary)


### Pre-requisites [](prereqs)

To complete this tutorial, you will need a cursory knowledge of the Structured Query 
Language (SQL). The tutorial will walk you through each SQL command, but it will be 
helpful if you've seen SQL before.

* To start, [install TimescaleDB][install-timescale].
* Next [setup Grafana][install-grafana].

Once your installation of TimescaleDB and Grafana are complete, follow the
[Timescale and Prometheus tutorial][tutorial-prometheus] and configure Grafana to connect
to that database. Be sure to follow the full tutorial if you’re interested in background 
on how to use TimescaleDB.

For this tutorial, you will need to first create various Grafana visualizations before
setting up alerts. Use our [full set of Grafana tutorials][tutorial-grafana] to
obtain the necessary background on Grafana. In this tutorial, we'll simply
inform you of which Grafana visualization to create and the query to use.

### Alerting principles [](alerting-principles)

When setting up alerts for your system, consider the following:

- You should only use alerts when you require human input
- Be careful not to overuse alerts. If an engineer gets an alert too frequently, it can cease to be useful or serve its purpose.
- Use alerts that are directly relevant to your scenario: if you're monitoring a SaaS product, set up alerts for site uptime and latency. If you're monitoring infrastructure, set up alerts for disk usage, high CPU or memory usage, and API errors.

### Introduction to alerts in Grafana [](intro-grafana-alerts)

Beyond data visualization, Grafana also provides alerting functionality 
to keep you notified of anomalies. By using Grafana, you don’t have the 
overhead of learning how to use another piece of software. Nor do you
have to integrate services on your back-end. You simply use your dashboard.

#### Pros and cons of using Grafana alerts

There are some downsides to using Grafana for alerts:

- You can only set up alerts on graph visualizations with time-series output
- Thus, you can't use table output or anything else that is not time-series data

Ultimately, for most cases, this will be okay because:

- You’re mainly dealing with time-series data for alerts
- You can usually turn any other visualization (e.g., a Gauge or a Single Stat) into a time-series graph

#### Available data soruces for Grafana alerts

Only certain data sources are supported for Grafana alerts: PostgreSQL, 
Prometheus, and Cloudwatch. TimescaleDB is, of course, based on PostgreSQL,
and is a valid data source for Grafana alerts.

There are two parts of alerting in Grafana: **Alert Rules** and 
**Notification channels**.

#### Alert Rules

Alert Rules are the most important part of Grafana alerts. Rules are 
conditions that you define for when an alert gets triggered. Grafana 
evaluates rules according to a scheduler and you will need to specify 
how often rules are evaluated.

In plain language, examples of rules could be:

- When disk usage is greater than 90%
- When the average memory usage is greater than 90% for 5 minutes (this is an example of an interval-based rule)
- When the temperatore of a device is outside a given range (this is an example of a rule with many different conditions)

#### Notification channels

Notification channels are where alerts get sent once alert rules are triggered. 
If you have no notification channels, then your alerts will only show up on Grafana

Examples of channels include tools your team may already use:

- Slack
- Email
- OpsGenie
- PagerDuty

Grafana provides integration with webhooks, email, and more than a 
dozen external services.

Whenever we create an alert, we assign it to a notification channel, 
along with a message. In our tutorial, we’ll set up two common notification 
channels: Slack and PagerDuty.

#### Lifecycle of an alert

You can think of alerts as objects that move through different states depending 
on the rule associated with them. Possible states are: OK, PENDING, ALERTING, 
NO DATA.

### Alert 1: Integrating TimescaleDB, Grafana, and Slack [](alert1)

Our goal in this first alert is to proactively notify us in Slack when we 
have sustained high memory usage over time. We will connect Grafana to
Slack using webhooks.

#### Step 0: Set up your Grafana Visualization

Create a new Graph visualization. In the query, connect to the data source
you configured in the [Timescale and Prometheus tutorial][tutorial-prometheus]
and enter the following query:

```sql
SELECT
  $__timeGroupAlias("time", 1m),
  avg(value) as "mem_used_percent"
FROM metrics
WHERE
  $__timeFilter("time") AND
  name LIKE  'mem_used_percent'
GROUP BY 1
ORDER BY 1
```

Your graph should look like this:

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-alerts-tutorial/alert1_query_results_5m.png" alt="Visualizing memory used percentage as time-series data in Grafana"/>

#### Step 1: Define the Grafana alert rule

Click the 'Bell' icon on your visualization to navigate to the Alert section.
We’ll define our alert so that we are notified when average memory consumption
is greater than 90% for 5 consecutive minutes.

Set the frequency for the rule to be evaluated at one minute. This means that the
graph will be polled every minute to determine whether or not an alert should
be sent.

Then set the evaluation period for five minutes. This configures Grafana to look
at the alert in five minute windows.

You won't be able to change the 'When' portion of the query, but you can
set the 'Is Above' threshold to 90. In other words, we will be alerted whenever
the memory used is above 90%.

Use the defaults for the remainder of the configuration. Your configuration should
look like this:

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-alerts-tutorial/alert1_alert_configuration.png" alt="Define Grafana alert for memory used percentage in PostgreSQL"/>

#### Step 2: Configure Slack for Grafana alerts

In most cases, you will want to build a tiered alert system where less critical
alerts go to less intrusive channels (such as Slack), while more critical
alerts go to high attention channels (such as calling or texting someone).

Let's start by configuring Slack. To setup Slack, you will need your Slack
Administrator to give you the webhoo URL to post to a channel. You can
[follow these instructions][slack-webhook-instructions] to obtain this
information.

To configure a notification channel, go to the 'Bell' icon in your main
dashboard. It will be on the far left of the screen. Click on the 'Notification 
Channels' option. In the Notification Channels screen, click 'Add channel'.

In the resulting form, set up the name of your Slack Channel. This will
show up in drop-downs throughout your Grafana instance, so choose
something descriptive that other users of your Grafana instance will
immediately identify with.

Choose 'Slack' as the type and toggle 'Include image' and 'Send reminders' 
on. Enter the Webhook URL supplied by your Slack Admin and choose a
Username that will be descriptive to users of your Slack instance. If you 
want to @-mention someone or a group with your alert post in Slack, you can 
do so in the 'Mention' field.

Your configuration should look like this:

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-alerts-tutorial/alert1_setup_slack.png" alt="Set up Slack and Grafana for Alerts"/>

And, you should be able to send a test message to your Slack instance.

#### Step 3: Connect your Grafana alert to Slack

Now go back to your Graph Visualization and select the 'Alert' tab. In the
'Notifications' section, click on the '+' icon next to 'Send to' and choose 
the Slack notification channel you just created. Supply a message for your 
Slack post as well.

At this point, your alert is configured. If you'd like to test it, feel free 
to change the "90" value you entered for the 'Is Above' field and change it to
something below the current threshold. It should trigger a notification like
this within five minutes or so:

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-alerts-tutorial/alert1_slack_messages.png" alt="Set up Slack and Grafana for Alerts"/>

### Alert 2: Integrating TimescaleDB, Grafana, and PagerDuty [](alert2)

PagerDuty is a popular choice for managing support and incident responses for 
medium-large teams. Many of the steps in this section are similar to the steps
in the Slack section. With PagerDuty, we will need to set up alerts using direct
integration with the PagerDuty API.

#### Step 0: Set up your Grafana visualization

In this section, we will monitor our database in case we run out of disk space 
unexpectedly. This is the kind of alert where you'd want to notify someone 
immediately.

The query for our Graph visualization looks like this:

```sql
SELECT
  $__timeGroupAlias("time", 1m),
  avg(value) AS "% disk used"
FROM metrics
WHERE
  $__timeFilter("time") AND
  name LIKE 'disk_used_percent'
GROUP BY 1
ORDER BY 1
```

#### Step 1: Configure PagerDuty for Grafana alerts

To connect PagerDuty to Grafana, you’ll need an [integration key][pagerduty-integration-key] 
for the service that you’re monitoring. Note this is different from what PagerDuty
refers to as the PagerDuty API key.

Once again, go to your main dashboard and select the 'Bell' icon and select 
'Notification channels'. Add a channel, enter a descriptive name, and choose the
'Pager Duty' type. Supply your integration key.

#### Step 2: Define the Grafana Alert rule

Creating a rule on disk usage is similar to the rule we created earlier about memory usage,
except disk usage can only increase. Therefore, we do not need to supply a 'For' time period 
as we did with Slack. So, in this case, set up your alert to check 'Every' one minute for a
period of zero minutes.

In the 'When' clause, select `last()`, `query(A, 1m, now)`, and supply '80' for the 
'Is Above' field.

Select your PagerDuty channel in the 'Notifications' section and provide a descriptive message.

### Alert 3: Integrating TimescaleDB, Grafana, and other notification platforms [](alert3)

Grafana supports a number of notification platforms, including:

- DingDing
- Discord
- Email
- Google Hangouts
- Hipchat
- Kafka
- Line
- Microsoft Teams
- OpsGenie
- PagerDuty
- Prometheus Alertmanager
- Pushover
- Slack
- Telegram
- Threema
- VictorOps
- Webhooks

Steps for integrating with all of these are similar to the steps you used for Slack (webhooks)
and PagerDuty (API or Integration Key).

### Summary

Complete your Grafana knowledge by following [all the TimescaleDB + Grafana tutorials][tutorial-grafana].

[install-timescale]: /getting-started/installation
[install-grafana]: /getting-started/installation-grafana
[tutorial-prometheus]: /tutorials/tutorial-setup-timescale-prometheus
[tutorial-grafana]: /tutorials/tutorial-grafana
[slack-webhook-instructions]: https://slack.com/help/articles/115005265063-Incoming-Webhooks-for-Slack
[pagerduty-integration-key]: https://support.pagerduty.com/docs/services-and-integrations
