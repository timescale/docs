import CreateTimescaleAccount from "versionContent/_partials/_cloud-installation.mdx";

`timescalecli` is a python library that you use to securely administer your Timescale Cloud project, create services
and interact with your data in each service.

<Procedure>

1. **Create a Timescale Cloud account**

   1.  Sign up for a [30 day free trial][sign-up].

       You receive a confirmation email in your inbox.
   1.  In the confirmation email, click the link supplied and sign in to [Timescale Console][tsc-portal].

        Answer the requirements questions, they help us optimize the Timescale service for your use case.

1. **Install `timescalecli`**

   With [pipx][pipx-install] installed on your developer environment, run the following command:
    ```shell
    pipx install git+ssh://git@github.com/timescale/timescale-cli.git
    ```
    You can now run `timescalecli` from the command line. To update to the latest
   version of timescalecli, run `pipx reinstall timescalecli`.

1. **Add your Timescale Cloud credentials to timescalecli**

   Either:
   - **Add credentials for multiple sessions**:

     1. In [Timescale Console](https://console.cloud.timescale.com/dashboard/services) click
       `Timescale Project` > `Project Settings`.
     1. In `Project settings`, click `Create credentials`, then add your credentials to `~/.timescalecli`.

       ![Add credentials to the CLI](https://assets.timescale.com/docs/images/timescale-cli-add-security-information.png)

       The variables to update in `~/.timescalecli` are:
       ```shell
       TIMESCALE_API_ACCESS_KEY=<Your Public Key>
       TIMESCALE_API_SECRET_KEY=<Your Secret Key>
       TIMESCALE_PROJECT_ID=<Your Project ID>
       ```

       You can now use timescalecli in multiple terminal sessions.

   - **Add credentials to your current Terminal session**:

      1. In Terminal, run the following command:

         ```shell
         timescalecli login -u <Your email> -p <Your Timescale Cloud password> --eval
         ```

         Timescale CLI returns `TIMESCALE_API_TOKEN=<token>`. This token is valid for a
         couple of hours.
      1. Add this variable to the environment.

       You can now use timescalecli in your current terminal session.

3. **Create a Timescale Cloud service**

    Run the following command:
    ```shell
    timescalecli service create <service-name>
    ```
    timescalecli creates the service, then opens a `psql` session for you.

1. **Create a standard table**

    ```sql
    CREATE TABLE stocks_real_time ( \
      time TIMESTAMPTZ NOT NULL, \
      symbol TEXT NOT NULL, \
      price DOUBLE PRECISION NULL, \
      day_volume INT NULL \
    );
    ```

    To see your new table, run `\dt`
1. **Convert the table to a [hypertable][hypertables]**

    ```sql
    SELECT create_hypertable('stocks_real_time', by_range('time'));
    ```

</Procedure>

To see all commands available with timescalecli, use the help mechanism:

- `timescalecli --help` - lists all available commands.
- `timescalecli <command> --help` - list the options for this command.

[sign-up]: https://console.cloud.timescale.com/signup
[tsc-portal]: https://console.cloud.timescale.com/
[services-how-to]: /use-timescale/:currentVersion:/services/
[install-psql]: /use-timescale/:currentVersion:/integrations/query-admin/psql/
[connect-to-your-service]: /getting-started/:currentVersion:/services/#connect-to-your-service
[create-service]: https://console.cloud.timescale.com/dashboard/create_services
[what-is-time-series]: https://www.timescale.com/blog/what-is-a-time-series-database/#what-is-a-time-series-database
[what-is-dynamic-postgres]: https://www.timescale.com/dynamic-postgresql
[how-plans-work]: /about/:currentVersion:/pricing-and-account-management/#how-plans-work
[install-timescale-cli]: https://github.com/timescale/timescale-cli?tab=readme-ov-file#install-and-configure-timescalecli
[pipx-install]: https://github.com/pypa/pipx?tab=readme-ov-file#install-pipx
[hypertables]: /use-timescale/:currentVersion:/hypertables/
