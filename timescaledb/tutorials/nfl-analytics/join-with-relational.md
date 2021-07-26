## Join time-series data with relational data for deeper analysis

TimescaleDB is packaged as a PostgreSQL extension. As such, TimescaleDB is
PostgreSQL with super-powers. You can do anything in TimescaleDB that you can 
in PostgreSQL, including joining tables and combining data for further analysis.

First you will need to create the following continuous aggregate. 
```sql
CREATE MATERIALIZED VIEW player_acc_by_game
WITH (timescaledb.continuous) AS
SELECT t.player_id, t.gameid, t.team, 
	time_bucket(INTERVAL '1 day', t."time") AS bucket,
	avg(t.a) AS acc
FROM tracking t 
GROUP BY t.player_id, t.gameid, t.team, bucket;
```

### The Mile-High advantage

In professional football, it's a well-understood phenomenon that teams that
visit Denver's Mile-High stadium are at a disadvantage because unlike the home team
(the Denver Broncos), they are not accustomed to playing in high altitude.

Earlier we ingested stadium data. Now we can run a query to see the performance of
players at each position when they are playing at Mile High Stadium.

Use this query to compare the average acceleration and yards run of individual players when they are performing in stadiums outside of Denver versus when they are playing in Denver. The columns `avg_acc_den` and `avg_yards_den` represent the acceleration and yard statistics while in Denver.  

```sql
WITH sum_yards AS (
-- This table collects the summed yard data of a player during one game
  SELECT a.player_id, display_name, SUM(yards) AS yards, gameid 
  FROM player_yards_by_game a
  LEFT JOIN player p ON a.player_id = p.player_id 
  GROUP BY a.player_id, display_name, gameid 
), acceleration AS (
-- This table gets the average acceleration for a player over each game
	SELECT a.player_id, avg(acc) AS acc, a.gameid, a.team
	FROM player_acc_by_game a
	GROUP BY a.player_id, a.gameid, a.team
), team_data AS (
-- This table gets us the team information so that we can filter on teams
	SELECT a.player_id, acc, yards, a.gameid,
		CASE 
			WHEN a.team = 'away' THEN g.visitor_team 
			WHEN a.team = 'home' THEN g.home_team 
			ELSE NULL 
			END AS team_name,
		g.home_team
	FROM acceleration a
	LEFT JOIN game g ON a.gameid = g.game_id 
	LEFT JOIN sum_yards y ON a.player_id = y.player_id AND a.gameid = y.gameid
), avg_stats AS (
-- This table takes the avg acceleration and yards run for players when they are not in denver
-- and then when they are in denver
SELECT p.player_id, p.display_name, 
	AVG(acc) FILTER (WHERE team_name != 'DEN' AND home_team !='DEN') AS avg_acc, 
	AVG(acc) FILTER (WHERE team_name != 'DEN' AND home_team = 'DEN') AS avg_acc_den,
	AVG(yards) FILTER (WHERE team_name != 'DEN' AND home_team !='DEN') AS avg_yards, 
	AVG(yards) FILTER (WHERE team_name != 'DEN' AND home_team = 'DEN') AS avg_yards_den
FROM team_data t
LEFT JOIN player p ON t.player_id = p.player_id 
GROUP BY p.player_id, p.display_name
)
SELECT * FROM avg_stats
WHERE avg_acc IS NOT NULL AND avg_acc_den IS NOT NULL
ORDER BY avg_acc DESC, avg_acc_den DESC
```

You can see that generally, many players have worse acceleration and average number of yards run per game while playing in Denver. 

### Grass vs. turf, the eternal (football) question

Players often say they "feel" faster on artifical turf. How much faster are they
in reality?

Using this query you will extract the average acceleration that a player has while using turf verses grass. The column `avg_acc_turf` represents the players average acceleration while using artificial turf, and `avg_acc_grass` represents their average acceleration while on grass. 

```sql
WITH acceleration AS (
-- This table gets the average acceleration for a player over each game
	SELECT a.player_id, avg(acc) AS acc, a.gameid, a.team
	FROM player_acc_by_game a
	GROUP BY a.player_id, a.gameid, a.team
), team_data AS (
-- This table gets us the surface information so that we can filter on turf type
	SELECT a.player_id, acc, g.game_id,	si."location", si.surface 
	FROM acceleration a
	LEFT JOIN game g ON a.gameid = g.game_id 
	LEFT JOIN stadium_info si on g.home_team = si.team_abbreviation 
), avg_stats AS (
-- This table takes the avg acceleration and yards run for players when they are not in denver
-- and then when they are in denver
SELECT p.player_id, p.display_name, 
	AVG(acc) FILTER (WHERE surface LIKE '%Turf%') AS avg_acc_turf, 
	AVG(acc) FILTER (WHERE surface NOT LIKE '%Turf%') AS avg_acc_grass
FROM team_data t
LEFT JOIN player p ON t.player_id = p.player_id 
GROUP BY p.player_id, p.display_name
)
SELECT * FROM avg_stats
WHERE avg_acc_turf IS NOT NULL AND avg_acc_grass IS NOT NULL AND player_id IS NOT NULL
ORDER BY avg_acc_turf DESC, avg_acc_grass DESC
```

For many players, it appears that they are indeed faster on artificial turf. This 'feeling' of increased speed may in fact be grounded in reality. 
### We're going to overtime!

Sometimes it's helpful to visualize time-series data in order to fully understand
how a system is performing. The NFL dataset includes play-by-play data. It is possible 
to visualize this information so that you can see how a play unfolds.
