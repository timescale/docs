# Launch your first instance

### Step 1: Create a Timescale Cloud account

Sign up for Timescale Cloud by visiting [console.cloud.timescale.com][cloud-signup].

Provide your full name, email address, and a strong password to start:

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-signup-full.png" alt="Sign up for Timescale Cloud"/>

You need to confirm your account by clicking on the link you receive via email. If you 
don't receive this link, first check your spam folder and, failing that, [contact us][contact-timescale].

### Step 2: Create your first service

After confirming your account, there should be a link which will redirect you to your 
new Timescale Cloud account. Alternatively, you can visit the [Timescale Cloud console][cloud-console] 
and log in with your credentials.

When you first open your Cloud account, the 'Create your database' prompt (shown below) may 
automatically be showing, this is how you create your first service. If you do not 
see the database prompt, you can click on the 'Create service' button to show it. 

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-createdb.png" alt="Create a Timescale Cloud service"/>

For this tutorial, all the default settings for the database will suffice. In addition 
to the CPU, Memory, and Storage options shown, auto-scaling is also enabled. This means 
that even if you do hit computing bounds, the service will scale automatically for you. 

For future databases, if you want to change any settings, you can select the 'Advanced options' 
link. Additionally, you can change any service settings later on through the database's dashboard

After you select 'Create service,' you will see a deploying confirmation page. Here 
you find your service information and some examples for how to connect to it. Be sure 
to save off your password in a secure location:

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

Now that you have a database service ready to go, you can connect to it. We provide two connection methods for this tutorial, [how to connect via the terminal][connect-terminal] and [how to connect via third party tools][connect-3party-tools]. 

[connect-terminal]: /getting-started/access-timescaledb/access-timescaledb-terminal/
[connect-3party-tools]: /getting-started/access-timescaledb/access-timescaledb-third-party-tools/
[cloud-signup]: https://console.cloud.timescale.com/signup
[cloud-console]: https://console.cloud.timescale.com/login
[contact-timescale]: https://www.timescale.com/contact
