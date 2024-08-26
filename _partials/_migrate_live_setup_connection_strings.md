These variables hold the connection information for the source database and target Timescale Cloud service.
In Terminal on your migration machine, set the following:

```bash
export SOURCE=postgres://<user>:<password>@<source host>:<source port>/<db_name>
export TARGET=postgres://tsdbadmin:<PASSWORD>@<HOST>:<PORT>/tsdb?sslmode=require
```
You find the connection information for your Timescale Cloud service in the configuration file you
downloaded when you created the service.