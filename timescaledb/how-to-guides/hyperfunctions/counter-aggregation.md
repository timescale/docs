# Counter aggregation
There are two primary types of metrics that can be recorded in a database:
gauges, and counters. Gauges fluctuate up and down, like temperature or speed,
while counters always increase, like the total number of miles travelled in a
vehicle.

Counter data usually resets to zero if there is an interruption. Counter
aggregation functions are used to continue accumulating the data and ignoring
any interruptions or resets.
