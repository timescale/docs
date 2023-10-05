Once you've validated that all the data is present, and that the target
database can handle the production workload, the final step is to switch to the
target database as your primary. You may want to continue writing to the source
database for a period, until you are certain that the target database is
holding up to all production traffic.
