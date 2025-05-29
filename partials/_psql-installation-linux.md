### Install psql on Linux

You can use the `apt` on Debian-based systems, `yum` on Red Hat-based systems,
and `pacman` package manager to install the `psql` tool.

<Tabs label="install psql">

<Tab title="Debian">

<Procedure>

### Installing psql using the apt package manager

1.  Make sure your `apt` repository is up to date:

    ```bash
    apt-get update
    ```

1.  Install the `postgresql-client` package:

    ```bash
    apt-get install postgresql-client
    ```

</Procedure>

</Tab>

<Tab title="Red Hat">

<Procedure>

### Installing psql using the yum package manager

1.  Make sure your `yum` repository is up to date:

    ```bash
    yum update
    ```

1.  Install the `postgresql-client` package:

    ```bash
    dnf install postgresql14
    ```

</Procedure>

</Tab>

<Tab title="ArchLinux">

<Procedure>

### Installing psql using the pacman package manager

1.  Make sure your `pacman` repository is up to date:

    ```bash
    pacman -Syu
    ```

1.  Install the `postgresql-client` package:

    ```bash
    pacman -S postgresql-libs
    ```

</Procedure>

</Tab>

</Tabs>
