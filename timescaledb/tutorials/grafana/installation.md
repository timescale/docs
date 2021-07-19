# Set up TimescaleDB and Grafana
This tutorial uses Managed Service for TimescaleDB to set up your database, and
to set up Grafana. You can [create a free account][mst-login] to try it out.

## Create a new service
You need to sign in to your Managed Service for TimescaleDB account to create a
new service to run Grafana.

### Procedure: Creating a new MST service for Grafana
1.  [Log in to your MST account][mst-login]. By default, you start on the `Services` view, showing any services you currently have in your project.
1.  Click `Create a new service`.
1.  In the `Select your service` section, click `TimescaleDB Grafana - Metrics dashboard`:
<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/mst-selectservice-grafana.png" alt="Select the Grafana service"/>
1.  In the `Select your cloud service provider` and `Select your cloud service region` sections, choose the provider and region that you prefer, or accept the default values.
1.  In the `Select your service plan` section, click `Dashboard-1`.
1.  In the `Provide your service name` section, type a name for your new service. In this example, we've used `grafana-tutorial`.
<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/mst-nameservice-grafana.png" alt="Name the Grafana service"/>
1.  When you are happy with your selections, click `Create Service` to go back to the `Services` view while your service is created. The status indicator shows `REBUILDING` while the service is being created. It is ready for you to use when the indicator is green and shows `RUNNING`. This usually takes a couple of minutes, but different clouds can vary. You can click the service name in the list to see more information and make changes.





On larger plan types you get more resources available on the Grafana server and the ability to have a certificate on the server that's signed by a CA, removing the need to specifically accept the certificate. This allows among other things creation of easily shareable Grafana links.

You can log into your Timescale Cloud Grafana service by clicking the link next to "host" row or copying and pasting the Service URI to your browser. To login you need to check your account credentials from connection parameters on the overview page of the service.


And once you login you can see the Grafana welcome page.


If you have any questions about the process we'd be happy to help you get started.

Note that data sources beginning with the string aiven- are default datasource names that Timescale Cloud will overwrite, you should create your own data sources using a different name prefix.

You will need to [setup an instance of TimescaleDB][install-timescale].

### Options for installing Grafana

The easiest option for installing Grafana is to use Timescale Cloud. Alternatively,
you can setup your own instance of Grafana.

#### Installing Grafana with Timescale Cloud

If you're using Timescale Cloud, you can setup a Grafana Metrics Dashboard
from the **Create Service** flow.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/create_service.png" alt="Create a new Grafana service"/>

#### Installing your own managed instance of Grafana

You can setup [Grafana][grafana-install] from the Grafana website. Once completed,
follow the rest of the instructions below.

### Connecting Grafana to your TimescaleDB instance

Next, you need to configure Grafana to connect to your TimescaleDB
instance.

Start by selecting 'Add Data Source' and choosing the 'PostgreSQL' option
in the SQL group:

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/add_data_source.png" alt="Adding Postgres to Grafana"/>

In the configuration screen, supply the `Host`, `Database`, `User`, and `Password` for
your TimescaleDB instance.

<highlight type="tip">
 Don't forget to add the port number after your host URI. For example, `hostname.timescaledb.io:19660`.
</highlight>

### Enable TimescaleDB within Grafana

Since we will be connecting to a TimescaleDB instance for this
tutorial, we will also want to check the option for 'TimescaleDB' in the
'PostgreSQL details' section of the PostgreSQL configuration screen.

### Wrapping up

You should also change the 'Name' of the database to something descriptive. This is
optional, but will inform others who use your Grafana dashboard what this data source
contains.

Once done, click 'Save & Test'. You should receive confirmation that your database
connection is working.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/save_and_test.png" alt="Test your Grafana database connection"/>

[mst-login]: https://portal.timescale.cloud/login
[install-timescale]: /how-to-guides/install-timescaledb/
[grafana-install]: https://www.grafana.com
