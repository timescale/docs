# Access your database

Now that you have TimescaleDB set up and running in Timescale Cloud, it's time
to connect to your database. While this can be accomplished with many tools, `psql`
is the standard command line interface for interacting with a PostgreSQL
or TimescaleDB instance.

Below, we'll verify that you have `psql` installed and show you how to connect
to your TimescaleDB database.

## Verify that `psql` is installed
Before you start, let's confirm that you already have `psql` installed.
In fact, if you've ever installed PostgreSQL or TimescaleDB before, you likely already
have `psql` installed.

In a command line or terminal window, run the following command. If `psql` is
installed, it returns the version number. Otherwise, it returns an error.

```bash
psql --version
```

<highlight type="tip">
If you don't have `psql` installed, follow the instructions provided
in our How-to guides for [Installing `psql`](/timescaledb/latest/how-to-guides/connecting/psql/) and then return here.
</highlight>

## Connect to your TimescaleDB server
Now you've confirmed that `psql` is installed, it's time to connect to your
Timescale Cloud instance.

In Timescale Cloud, open the **Service Details** by clicking on the service
that you created in [Step 1][launch-timescaledb].

Copy the **Service URL** from the information displayed. This service URL contains
all the information to connect to your new service *_except_* the password.

In a terminal window, type the following command, substituting the **Service URL**
that you just copied for the sample URL shown below:

```bash
psql postgres://[USERNAME]:[PASSWORD]@[HOSTNAME]:[PORT]/[DATABASENAME]?sslmode=require
```

<highlight type="tip">
Because the URL provided in the Timescale Cloud interface does not supply the
password, you are prompted for the password in order to finish authenticating.

If you want to save yourself time, you can add the password to the URL by adding
a colon and the password between the username and the hostname as shown
in the placeholder.
</highlight>

Now that you've connected to your Timescale Cloud service, let's look at how to
quickly add data so that you can start to explore the power of TimescaleDB.

[install-psql]: /how-to-guides/connecting/psql/
[launch-timescaledb]: /getting-started/launch-timescaledb/
