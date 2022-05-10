# Alter and drop distributed hypertables
You can alter and drop distributed hypertables in the same way as regular
hypertables. To lean more, see:
*   [Altering hypertables][alter]
*   [Dropping hypertables][drop]

<highlight type="note">
When you alter a distributed hypertable, or set privileges on it, the commands
are automatically applied across all data nodes. For more information, see the
section on [multi-node
administration](/timescaledb/latest/how-to-guides/multinode-timescaledb/multinode-administration/).
</highlight>

[alter]: /how-to-guides/hypertables/alter/
[drop]: /how-to-guides/hypertables/drop/
