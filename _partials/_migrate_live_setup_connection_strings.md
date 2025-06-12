These variables hold the connection information for the source database and target $SERVICE_LONG.
In Terminal on your migration machine, set the following:

```bash
export SOURCE="postgres://<user>:<password>@<source host>:<source port>/<db_name>"
export TARGET="postgres://tsdbadmin:<PASSWORD>@<HOST>:<PORT>/tsdb?sslmode=require"
```
You find the connection information for your $SERVICE_LONG in the configuration file you
downloaded when you created the service.

<Highlight type="important">
Avoid using connection strings that route through connection poolers like PgBouncer or similar tools. This tool requires a direct connection to the database to function properly.
</Highlight>


