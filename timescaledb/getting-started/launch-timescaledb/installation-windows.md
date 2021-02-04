## Windows ZIP Installer [](installation-windows)

**Note: TimescaleDB requires PostgreSQL 11 or 12.**

#### Prerequisites

- [Visual C++ Redistributable for Visual Studio 2015][c_plus] (included in VS 2015 and later)
- A standard **PostgreSQL :pg_version: 64-bit** installation
- Make sure all relevant binaries are in your PATH: (use [pg_config][])
- Installation must be performed from an account with admin privileges

#### Build & Install

1. Download the the [.zip file for your PostgreSQL version][windows-dl].

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
file to include our library in the parameter `shared_preload_libraries`.
If you ran `timescaledb-tune` during the install, you are already done.
If you did not, you can re-run the installer.

This will ensure that our extension is properly added to the parameter
`shared_preload_libraries` as well as offer suggestions for tuning memory,
parallelism, and other settings.

Then, restart the PostgreSQL instance.

>:TIP: Our standard binary releases are licensed under the Timescale License,
which allows to use all our capabilities.
To build a version of this software that contains
source code that is only licensed under Apache License 2.0, pass `-DAPACHE_ONLY=1`
to `bootstrap`.   

[c_plus]: https://www.microsoft.com/en-us/download/details.aspx?id=48145
[pg_config]: https://www.postgresql.org/docs/10/static/app-pgconfig.html
[windows-dl]:  https://timescalereleases.blob.core.windows.net/windows/timescaledb-postgresql-:pg_version:_x.y.z-windows-amd64.zip
[config]: /getting-started/configuring
[contact]: https://www.timescale.com/contact
[slack]: https://slack.timescale.com/
[update-tsdb-2]: /update-timescaledb/update-tsdb-2
