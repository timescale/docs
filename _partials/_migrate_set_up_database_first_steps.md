1. **Take the applications that connect to the source database offline**

   The duration of the migration is proportional to the amount of data stored in your database. By
   disconnection your app from your database you avoid and possible data loss.

1. **Set your connection strings**

   These variables hold the connection information for the source database and target Timescale Cloud service:

   ```bash
   export SOURCE=postgres://<user>:<password>@<source host>:<source port>/<db_name>
   export TARGET=postgres://tsdbadmin:<PASSWORD>@<HOST>:<PORT>/tsdb?sslmode=require
   ```
   You find the connection information for your Timescale Cloud Service in the configuration file you
   downloaded when you created the service.
