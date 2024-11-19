This variable hold the connection information for the target Timescale Cloud service.

In Terminal on the source machine, set the following:

```bash
export TARGET=postgres://tsdbadmin:<PASSWORD>@<HOST>:<PORT>/tsdb?sslmode=require
```
You find the connection information for your Timescale Cloud service in the configuration file you
downloaded when you created the service.
