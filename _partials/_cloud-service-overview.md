import CloudIntro from "versionContent/_partials/_cloud-intro.mdx";
 

You use Timescale Console to create and manage `Ops` for your Timescale Cloud services, and securely manage
`Data` in your services.

![Timescle Console overview](https://assets.timescale.com/docs/images/console-overview.png)

<CloudIntro />

When you log into your [Timescale account][cloud-login], you see the
Project overview. Click a service to view run-time data and connection information. 
Click `Operations` to configure your service. 

![Select a query to edit](https://assets.timescale.com/docs/images/ops-mode-overview.png)

Each service hosts a single database managed for you by Timescale in the cloud. 
If you need more than one database, [create a new service][create-service].

Timescale Service Explorer provides a rich administrative dashboard for
understanding the state of your database instance. The Explorer gives you
insight into the performance of your database, giving you greater confidence and
control over your data.

The Explorer works like an operations center as you develop and run your
applications on Timescale. It gives you quick access to the key properties of
your database, like table sizes, schema definitions, and foreign key references,
as well as Timescale specific information, like information on your hypertables
and continuous aggregates.

You can see the Explorer in your Timescale account by navigating to
the `Services` section, clicking the service you want to explore, and selecting
the `Explorer` tab.


## Service users

By default, when you create a new service, a new `tsdbadmin` user is created.
This is the user that you use to connect to your new service.

<Highlight type="important">
The `tsdbadmin` user is the owner of the database, but is not a superuser. You
cannot access the `postgres` user. There is no superuser access to Timescale
Cloud databases.
</Highlight>

On Timescale services, the `tsdbadmin` user can create another user
with any other roles. For a complete list of roles available, see the
[PostgreSQL role attributes documentation][pg-roles-doc].

You cannot create multiple databases on a single Timescale
service. If you need data isolation, use schemas or create additional services.


## General information

In the `General information` section of the Explorer, you can see a high-level
summary of your Timescale database, including all your hypertables and
relational tables. It summarizes your overall compression ratios, and other
policy and continuous aggregate data. And, if you aren't already using key
features like Timescale's native compression, continuous aggregates, or other
automation policies and actions, it provides pointers to tutorials and
documentation to help you get started.

<img class="main-content__illustration"
width={1375} height={944}
src="https://assets.timescale.com/docs/images/tsc-explorer.webp"
alt="Timescale Explorer, General Information section"/>

## Tables

In the `Tables` section of the Explorer, you can see a detailed look into all
your tables, including information about table schemas, table indexes, and
foreign keys. For your hypertables, it shows details about chunks, continuous
aggregates, and policies such as data retention policies and data reordering.
You can also inspect individual hypertables, including their sizes, dimension
ranges, and compression status.

You can also set a compression policy from this section. For more information,
see the
[compression section][set-compression].

<img
class="main-content__illustration"
width={1375} height={944}
src="https://assets.timescale.com/docs/images/tsc-explorer-tables.webp"
alt="Timescale Explorer, Tables section"
/>

For more information about hypertables, see the
[hypertables section][hypertables].

## Continuous aggregates

In the `Continuous aggregate` section, you can see all your continuous
aggregates, including top-level information such as their size, whether they are
configured for real-time aggregation, and their refresh periods.

<img
class="main-content__illustration"
width={1375} height={944}
src="https://assets.timescale.com/docs/images/tsc-explorer-caggs.webp"
alt="Timescale Explorer, Continuous aggregates section"
/>

For more information about continuous aggregates, see the
[continuous aggregates section][caggs].

[caggs]: /use-timescale/:currentVersion:/continuous-aggregates/
[set-compression]: /use-timescale/:currentVersion:/compression/
[hypertables]: /use-timescale/:currentVersion:/hypertables/


[cloud-login]: https://console.cloud.timescale.com/
[pg-roles-doc]: https://www.postgresql.org/docs/current/role-attributes.html
[create-service]: /getting-started/:currentVersion:/services/#create-a-timescale-cloud-service

