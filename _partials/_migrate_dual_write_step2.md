## 2. Modify the application to write to the target database

How exactly to do this is dependent on the language that your application is
written in, and on how exactly your ingestion and application function. In the
simplest case, you simply execute two inserts in parallel. In the general case,
you will need to think about how to handle the failure to write to either the
source or target database, and what mechanism you want to or can build to
recover from such a failure.

You may also want to execute the same read queries on the source and target
database, in order to evaluate the correctness and performance of the results
which the queries deliver. Bear in mind that the new database will spend a
certain amount of time without all data being present, so you should expect
that the results are not the same for some period (potentially a number of
days).
