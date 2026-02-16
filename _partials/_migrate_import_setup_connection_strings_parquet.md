This variable holds the connection information for the target $SERVICE_LONG. 

In the terminal on the source machine, set the following:

```bash
export TARGET=postgres://tsdbadmin:<PASSWORD>@<HOST>:<PORT>/tsdb?sslmode=require
```
See where to [find your connection details][connection-info].

[connection-info]: /integrations/:currentVersion:/find-connection-details/
