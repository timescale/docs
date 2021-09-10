## apt Installation (Ubuntu) [](installation-apt-ubuntu)

This will install TimescaleDB via `apt` on Ubuntu distros.

**Note: TimescaleDB requires PostgreSQL 12 or 13.**

#### Prerequisites

- Ubuntu 18.04 or later, except obsoleted versions.
Check [releases.ubuntu.com][ubuntu-releases] for list of
non-obsolete releases.

#### Build and install

<highlight type="warning">
If you have another PostgreSQL installation not via `apt`,
this will likely cause problems.

If you wish to maintain your current version of PostgreSQL outside
of `apt`, we recommend installing from source.  Otherwise, please be
sure to remove non-`apt` installations before using this method.
</highlight>

Add TimescaleDB's third party repository and install TimescaleDB,
which will download any required dependencies from the PostgreSQL repository:
```bash
# Add our repository
sudo sh -c "echo 'deb https://packagecloud.io/timescale/timescaledb/ubuntu/ `lsb_release -c -s` main' > /etc/apt/sources.list.d/timescaledb.list"
wget --quiet -O - https://packagecloud.io/timescale/timescaledb/gpgkey | sudo gpg --dearmor > /usr/share/keyrings/postgresql.keyring
sudo apt-get update

# Now install appropriate package for PG version
sudo apt install timescaledb-2-postgresql-13
```
<highlight type="tip">
Users coming from previous versions that have installed the PPA need to add the
new Ubuntu package repository for the release of TimescaleDB 2.4.
</highlight>

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
[config]: /how-to-guides/configuration/
[update-tsdb-2]: /how-to-guides/update-timescaledb/update-timescaledb-2/
