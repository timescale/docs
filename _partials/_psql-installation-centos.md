## Install psql on Ref Hat-based systems 
You can use the `yum` package manager on CentOS systems to install
the `psql` tool.

<procedure>

### Installing psql using the apt package manager
1.  Make sure your `apt` repository is up to date:
    ```bash
    yum update
    ```
1.  Install the `postgresql-client` package:
    ```bash
    dnf install postgresql14
    ```

</procedure>
