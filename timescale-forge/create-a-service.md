# Exploring Timescale Forge

Welcome to Timescale Forge! Timescale Forge is a cloud-native TimescaleDB
as a service that is easy to get started and powerful enough for the most
demanding scenarios.

This tutorial will walk you through setting up your Timescale Forge account and
completing your first tutorial project.

### Step 1: Create a Timescale Forge account [](step1-create-account)

Sign up for Timescale Forge by visiting [forge.timescale.com][forge-signup].

Provide your full name, email address, and a strong password to start:

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/forge_images/timescale-forge-signup-page.png" alt="Sign up for Timescale Forge"/>

You will need to confirm your account by clicking the link you receive via
email. If you do not receive this link, please first check your spam folder
and, failing that, please [contact us][contact-timescale].

### Step 2: Create your first service [](step2-create-service)

 After you complete account verification, you can visit the
 [Timescale Forge console][forge-console] and login with your credentials.

 To begin, click 'Create service'.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/forge_images/timescale-forge-service-creation.png" alt="Set up a Timescale Forge service"/>

1. First, supply your service name (e.g., `acmecorp-test` or `acmecorp-dev`).
1. Next, choose your CPU and memory configuration, from (0.25 CPU, 1GB RAM) to
(32 CPU, 128 GB RAM).
1. Select your storage requirements, from 10 GB to 1 TB.  Note that with TimescaleDB
compression, this is typically equivalent to 170 GB to 67+ TB of uncompressed
storage (although compression rates can vary based on your data).
1. Note the estimated cost of running your chosen configuration. Feel free to
[contact us][contact-timescale] if you would like to discuss pricing and
configuration options best suited for your use case.
1. Click 'Create service' once your configuration is complete.

<highlight type="tip">
Don't worry if too much about the size settings that you choose initially. With Timescale Forge,
it's easy to modify both the compute (CPU/Memory) and storage associated with the service
that you just created. As you get to know TimescaleDB and how your data processing needs vary,
it's easy to [right-size your service with a few clicks](/timescale-forge/latest/scaling-a-service/)!
</highlight>

After you select 'Create service', you will see confirmation of your service account and
password information. You should save the information in this confirmation screen in
a safe place:

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/forge_images/timescale-forge-service-confirmation.png" alt="View Timescale Forge service information"/>

<highlight type="warning">
If you forget your password, you can reset it from the `Operations` menu in the service dashboard.
</highlight>

It will take a couple minutes for your service to be provisioned. When your database is
ready for connection, you should see a green `Running` label above the service in the
service dashboard.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/forge_images/timescale-forge-service-dashboard.png" alt="View all Timescale Forge services"/>

Select any service to view *service details*. You can obtain connection,
configuration, and utilization information. In addition, you can reset the
password for your service, power down or power up any service (which stops
or starts your compute, although your storage persists), or delete
a service altogether.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/forge_images/timescale-forge-service-details.png" alt="View Timescale Forge service information"/>

### Step 3: Complete your first tutorial [](step3-tutorial)

Congratulations! You are now up and running with Timescale Forge. In order to
familiarize yourself with the features and capabilities of the product, we
recommend that you complete the [Getting Started][getting-started] tutorial.

### Step 4: Learn more about TimescaleDB

Read about TimescaleDB features in our documentation:

- Create your first ”[hypertable][hypertable-info]”.
- Run your first query using [time_bucket()][time-bucket-info].
- Trying more advanced time-series functions, starting with [gap filling][gap-filling-info] or [real-time aggregates][aggregates-info].

### Step 5: Keep testing during your free trial and enter your billing information when you’re ready

You’re now on your way to a great start with Timescale!

You will have an unthrottled, 30-day free trial with Timescale Forge to
continue to test your use case. Before the end of your trial, we encourage you
to add your credit card information. This will ensure a smooth transition after
your trial period concludes.

### Summary

We’re excited to play a small part in helping you build a best-in-class
time-series application or monitoring tool. If you have any questions, please
feel free to [join our community Slack group][slack-info]
or [contact us][contact-timescale] directly.

Now, it's time to forge!

## Advanced configuration and multi-node setup
Timescale Forge is a versatile hosting service that provides a growing list of
advanced features for your PostgreSQL and time-series data workloads.

Please see additional documentation on how to:
 * [Resize compute and storage][resize] at any time!
 * [Customize your database configuration][configuration] easily!
 * [Create a TimescaleDB multi-node cluster][multi-node] in Timescale Forge!

[forge-signup]: https://forge.timescale.com
[billing-info]: /forge/managing-billing-payments
[slack-info]: https://slack-login.timescale.com
[install-psql]: /timescaledb/:currentVersion:/how-to-guides/connecting/psql/
[getting-started]: /timescaledb/:currentVersion:/getting-started/
[forge-console]: https://console.forge.timescale.com/login
[contact-timescale]: https://www.timescale.com/contact
[hypertable-info]: /timescaledb/:currentVersion:/how-to-guides/hypertables
[time-bucket-info]: /timescaledb/:currentVersion:/how-to-guides/query-data/advanced-analytic-queries#time-bucket
[gap-filling-info]: /timescaledb/:currentVersion:/how-to-guides/query-data/advanced-analytic-queries#gap-filling
[aggregates-info]: /timescaledb/:currentVersion:/getting-started/create-cagg/
[resize]: /scaling-a-service/
[configuration]: /customize-configuration/
[multi-node]: /forge-multi-node/
