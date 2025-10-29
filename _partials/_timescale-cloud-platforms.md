import SupportMatrix from "versionContent/_partials/_migrate_self_postgres_timescaledb_compatibility.mdx";
import LinuxSupport from "versionContent/_partials/_timescaledb_supported_linux.mdx";
import WindowsSupport from "versionContent/_partials/_timescaledb_supported_windows.mdx";
import MacosSupport from "versionContent/_partials/_timescaledb_supported_macos.mdx";

You use $COMPANY's open-source products to create your best app from the comfort of your own developer environment. 

See the [available services][available-services] and [supported systems][supported-systems].

### Available services

$COMPANY offers the following services for your self-hosted installations:

<table>
    <thead>
        <tr>
            <th>Service type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Self-hosted support</strong></td>
            <td><ul><li>24/7 support no matter where you are.</li><li>An experienced global ops and support team that 
            can build and manage Postgres at scale.</li></ul>
            Want to try it out? <a href="https://www.tigerdata.com/self-managed-support">See how we can help</a>.
            </td>
        </tr>
    </tbody>
</table>

### $PG, $TIMESCALE_DB support matrix

$TIMESCALE_DB and $TOOLKIT_LONG run on Postgres v10, v11, v12, v13, v14, v15, v16, v17, and v18. The latest versions support Postgres 15 and higher.

<SupportMatrix />

### Supported operating system

You can deploy $TIMESCALE_DB and $TOOLKIT_LONG on the following systems:

<Tabs label="Supported operating systems" persistKey="os">

<Tab title="Linux" label="linux">

<LinuxSupport />
    
</Tab>

<Tab title="Windows" label="windows">

<WindowsSupport />
    
</Tab>

<Tab title="MacOS" label="macos">

<MacosSupport />

</Tab>

</Tabs>

[available-services]: /about/:currentVersion:/supported-platforms/#available-services
[supported-systems]: /about/:currentVersion:/supported-platforms/#supported-systems
