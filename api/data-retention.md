# Data Retention <tag type="community">Community</tag>

An intrinsic part of time-series data is that new data is accumulated
and old data is rarely, if ever, updated and the relevance of the data
diminishes over time. It is therefore often desirable to delete old
data to save disk space.

With TimescaleDB, you can manually remove old chunks of data or implement 
policies using the following APIs.
