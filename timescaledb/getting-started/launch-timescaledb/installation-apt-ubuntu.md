## apt Installation (Ubuntu) [](installation-apt-ubuntu)

This will install TimescaleDB via `apt` on Ubuntu distros.

**Note: TimescaleDB requires PostgreSQL 11 or 12.**

#### Prerequisites

- Ubuntu 18.04 or later, except obsoleted versions.
Check [releases.ubuntu.com][ubuntu-releases] for list of
non-obsolete releases.

#### Build & Install

>:WARNING: If you have another PostgreSQL installation not via `apt`,
this will likely cause problems.
If you wish to maintain your current version of PostgreSQL outside
of `apt`, we recommend installing from source.  Otherwise, please be
sure to remove non-`apt` installations before using this method.

**If you don't already have PostgreSQL installed**, add PostgreSQL's third
party repository to get the latest PostgreSQL packages (if you are using Ubuntu older than 19.04):
```bash
# `lsb_release -c -s` should return the correct codename of your OS
echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -c -s)-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
```

Add TimescaleDB's third party repository and install TimescaleDB,
which will download any dependencies it needs from the PostgreSQL repo:
```bash
# Add our PPA
sudo add-apt-repository ppa:timescale/timescaledb-ppa
sudo apt-get update

# Now install appropriate package for PG version
sudo apt install timescaledb-2-postgresql-:pg_version:
```

#### Upgrading from TimescaleDB 1.x
If you are upgrading from TimescaleDB 1.x, the `apt` package will first
uninstall the previous version of TimescaleDB and then install the latest TimescaleDB 2.0
binaries. The feedback in your terminal should look similar to the following:

```bash
Reading package lists... Done
Building dependency tree       
Reading state information... Done
The following additional packages will be installed:
  timescaledb-2-loader-postgresql-12
The following packages will be REMOVED:
  timescaledb-loader-postgresql-12 timescaledb-postgresql-12
The following NEW packages will be installed:
  timescaledb-2-loader-postgresql-12 timescaledb-2-postgresql-12
0 upgraded, 2 newly installed, 2 to remove and 11 not upgraded.
Need to get 953 kB of archives.
After this operation, 1314 kB of additional disk space will be used.
Do you want to continue? [Y/n]
```

Once you confirm and install the newest binary package, you must still perform the
EXTENSION update as discussed in [Updating Timescale to 2.0][update-tsdb-2].

#### Configure your database

There are a [variety of settings that can be configured][config] for your
new database. At a minimum, you will need to update your `postgresql.conf`
file to include our library in the parameter `shared_preload_libraries`.
The easiest way to get started is to run `timescaledb-tune`, which is
installed by default when using `apt`:
```bash
sudo timescaledb-tune
```

This will ensure that our extension is properly added to the parameter
`shared_preload_libraries` as well as offer suggestions for tuning memory,
parallelism, and other settings.

To get started you'll now need to restart PostgreSQL:
```bash
# Restart PostgreSQL instance
sudo service postgresql restart
```

[ubuntu-releases]: http://releases.ubuntu.com/
[config]: /getting-started/configuring
[contact]: https://www.timescale.com/contact
[slack]: https://slack.timescale.com/
[multi-node-basic]: /getting-started/setup-multi-node-basic
[update-tsdb-2]: /update-timescaledb/update-tsdb-2
