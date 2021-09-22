## Windows ZIP Installer [](installation-windows)

**Note: TimescaleDB requires PostgreSQL 12.0 or 13.2, or later**

#### Prerequisites

- [Visual C++ Redistributable for Visual Studio 2015][c_plus] (included in VS 2015 and later)
- A standard **PostgreSQL 12 or 13 64-bit** installation
- Make sure all relevant binaries are in your PATH: (use [pg_config][])
- Installation must be performed from an account with admin privileges

#### Build and install

1. Download the the .zip file for your PostgreSQL version - [12][windows-dl-12] or [13][windows-dl-13].
1. Extract the zip file locally
1. Run `setup.exe`, making sure that PostgreSQL is not currently running
1. If successful, a `cmd.exe` window will pop open and you will see the following:

```bash
TimescaleDB installation completed succesfully.
Press ENTER/Return key to close...
```
Go ahead and press ENTER to close the window

#### Updating from TimescaleDB 1.x to 2.0
Once the latest TimescaleDB 2.0 are installed, you can update the EXTENSION
in your database as discussed in [Updating Timescale to 2.0][update-tsdb-2].

#### Configure your database

There are a [variety of settings that can be configured][config] for your
new database. At a minimum, you will need to update your `postgresql.conf`
file to include `shared_preload_libraries = 'timescaledb'`.
If you ran `timescaledb-tune` during the install, you are already done.
If you did not, you can re-run the installer.

This will ensure that our extension is properly added to the parameter
`shared_preload_libraries` as well as offer suggestions for tuning memory,
parallelism, and other settings.

Then, restart the PostgreSQL instance.

<highlight type="tip">
Our standard binary releases are licensed under the Timescale License,
which allows to use all our capabilities.
To build a version of this software that contains
source code that is only licensed under Apache License 2.0, pass `-DAPACHE_ONLY=1`
to `bootstrap`.
</highlight>

[c_plus]: https://www.microsoft.com/en-us/download/details.aspx?id=48145
[pg_config]: https://www.postgresql.org/docs/10/static/app-pgconfig.html
[windows-dl-12]: https://timescalereleases.blob.core.windows.net/windows/timescaledb-postgresql-12_2.4.1-windows-amd64.zip
[windows-dl-13]: https://timescalereleases.blob.core.windows.net/windows/timescaledb-postgresql-13_2.4.1-windows-amd64.zip
[config]: /how-to-guides/configuration/
[contact]: https://www.timescale.com/contact
[slack]: https://slack.timescale.com/
[update-tsdb-2]: /how-to-guides/update-timescaledb/update-timescaledb-2/
