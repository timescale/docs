# Launch your first instance!

For this Getting Started tutorial we'll utilize Timescale Forge to get you up
and running quickly. Timescale Forge combines the power and reliability 
of TimescaleDB with a fully-managed, cloud-native experience that is easy to 
start and less expensive to operate.

Creating a Timescale Forge account is fast and simple, allowing you to explore
TimescaleDB free for 30 days, no credit card required. We're just excited
that you are ready to dive into the world of time-series data with TimescaleDB!

<highlight type="tip">
If you would prefer to setup TimescaleDB in your own environment and following 
along with the rest of the _Getting Started_ tutorial, please see our documentation
for [installing self-hosted TimescaleDB][install-timescaledb]
</highlight>

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
1. Next, choose your CPU and memory configuration, from (0.5 CPU, 2GB RAM) to 
(8 CPU, 32 GB RAM).
1. Select your storage requirements, from 25 GB to 1 TB.  Note that with TimescaleDB 
compression, this is typically equivalent to 400 GB to 16+ TB of uncompressed 
storage (although compression rates can vary based on your data).
1. Note the estimated cost of running your chosen configuration. Feel free to 
[contact us][contact-timescale] if you would like to discuss pricing and 
configuration options best suited for your use case.
1. Click 'Create service' once your configuration is complete.

<highlight type="tip">
Don't worry if too much about the size settings that you choose initially. With
Timescale Forge, it's easy to modify both the compute (CPU/Memory) and storage 
associated with the service that you just created. As you get to know 
TimescaleDB and how your data processing needs vary, it's easy to 
[right-size your service with a few clicks](#forge-resize)!
</highlight>

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


[install-timescaledb]: /how-to-guides/install-timescaledb/