# Launch your first instance of TimescaleDB in the Cloud
Launch your first instance by creating a Timescale Cloud account and then
creating a service.

## Create a Timescale Cloud account
Sign up for Timescale Cloud to start your 30-day free trial, no credit card
required.

<procedure>

### Creating a Timescale Cloud account

1.  Sign up for Timescale Cloud by visiting
    [console.cloud.timescale.com][cloud-signup].
1.  Provide your full name, email address, and a strong password.

    <img class="main-content__illustration"
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-signup-full.png"
    alt="Sign up for Timescale Cloud"/>

1.  Confirm your account by clicking on the link you receive via email. If you
    don't receive this link, first check your spam folder and, failing that,
    [contact us][contact-timescale].

</procedure>

## Create your first service
Once you've created your account, create your first service to get a TimescaleDB
database started.

<procedure>

### Creating your first service

1.  Log in to your new Timescale Cloud account by clicking the link that appears
    after you confirm your account. Or, visit the [Timescale Cloud
    console][cloud-console] and log in with your credentials.
1.  Click the `Create your database` prompt that appears when you first open
    your account. If you don't see the database prompt, click the `Create
    service` button to show it. 

    <img class="main-content__illustration"
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-createdb.png"
    alt="Create a Timescale Cloud service"/> 

    For this tutorial, use the default CPU, memory, and storage settings. The
    default settings also enable auto-scaling, which automatically increases
    your disk size as you approach storage limits. You can change these settings
    for this database later, or use different settings for future databases you
    create. For more information, see the section on [scaling a
    service][scaling].
1.  On the deploying confirmation page, review your service information and the
    instructions for connecting to your database. Save your password in a secure
    location. You won't be able to view it again, but you can always reset it.

    <img class="main-content__illustration"
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-build-service.png"
    alt="Timescale Cloud service creation confirmation"/>

1.  Wait a few minutes for your service to be provisioned. When your database is
    ready for connection, a green `Running` label appears above the service in
    the service dashboard.

    <img class="main-content__illustration"
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-service-dashboard.png"
    alt="Timescale Cloud dashboard"/>

    You can click on the service to view its details, including connection,
    configuration, and utilization information. You can also reset your service
    password, power your service up and down, or delete it.
    
    <img class="main-content__illustration"
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-running-service.png"
    alt="View Timescale Cloud service information"/>

</procedure>

Now that you've created your database service, you can connect to it. This
tutorial describes two connection methods:
*   [Connecting from the terminal][connect-terminal] 
*   [Connecting with third-party tools][connect-3party-tools]

[connect-terminal]: /getting-started/access-timescaledb/access-timescaledb-terminal/
[connect-3party-tools]: /getting-started/access-timescaledb/access-timescaledb-third-party-tools/
[cloud-signup]: https://console.cloud.timescale.com/signup
[cloud-console]: https://console.cloud.timescale.com/login
[contact-timescale]: https://www.timescale.com/contact
[scaling]: cloud/:currentVersion:/scaling-a-service/