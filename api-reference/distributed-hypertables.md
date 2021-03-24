# Distributed Hypertables <tag type="community">Community</tag>

Distributed hypertables are an extention of regular hypertables, available when
using a [multi-node installation][getting-started-multi-node] of TimescaleDB. 
Distributed hypertables provide the ability to store data chunks across multiple 
data nodes for better scale-out performance.

Most management APIs used with regular hypertable chunks also work with distributed
hypertables as documented in this section. You will also find a number of new APIs 
specifically dealing with data nodes and a special API for executing SQL commands 
on data nodes.


[getting-started-multi-node]: /timescaledb/:currentVersion:/how-to-guides/multi-node-setup
