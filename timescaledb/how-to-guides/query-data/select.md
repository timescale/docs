## SELECT Commands [](select)

Data can be queried from a hypertable using the standard `SELECT` SQL command
([PostgreSQL docs][postgres-select]), including with arbitrary `WHERE` clauses,
`GROUP BY` and `ORDER BY` commands, joins, subqueries, window functions,
user-defined functions (UDFs), `HAVING` clauses, and so on.

From basic queries:

```sql
-- Return the most recent 100 entries in the table 'conditions' ordered newest to oldest
SELECT * FROM conditions ORDER BY time DESC LIMIT 100;

-- Return the number of data entries written in past 12 hours
SELECT COUNT(*) FROM conditions
  WHERE time > NOW() - INTERVAL '12 hours';
```
To more advanced SQL queries:

```sql
-- Information about each 15-min period for each location
-- over the past 3 hours, ordered by time and temperature
SELECT time_bucket('15 minutes', time) AS fifteen_min,
    location, COUNT(*),
    MAX(temperature) AS max_temp,
    MAX(humidity) AS max_hum
  FROM conditions
  WHERE time > NOW() - INTERVAL '3 hours'
  GROUP BY fifteen_min, location
  ORDER BY fifteen_min DESC, max_temp DESC;


-- How many distinct locations with air conditioning
-- have reported data in the past day
SELECT COUNT(DISTINCT location) FROM conditions
  JOIN locations
    ON conditions.location = locations.location
  WHERE locations.air_conditioning = True
    AND time > NOW() - INTERVAL '1 day'
```


[postgres-select]: https://www.postgresql.org/docs/current/static/sql-select.html