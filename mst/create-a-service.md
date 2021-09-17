# About services
A managed TimescaleDB service is an instance that corresponds to a cloud service
provider tier. You can access all your services from the `Services` tab within
your projects. Before you begin, make sure you have
[signed up to Managed Service for TimescaleDB][sign-up] and created your account.

## Create a service
When you have your account set up, you can log in to the Managed Service for
TimescaleDB [portal][timescale-mst-portal] and create your first service.

### Procedure: Creating a service
1.  [Log in to your account][mst-login]. By default, you start in the
    `Services` view, showing any services you currently have in your project.
1.  Click `Create a new service`.
1.  In the `Select your service` section, click `TimescaleDB`:
    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/mst-selectservice-timescaledb.png" alt="Select the TimescaleDB service"/>
1.  In the `Select your cloud service provider` and `Select your cloud service
    region` sections, choose the provider and region that you prefer, or accept
    the default values.
1.  In the `Select your service plan` section, use the tabs to find a plan that
    best fits your needs.
1.  In the `Provide your service name` section, type a name for your new
    service.
1.  When you are happy with your selections, click `Create Service` to go back  
    to the `Services` view while your service is created. The status indicator
    says `Rebuilding` while the service is created. It is ready for you to use
    when the indicator is green and says `Running`. This usually takes a couple
    of minutes, but different clouds can vary. You can click the service name in
    the list to see more information and make changes.
    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/mst-buildservice-timescaledb.png" alt="Building the service"/>

<highlight type="tip">
During your Managed Service for TimescaleDB trial, you have up to US$300 in
credits to use. This is enough credit to complete all our tutorials and run a
few test projects.
</highlight>

If you're interested in learning more about pricing, visit the
[Managed Service for TimescaleDB pricing calculator][timescale-pricing]. Or,
[contact us][contact] and we can walk you through the best configuration for
your use case.

## Access your database
The best way to access your new database is using the `psql` command line
utility. If you haven't already installed `psql`, you can follow
[these instructions][install-psql].

### Procedure: Accessing your database
1.  In the [Managed Service for TimescaleDB account][mst-login] `Services` view,
    click the name of your new Grafana service.
1.  On the service details page, take a note of the service URI for your service.
1.  Open a terminal, and use `psql` to connect to your service using the URI:
    ```bash
    psql -x "postgres://tsdbadmin:[password]@[hostname]:[port]/defaultdb?sslmode=require"
    ```
    When your connection is successful, you see a message like this:
    ```bash
    psql (12.2, server 11.6)
    SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
    Type "help" for help.
    tsdbadmin@defaultdb=>
    ```
1.  You can verify that TimescaleDB is installed by running the `\dx` command
    at the `psql` prompt to see a list of all your PostgreSQL extensions.

Now you have your service up and running, you can try your
[first tutorial][getting-started].


[sign-up]: https://www.timescale.com/cloud-signup
[mst-login]: https://portal.timescale.cloud/login
[timescale-mst-portal]: https://managed.console.timescale.com
[timescale-pricing]: https://www.timescale.com/products
[contact]: https://www.timescale.com/contact
[getting-started]: /timescaledb/:currentVersion:/getting-started/
[install-psql]: /timescaledb/:currentVersion:/how-to-guides/connecting/psql
