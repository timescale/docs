# Access your database

We provide two scenarios for how to connect to TimescaleDB database's using third-party tools:
- [Accessing TimescaleDB Cloud instance using third-party tools](#accessing-timescaledb-cloud-instance-using-third-party-tools)
- [Accessing TimescaleDB Docker instance using third-party tools](#accessing-timescaledb-docker-instance-using-third-party-tools)

Feel free to select the scenario that best suits your needs. 

There are many great technologies you can use to connect to TimescaleDB instances. If a tool works with PostgreSQL, it will work with TimescaleDB. For this tutorial, we use [DBeaver][dbeaver-link]. DBeaver is a free, open-source, multi-platform database tool. For information on how to install DBeaver, visit [their installation page][dbeaver-install]. 

If you decide to use another third-party tool, the process that we cover on this page should be similar to the one you will use with other third-party tools. However, if you have questions, feel free to join TimescaleDB's [community Slack][slack] or [Forum][forum].


## Accessing TimescaleDB Cloud instance using third-party tools

First, you need to [login to your Timescale Cloud account][cloud-log-in]. Once in, open the **Service Details** for your database by clicking on the service
that you created in [the previous section][launch-timescaledb].

Leave the expanded database view open.

Next, open up DBeaver. In DBeaver, there are multiple ways to create a new database connection. One is to find the 'Database' navigation option at the top, then select 'New Database Connection'. The GIF below shows another method where you select the new database connection icon in the top left corner. 

Once selecting the 'New Database Connection' option, a pop-up appears. Here you can specify the type of database you want to connect to. The option you need to choose is 'TimescaleDB'. If 'TimescaleDB' does not appear initially in the list, a search bar is available at the top that will filter the databases shown. Click on the 'TimescaleDB' option. 

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/dbeaver-new-connection.gif" alt="Create new database connection"/>

Now, you need to shift back to your Timescale Cloud database information and enter it into the 'Connection Settings' pop-up window within DBeaver. Use the host, port, database, and username information available from the 'Overview' section in the expanded view of your database. 

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-running-service.png" alt="Service info for connecting"/>

Once entering all the values into their respective DBeaver inputs, the last value you need to place is the database password. Once in, press the 'Finish' button to establish the connection. 

Now that you've connected to your Timescale Docker instance, you can look at how to
[quickly add data][add-data] and explore the power of TimescaleDB.


## Accessing TimescaleDB Docker instance using third-party tools

If you followed the [previous steps in this tutorial][launch-docker], we provided this code for creating a TimescaleDB Docker instance. 

```
docker run -d --name timescaledb -p 127.0.0.1:5432:5432 \
-e POSTGRES_PASSWORD=password timescale/timescaledb:latest-pg14
```

If you used the same port and host mappings, the port value for connecting to your database would be 5432 and the host value 127.0.0.1. 

Next, open up DBeaver. In DBeaver, there are multiple ways to create a new database connection. One is to find the 'Database' navigation option at the top, then select 'New Database Connection'. The GIF below shows another method where you select the new database connection icon in the top left corner. 

Once selecting the 'New Database Connection' option, a pop-up appears. Here you can specify the type of database you want to connect to. The option you need to choose is 'TimescaleDB'. If 'TimescaleDB' does not appear initially in the list, a search bar is available at the top that will filter the databases shown. Click on the 'TimescaleDB' option. 

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/dbeaver-new-connection.gif" alt="Create new database connection"/>

TimescaleDB Docker images by default set the database and user as postgres. With the default database and user information, along with the collected host and port values for your container, you can fill all the 'Connection Settings' inputs within DBeaver.

Once entering all values into their respective DBeaver inputs, the last value you need to place is the database password. Once in, press the 'Finish' button to establish the connection. 

Now that you've connected to your Timescale Docker instance, you can look at how to
[quickly add data][add-data] and explore the power of TimescaleDB.



[add-data]: /getting-started/add-data/
[launch-docker]: /getting-started/launch-timescaledb/launch-timescaledb-docker/
[dbeaver-link]: https://dbeaver.io/
[dbeaver-install]: https://dbeaver.io/download/
[slack]: https://slack.timescale.com/
[forum]: https://www.timescale.com/forum/
[cloud-log-in]: https://console.cloud.timescale.com/
[launch-timescaledb]: /getting-started/launch-timescaledb/launch-timescaledb-cloud/