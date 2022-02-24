# Access your database

We provide three scenarios for how to connect to TimescaleDB database's using the terminal:
- [Accessing TimescaleDB Cloud instance using your local terminal](#connect-to-your-timescaledb-cloud-instance-using-your-local-terminal)
- [Accessing TimescaleDB Docker instance using your local terminal](#connect-to-your-timescaledb-docker-instance-using-your-local-terminal)
- [Accessing TimescaleDB Docker instance through the containers terminal](#connect-to-your-timescaledb-docker-instance-using-the-container) (does not require `psql` tools to be installed locally)

Using the terminal to connect to your database requires that you have access to `psql` tooling. You will need to have `psql` installed locally for the first two scenarios. Feel free to jump to whichever scenario best fits your situation. If you want to use either of the first two methods, check that [`psql` is installed](#verify-that-psql-is-installed).

## Verify that psql is installed 
Before you start, make sure to check if you already have `psql` installed.
If you’ve ever installed PostgreSQL or TimescaleDB before, you likely already
have `psql` installed.

In a command line or terminal window, run the following command. If `psql` is
installed, it returns the version number. Otherwise, it returns an error.

```bash
psql --version
```

<highlight type="tip">
If you don't have `psql` installed, follow these instructions provided
in our How-to guides for [Installing `psql`][install-psql] and then return here.
</highlight>

## Connect to your TimescaleDB Cloud instance using your local terminal <a name="cloud-terminal"></a>

First, you need to [login to your Timescale Cloud account][cloud-log-in]. Once in, open the **Service Details** for your database by clicking on the service
that you created in [the previous section][launch-timescaledb].

Copy the **Service URL** from the information displayed. This service URL contains
all the information to connect to your new service *_except_* the password.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-service-url.png" alt="Service URL for connecting"/>

In a terminal window, type the following command, substituting the **Service URL**
that you just copied for the sample URL shown below:

```bash
psql postgres://[USERNAME]:[PASSWORD]@[HOSTNAME]:[PORT]/[DATABASENAME]?sslmode=require
```

<highlight type="tip">
Because the URL provided in the Timescale Cloud interface does not supply the
password, you are prompted for the password to finish authenticating.

If you want to save time, you can add the password to the URL by adding
a colon and the password between the username and the hostname, as shown
in the placeholder.
</highlight>

Now that you've connected to your Timescale Cloud service, you can look at how to
[quickly add data][add-data] and explore the power of TimescaleDB.


## Connect to your TimescaleDB Docker instance using your local terminal <a name="docker-terminal"></a>

First, you need to double-check the port and host information you used when creating the docker container. If you [followed the steps provided before][launch-docker], we provided this code for creating the Docker container. 

```
docker run -d --name timescaledb -p 127.0.0.1:5432:5432 \
-e POSTGRES_PASSWORD=password timescale/timescaledb:latest-pg14
```

If you used the same port and host mappings, the port value for connecting would be 5432 and the host value 127.0.0.1. With this information, you can then run the connection code where `-p` specifies the port you used, `-h` specifies the host, and `-U` specifies the user, which by default is postgres. 

```
psql -p 5432 -h localhost -U postgres
```
When submitting the connection code, you will be prompted to type in your password. Use the password you set within your initial `docker run` command. 

Now that you've connected to your Timescale Docker instance, you can look at how to
[quickly add data][add-data] and explore the power of TimescaleDB.

## Connect to your TimescaleDB Docker instance using the container <a name="docker-container"></a>

Remember that this last method does not require you to install `psql` tools locally. Your Docker container will have PostgreSQL and thus `psql` tools. 

If you followed the [previous steps in this tutorial][launch-docker], we provided this code for creating a TimescaleDB Docker instance. 

```
docker run -d --name timescaledb -p 127.0.0.1:5432:5432 \
-e POSTGRES_PASSWORD=password timescale/timescaledb:latest-pg14
```

To connect to your container's terminal, you need to run the following.  

```
docker exec -it timescaledb psql -U postgres
```

The `docker exec` command allows you to run commands within an already running container, which in your case should be true. The `-it` option specifies that you want to open a terminal session for your container through your local terminal. The name, `timescaledb`, specifies the container you wish to access. And then `psql -U postgres` is the code you need to execute within your container’s terminal to connect to the database.

Now that you've connected to your Timescale Docker instance, you can look at how to
[quickly add data][add-data] and explore the power of TimescaleDB.

[install-psql]: /how-to-guides/connecting/psql/
[cloud-log-in]: https://console.cloud.timescale.com/
[launch-timescaledb]: /getting-started/launch-timescaledb/launch-timescaledb-cloud/
[add-data]: /getting-started/add-data/
[launch-docker]: /getting-started/launch-timescaledb/launch-timescaledb-docker/