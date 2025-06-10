This variable holds the connection information for the target $CLOUD_LONG service.

In Terminal on the source machine, set the following:

```bash
export TARGET=postgres://tsdbadmin:<PASSWORD>@<HOST>:<PORT>/tsdb?sslmode=require
```
You find the connection information for your $CLOUD_LONG service in the configuration file you
downloaded when you created the service.
