# Launch your first instance

Getting Started tutorial, we'll use Timescale Cloud to get you up
and running quickly. Timescale Cloud combines the power and reliability
of TimescaleDB with a fully managed, cloud-native experience that is easy to
start and less expensive to operate.

Creating a Timescale Cloud account is fast and simple, allowing you to explore
TimescaleDB free for 30 days, no credit card required. We're just excited
that you're ready to dive into the world of time-series data with TimescaleDB.

<highlight type="tip">
If you would prefer to set up TimescaleDB in your own environment and follow
along with the rest of the _Getting Started_ tutorial, please see our documentation
for [installing self-hosted TimescaleDB](/install/latest/self-hosted/).
</highlight>

### Step 1: Create a Timescale Cloud account

Sign up for Timescale Cloud by visiting [console.cloud.timescale.com][cloud-signup].

Provide your full name, email address, and a strong password to start:

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-signup.png" alt="Sign up for Timescale Cloud"/>

You need to confirm your account by clicking the link you receive via
email. If you don't receive this link, first check your spam folder
and, failing that, [contact us][contact-timescale].

### Step 2: Create your first service

After confirming your account, visit the
[Timescale Cloud console][cloud-console] and log in with your credentials.

To begin, click 'Create service'.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-createdb.png" alt="Create a Timescale Cloud service"/>

For this tutorial, select the default name and compute and storage options.
They'll suffice for now. If you want to do more with Timescale Cloud after
completing the tutorial, you can always resize your service or create a new one
in a few clicks.

After you select 'Create service,' you can see confirmation of your service
account and password. Save the information in this confirmation screen in a safe
place:

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-build-service.png" alt="Timescale Cloud service creation confirmation"/>

<highlight type="warning">
 You won't be able to view your password again, so remember to save it. But you
 can always reset your password if you forget it.
</highlight>

It takes a couple minutes for your service to be provisioned. When your database is
ready for connection, you should see a green `Running` label above the service in the
service dashboard.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-service-dashboard.png" alt="Timescale Cloud dashboard"/>

Select any service to view *service details*. You can obtain connection,
configuration, and utilization information. In addition, you can reset the
password for your service, power down or power up any service (which stops
or starts your compute, although your storage persists), or delete
a service altogether.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-running-service.png" alt="View Timescale Cloud service information"/>

Now let's make sure you can connect to the database before we start adding data
and learning about everything that TimescaleDB offers.

[install-timescaledb]: /install/latest/
[cloud-signup]: https://cloud.timescale.com
[cloud-console]: https://console.cloud.timescale.com/login
[contact-timescale]: https://www.timescale.com/contact
