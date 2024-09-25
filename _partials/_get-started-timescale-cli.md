import CreateTimescaleAccount from "versionContent/_partials/_cloud-installation.mdx";

`timescale-cli` is a python library that you use to create and manage Ops for your Timescale Cloud services, and 
securely manage Data in your services.

<Procedure>

1. **Install `timescale-cli`**

   With [Python3 >= v3.12.0][python3], [Pip3 >= v23.2.1][pip] and [OpenSSL][openssl] installed on your 
   developer environment, run the following commands:
    ```shell
   git clone git@github.com:timescale/timescale-cli.git
   cd timescale-cli
   python3 -m venv venv
   source venv/bin/activate
   pip3 install .
    ```

1. **Create a Timescale Cloud account**

   1.  Sign up for a [30 day free trial][sign-up].

    You receive a confirmation email in your inbox.
   1.  In the confirmation email, click the link supplied and sign in to [Timescale Console][tsc-portal].

    Answer the requirements questions, they help us optimize the Timescale service for your use case.

1. **Add your credentials to `timescale-cli`**

   1. In [Timescale Console](https://console.cloud.timescale.com/dashboard/services) click
     `Timescale Project` > `Project Settings`.
   1. In `Project settings`, click `Create credentials`, then add your credentials to `timescale-cli/.env`.

      ![Add credentials to the CLI](https://assets.timescale.com/docs/images/timescale-cli-add-keys.png)


3. **Create a Timescale Cloud service**
    In your timescale-cli virtual environment, run the following command:
    ```shell
    timescale-cli service create <service-name>
    ```

1. **Start a psql session with your service**
   ```shell 
   timescale-cli service psql <service-name>
   ```

1. **Create a standard table**

    ```sql
    CREATE TABLE stocks_real_time (
      time TIMESTAMPTZ NOT NULL,
      symbol TEXT NOT NULL,
      price DOUBLE PRECISION NULL,
      day_volume INT NULL
    );
    ```

1. **Convert to a hypertable**

    ```sql
    SELECT create_hypertable('stocks_real_time', by_range('time'));
    ```

</Procedure>

[sign-up]: https://console.cloud.timescale.com/signup
[tsc-portal]: https://console.cloud.timescale.com/
[services-how-to]: /use-timescale/:currentVersion:/services/
[install-psql]: /use-timescale/:currentVersion:/integrations/query-admin/psql/
[connect-to-your-service]: /getting-started/:currentVersion:/services/#connect-to-your-service
[create-service]: https://console.cloud.timescale.com/dashboard/create_services
[what-is-time-series]: https://www.timescale.com/blog/what-is-a-time-series-database/#what-is-a-time-series-database
[what-is-dynamic-postgres]: https://www.timescale.com/dynamic-postgresql
[how-plans-work]: /about/:currentVersion:/pricing-and-account-management/#how-plans-work
[install-timescale-cli]: https://github.com/timescale/timescale-cli?tab=readme-ov-file#install-and-configure-timescale-cli
[python3]: https://www.python.org/downloads/
[pip]: https://pip.pypa.io/en/stable/installation/#supported-methods
[openssl]: https://openssl-library.org/source/index.html
