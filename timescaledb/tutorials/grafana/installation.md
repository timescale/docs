# Set up TimescaleDB and Grafana

Timescale Cloud services are managed from the Timescale Cloud web console. First login to the console with your email address and password and you will be automatically taken to the "Services" view that shows all the services of the currently selected project.

Projects allow organizing groups of services under different topics and each project can for example have different billing settings. An empty project is created for you automatically when you sign-up and the free credits are attached to this project. You can create new projects by clicking the project name in the left side-bar and selecting "Create a new project". The same menu can also be used to switch between projects.

To get started with Grafana, first click the "Create a new service" button.


The dialog that opens allows you to specify the main service properties:

Service name: A short name for the service used to distinguish it from other services. A random name is provided, but you can type in a more friendly name.

Service type: Select "Grafana".

Plan: How many servers and what kind of memory/CPU/disk resources will be allocated to run your service.

Cloud: Which cloud and region to run the service on. Note that the pricing of the same service may differ between cloud providers and their regions.

After making the selections, click the "Create" button and you will be taken back to the service list view and the newly created service is shown with an indicator that it is being created.

Click the service name in the list and the "Overview" information page for the service opens. This view shows the connection parameters for your service, its current status and allows making changes to the service.

The "Status" indicator will say "REBUILDING" while the service is being created for you. Once the service is up and running, the light will change to green and it will say "RUNNING". Note that while typically services start in a couple of minutes, the performance between clouds varies and it can take longer under some circumstances.


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

[install-timescale]: /how-to-guides/install-timescaledb/
[grafana-install]: https://www.grafana.com
