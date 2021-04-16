# Data Retention 

An intrinsic part of time-series data is that new data is accumulated
and old data is rarely, if ever, updated and the relevance of the data
diminishes over time.  It is therefore often desirable to delete old
data to save disk space.

The following how-to's demonstrate how to drop old data and set automatic
policies so that TimescaleDB maintains the data for you.