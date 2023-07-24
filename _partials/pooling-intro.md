You can scale your Timescale connections and improve your database performance
using connection poolers. Timescale uses pgBouncer for connection pooling.

Connection pooling rapidly opens and closes connections, while the pooler
maintains a set of long-running connections to the database. This improves
performance because the pooler allows the application to open many short-lived
connections, while the database opens few, long-lived connections.
