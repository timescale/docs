# Installing Grafana for use with TimescaleDB

### Pre-requisites

You will need to [setup an instance of TimescaleDB][install-timescale].

### Options for installing Grafana

The easiest option for installing Grafana is to use Timescale Cloud. Alternatively,
you can setup your own instance of Grafana.

#### Installing Grafana with Timescale Cloud

If you’re using Timescale Cloud, you can setup a Grafana Metrics Dashboard
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

>:TIP: Don’t forget to add the port number after your host URI. For example, `hostname.timescaledb.io:19660`.

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

[install-timescale]: /getting-started/installation
[grafana-install]: https://www.grafana.com
