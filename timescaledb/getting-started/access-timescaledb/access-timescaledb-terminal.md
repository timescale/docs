# Access your database
You can access your TimescaleDB database from the terminal. This section covers
three scenarios:

- [Accessing a Timescale Cloud instance using your local terminal](#connect-to-a-timescale-cloud-instance-using-your-local-terminal)
- [Accessing a TimescaleDB Docker instance using your local terminal](#connect-to-a-timescaledb-docker-instance-using-your-local-terminal)
- [Accessing a TimescaleDB Docker instance through the container's terminal](#connect-to-a-timescaledb-docker-instance-using-the-container)

You can jump directly to the scenario that best suits your needs. If you're
connecting from a local terminal, first verify that [`psql` is
installed](#verify-that-psql-is-installed).

<highlight type="note">
Connecting from the terminal is one way of accessing TimescaleDB. You can also
access your database with third-party tools. To learn more, see the
[third-party tools guide](/timescaledb/latest/getting-started/access-timescaledb/access-timescaledb-third-party-tools/).
</highlight>

## Verify that psql is installed 
If you're connecting from your local terminal, first verify that `psql` is
installed. Because you installed TimescaleDB, you likely already have `psql`.

To double-check, run the following command from the command prompt:

```bash
psql --version
```

If `psql` is installed, it returns the version number. Otherwise, it returns an error.

If you don't have `psql` installed, follow the guide to [installing
`psql`][install-psql]. Then, return here.

## Connect to a Timescale Cloud instance using your local terminal 
Connect to your TimescaleDB instance in Timescale Cloud by using `psql` with
your database credentials.

<procedure>

### Connecting to a Timescale Cloud instance using your local terminal

1.  Log in to [your Timescale Cloud account][cloud-log-in].
1.  Click on a service to view its details.
1.  Copy the `Service URL`. The service URL contains all the information needed
    to connect to your service, except the password.
    
    <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-service-url.png" alt="Service URL for connecting"/>

1.  At the command prompt, run the following command. Replace the sample URL
    with the service URL that you just copied.
    ```bash
    psql postgres://<USERNAME>@<HOSTNAME>:<PORT>/<DATABASE_NAME>?sslmode=require
    ```
1.  Enter your service password when prompted. Use your service password, which
    was created when you launched your database, not your Timescale Cloud
    password. 

</procedure>

<highlight type="note">
To connect and authenticate in a single step, you can add your password to the
service URL. Insert a colon and the password between the username and the
hostname, like this:

```bash
psql postgres://<USERNAME>:<PASSWORD>@<HOSTNAME>:<PORT>/<DATABASE_NAME>?sslmode=require
```

</highlight>

Now that you've connected to your Timescale Cloud service, learn how to [add
data][add-data] and explore the power of TimescaleDB.

## Connect to a TimescaleDB Docker instance using your local terminal 
Connect to your TimescaleDB instance on Docker by using `psql` from your local
terminal. 

<procedure>

### Connecting to a TimescaleDB Docker instance using your local terminal
1.  Double-check the port and host information that you used to create your
    Docker container. If you followed the [Docker installation steps in this
    tutorial][launch-docker], the port is `5432` and the host is `127.0.0.1`.
    Otherwise, the port and host are the values you provided for the `-p` flag:
    ```
    -p <HOST>:<HOST_PORT>:<CONTAINER_PORT>
    ```
1.  Connect to your database with `psql`. If you used the same port and host
    mapping as the tutorial, run:
    ```
    psql -p 5432 -h localhost -U postgres
    ```
    Otherwise, replace the flag values with your own vales. `-p` specifies the
    port, `-h` specifies the host, and `-U` specifies the user. By default, the
    user is `postgres`. 
    <!-- COMMENT: 
    Is the port the host port or the container port? For example, if you created 
    the container with `-p 127.0.0.1:5431:5432`, would you use `5431` or `5432` 
    here? 
    -->
1.  Enter your password when prompted. Use the password you set within your
    initial `docker run` command.

</procedure>

Now that you've connected to your TimescaleDB Docker instance, learn how to [add
data][add-data] and explore the power of TimescaleDB.

## Connect to a TimescaleDB Docker instance using the container 
Connect to a TimescaleDB instance on Docker by using the container's terminal.
You don't need to install `psql` locally for this method. Your Docker container
already has `psql` tools.

<procedure>

### Connecting to a TimescaleDB Docker instance using the container
1.  Double-check the information that you used to create your Docker container.
    If you followed the [Docker installation steps in this
    tutorial][launch-docker], the container name is `timescaledb`. Otherwise,
    the container name is the value you provided for the `-name` flag:
    ```
    --name <CONTAINER_NAME>
    ```
1.  Connect to your container's terminal. If you used `timescaledb` as your
    container name, run:
    ```
    docker exec -it timescaledb psql -U postgres
    ```
    The `docker exec` command allows you to run commands within an already
    running container. The `-it` option opens a terminal session for your
    container through your local terminal. `timescaledb` specifies the name of
    the container you wish to access. `psql -U postgres` is the code you need to
    execute within your container’s terminal to connect to the database.

</procedure>

Now that you've connected to your Timescale Docker instance, learn how to [add
data][add-data] and explore the power of TimescaleDB.

[access-third-party]: /getting-started/access-timescaledb/access-timescaledb-third-party-tools/
[install-psql]: /how-to-guides/connecting/psql/
[cloud-log-in]: https://console.cloud.timescale.com/
[launch-timescaledb]: /getting-started/launch-timescaledb/launch-timescaledb-cloud/
[add-data]: /getting-started/add-data/
[launch-docker]: /getting-started/launch-timescaledb/launch-timescaledb-docker/