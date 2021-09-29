# Launch your first instance

For this Getting Started tutorial we'll use Timescale Cloud to get you up
and running quickly. Timescale Cloud combines the power and reliability
of TimescaleDB with a fully-managed, cloud-native experience that is easy to
start and less expensive to operate.

Creating a Timescale Cloud account is fast and simple, allowing you to explore
TimescaleDB free for 30 days, no credit card required. We're just excited
that you are ready to dive into the world of time-series data with TimescaleDB!

<highlight type="tip">
If you would prefer to setup TimescaleDB in your own environment and follow
along with the rest of the _Getting Started_ tutorial, please see our documentation
for [installing self-hosted TimescaleDB](/timescaledb/latest/how-to-guides/install-timescaledb/)
</highlight>

### Step 1: Create a Timescale Cloud account

Sign up for Timescale Cloud by visiting [console.cloud.timescale.com][cloud-signup].

Provide your full name, email address, and a strong password to start:

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/forge_images/timescale-forge-signup-page.png" alt="Sign up for Timescale Forge"/>

You will need to confirm your account by clicking the link you receive via
email. If you do not receive this link, please first check your spam folder
and, failing that, please [contact us][contact-timescale].

### Step 2: Create your first service

After you complete account verification, you can visit the
[Timescale Cloud console][cloud-console] and login with your credentials.

To begin, click 'Create service'.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/forge_images/timescale-forge-service-creation.png" alt="Set up a Timescale Forge service"/>

For the purposes of this tutorial, **you can simply select the default name, compute
and storage options**. But don't worry, if you want to do more with Timescale Cloud
after you've completed everything, you can always resize your service or create
a new one in a few clicks!

After you select 'Create service', you will see confirmation of your service account and
password information. You should save the information in this confirmation screen in
a safe place:

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/forge_images/timescale-forge-service-confirmation.png" alt="View Timescale Forge service information"/>

<highlight type="warning">
 If you forget your password in the future, you can reset your password from the *service dashboard*.
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

Now let's make sure you can connect to the database before we start adding data
and learning about everything that TimescaleDB offers!

[install-timescaledb]: /how-to-guides/install-timescaledb/
[cloud-signup]: https://cloud.timescale.com
[cloud-console]: https://console.cloud.timescale.com/login
[contact-timescale]: https://www.timescale.com/contact
