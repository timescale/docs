# Set up TimescaleDB and Grafana
This tutorial uses Managed Service for TimescaleDB to set up your database, and
to set up Grafana. You can [create a free account][mst-login] to try it out.

## Create a new service for Grafana
You need to sign in to your Managed Service for TimescaleDB account to create a
new service to run Grafana.

### Procedure: Creating a new service for Grafana
1.  [Log in to your MST account][mst-login]. By default, you start on the
    `Services` view, showing any services you currently have in your project.
1.  Click `Create a new service`.
1.  In the `Select your service` section, click `TimescaleDB Grafana - Metrics
    dashboard`:
    <img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/mst-selectservice-grafana.png" alt="Select the Grafana service"/>
1.  In the `Select your cloud service provider` and `Select your cloud service
    region` sections, choose the provider and region that you prefer, or accept
    the default values.
1.  In the `Select your service plan` section, click `Dashboard-1`.
1.  In the `Provide your service name` section, type a name for your new
    service. In this example, we've used `grafana-tutorial`.
    <img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/mst-nameservice-grafana.png" alt="Name the Grafana service"/>
1.  When you are happy with your selections, click `Create Service` to go back  
    to the `Services` view while your service is created. The status indicator
    shows `REBUILDING` while the service is being created. It is ready for you
    to use when the indicator is green and shows `RUNNING`. This usually takes
    a couple of minutes, but different clouds can vary. You can click the
    service name in the list to see more information and make changes.
    <img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/mst-buildservice-grafana.png" alt="Building the Grafana service"/>

## Log in to your MST Grafana service
When your service is built, you can log and set up your data services.

### Logging in to your MST Grafana service
1.  In the [MST account][mst-login] `Services` view, click on the name of your new Grafana service.
1.  Click the link next to the `host` row, or copy and pastw the Service URI into a new browser tab.
1.  Obtain your log in details from `connection parameters` on the service `Overview` page.


And once you login you can see the Grafana welcome page.


If you have any questions about the process we'd be happy to help you get started.

Note that data sources beginning with the string aiven- are default datasource names that Timescale Cloud will overwrite, you should create your own data sources using a different name prefix.


## Connect Grafana to your TimescaleDB instance
Now you have your Grafana service up and running,  you need to configure Grafana to connect to your TimescaleDB instance.

### Connecting Grafana to your TimescaleDB instance
1.  Select `Add Data Source` and choose the `PostgreSQL` option in the SQL group:
    <img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/add_data_source.png" alt="Adding Postgres to Grafana"/>
1.  In the configuration screen, supply the `Host`, `Database`, `User`, and `Password` for
your TimescaleDB instance.
Don't forget to add the port number after your host URI. For example, `hostname.timescaledb.io:19660`.
Since we will be connecting to a TimescaleDB instance for this
tutorial, we will also want to check the option for 'TimescaleDB' in the
'PostgreSQL details' section of the PostgreSQL configuration screen.
1.  You should also change the 'Name' of the database to something descriptive. This is
optional, but will inform others who use your Grafana dashboard what this data source
contains.
1.  Once done, click `Save & Test`. You should receive confirmation that your database
connection is working.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/save_and_test.png" alt="Test your Grafana database connection"/>

[mst-login]: https://portal.timescale.cloud/login
