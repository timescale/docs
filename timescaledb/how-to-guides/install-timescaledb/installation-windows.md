# Install self-hosted TimescaleDB on Windows systems
You can host TimescaleDB yourself on your Microsoft Windows system.
These instructions use a `zip` installer on these versions:
*   Microsoft Windows 10
*   Microsoft Windows 11
*   Microsoft Windows Server 2019

<highlight type="warning">
If you have already installed PostgreSQL using a method other than the `zip`
installer provided here, you could encounter errors following these
instructions. It is safest to remove any existing PostgreSQL installations
before you begin. If you want to keep your current PostgreSQL installation, do
not install TimescaleDB using this method.
[Install from source](/how-to-guides/install-timescaledb/installation-source/)
instead.
</highlight>

<procedure>

### Installing self-hosted TimescaleDB on Windows-based systems
1.  Download and install the Visual C++ Redistributable for Visual Studio from
    [www.microsoft.com][ms-download].
1.  Download and install PostgreSQL from [www.postgresql.org][pg-download].
1.  In the Windows Search tool, search for `system environment variables`. In
    the `System Properties` dialog, navigate to the `Advanced` tab, and
    click `Environment Variables...`. Locate the `Path` variable and
    click `Edit...`. In the `Edit environment variable` dialog, click `New` and
    type the path to your PostgreSQL `pg_config` file. It should
    be `C:\Program Files\PostreSQL\14\bin\`. Click `OK` to save your changes.
1.  Download the TimescaleDB installation `.zip` file from our
    [Windows releases page][windows-releases].
1.  Locate the downloaded file on your local file system, and extract the files.
1.  In the extracted TimescaleDB directory, right-click the `setup.exe` file and
    select `Run as Administrator` to start the installer.

</procedure>

When you have completed the installation, you need to configure your database so
that you can use it. The easiest way to do this is to run the `timescaledb-tune`
script, which is included with the `timescaledb-tools` package. For more
information, see the [configuration][config] section.


[ms-download]: https://www.microsoft.com/en-us/download/details.aspx?id=48145
[pg-download]: https://www.postgresql.org/download/windows/
[windows-releases]: https://timescalereleases.blob.core.windows.net/windows/timescaledb-postgresql-14_2.5.0-windows-amd64.zip
[config]: /how-to-guides/configuration/
