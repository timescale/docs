# Win your NFL fantasy league with TimescaleDB

This tutorial is a step-by-step guide on how to ingest and analyze american football data with TimescaleDB.

The dataset that we're using is provided by the National Football League (NFL) and contains data about 
all the passing plays of the 2018 NFL season. We're going to ingest this dataset with Python into TimescaleDB 
and start exploring it to discover interesting things about players that could help you win your next fantasy season. 
If you aren't an NFL fan, don't worry, you will still find this tutorial helpful as it's showcasing how to 
get started with TimescaleDB and explore a real world dataset with SQL and Python.


1. [Create tables](#create-tables)
2. [Ingest data from CSV files](#ingest-data-from-csv-files) 
3. [Analyze NFL data](#analyze-nfl-data)
   
## Prerequisites

* Python 3
* TimescaleDB (see [installation options][install-timescale]) 
* [Psql][psql-install] or any other PostgreSQL client (e.g. DBeaver)
* Pandas and Matplotlib (`pip install pandas matplotlib`)

## Download the dataset

Download dataset here!

## Create tables

You will need to create six tables:

* game
  
  Information about each game.

* player
  
  Player information.
* play
  
  Play information
* tracking
  
  Tracking information from each play.

* scores

  Team scores for each game. 
* stadium_info

  Stadium information for each team. 

```sql
CREATE TABLE game (
    gameId INT PRIMARY KEY,
    gameDate DATE,
    gameTimeEastern TIME,
    homeTeamAbbr VARCHAR(3),
    visitorTeamAbbr VARCHAR(3),
    week INT
);

CREATE TABLE player (
    nflId INT,
    height TEXT,
    weight INT,
    birthDate DATE,
    collegeName TEXT,
    position TEXT,
    displayName TEXT
);

CREATE TABLE play (
    gameId INT,
    playId INT,
    playDescription TEXT,
    quarter INT,
    down INT,
    yardsToGo INT,
    possessionTeam TEXT,
    playType TEXT,
    yardlineSide TEXT,
    yardlineNumber INT,
    offenseFormation TEXT,
    personnelO TEXT,
    defendersInTheBox INT,
    numberOfPassRushers INT,
    personnelD TEXT,
    typeDropback TEXT,
    preSnapVisitorScore INT,
    preSnapHomeScore INT,
    gameClock TIME,
    absoluteYardlineNumber INT,
    penaltyCodes TEXT,
    penaltyJerseyNumber TEXT,
    passResult TEXT,
    offensePlayResult INT,
    playResult INT,
    epa DOUBLE PRECISION,
    isDefensivePI BOOLEAN
);

CREATE TABLE tracking (
    time TIMESTAMP,
    x DOUBLE PRECISION,
    y DOUBLE PRECISION,
    s DOUBLE PRECISION,
    a DOUBLE PRECISION,
    dis DOUBLE PRECISION,
    o DOUBLE PRECISION,
    dir DOUBLE PRECISION,
    event TEXT,
    nflId INT,
    displayName TEXT,
    jerseyNumber INT,
    position TEXT,
    frameId INT,
    team TEXT,
    gameId INT,
    playId INT,
    playDirection VARCHAR(5),
    route TEXT
);

CREATE TABLE scores (
    scoreid INT PRIMARY KEY,
    date DATE,
    visitor_team VARCHAR(150),
    visitor_team_abb VARCHAR(3),
    visitor_score INT,
    home_team VARCHAR(150),
    home_team_abb VARCHAR(3),
    home_score INT
);

CREATE TABLE stadium_info(
    stadiumid INT PRIMARY KEY,
    stadium_name VARCHAR(150),
    location VARCHAR(150),
    surface VARCHAR(150),
    roof_type VARCHAR(150),
    team_name VARCHAR(150),
    team_abbreviation VARCHAR(3),
    time_zone TEXT
)

```

Add indexes to the `tracking` table speed up queries:

```sql
CREATE INDEX idx_gameid ON tracking (gameid);
CREATE INDEX idx_playerid ON tracking (player_id);
CREATE INDEX idx_playid ON tracking (playid);
```

## Ingest data from CSV files

We have three separate CSV files for game, player, and play tables. For the tracking table, you will need to
import data from 17 CSV files (1 file for each week in the season).

Let's use a Python script that utilizes psycopg2's `copy_expert` function to ingest the data:

```python
import config
import psycopg2

# connect to the database
conn = psycopg2.connect(database=config.DB_NAME, 
                        host=config.HOST, 
                        user=config.USER, 
                        password=config.PASS, 
                        port=config.PORT)

# insert CSV file into given table
def insert(csv_file, table_name):
    cur = conn.cursor()
    copy_sql = """
            COPY {table} FROM stdin WITH CSV HEADER
            DELIMITER as ','
            """.format(table=table_name)
    with open(csv_file, 'r') as f:
        cur.copy_expert(sql=copy_sql, file=f)
        conn.commit()
        cur.close()

print("Inserting games.csv")
insert("data/games.csv", "game")

print("Inserting plays.csv")
insert("data/plays.csv", "play")

print("Inserting players.csv")
insert("data/players.csv", "player")

# iterate over each week's CSV file and insert
for i in range(1, 18): 
    print("Inserting week{i}".format(str(i)))
    insert("data/week{i}.csv".format(i=i), "tracking")

conn.close()
```

## Analyze NFL data

Now that you have all the data ingested, let's go over some ideas on how you can analyze the data using PostgreSQL and TimescaleDB to help you perfect
your fantasy drafting strategy and win your fantasy season.

Some of this analysis includes visualizations to help you see the potential uses for this data. These are created using the Matplotlib Python module, which is one of many great visualization tools. 

To optimize the analysis, you will need to create a continuous aggregate. Continuous aggregate's significantly cut down on query run time, running up to thirty times faster. This continuous aggregate sums all the players movement in yards over one day and groups them by the players ID and game ID. 

```sql
CREATE MATERIALIZED VIEW player_yards_by_game
WITH (timescaledb.continuous) AS
SELECT t.player_id, t.gameid, 
	time_bucket(INTERVAL '1 day', t."time") AS bucket,
	SUM(t.dis) AS yards
FROM tracking t 
GROUP BY t.player_id, t.gameid, bucket;
```

1. [Number of yards run in game for passing plays, by player and game](#number-of-yards-run-in-game-for-passing-plays-by-player-and-game)
1. [Average yards run for a player over a game](#average-yards-run-for-a-player-over-a-game)
1. [Average and median yards run per game by type of player (not taking avg of individual)](#average-and-median-yards-run-per-game-by-type-of-player-not-taking-avg-of-individual)
1. [Number of snap plays by player where they were on the offense](#number-of-snap-plays-by-player-where-they-were-on-the-offense)
1. [Number of plays vs points scored](#number-of-plays-vs-points-scored)
1. [Average yards per game for top three players of each position](#average-yards-per-game-for-top-three-players-of-each-position)

### **Number of yards run in game for passing plays, by player and game**

Use this query to get the yard data from the continuous aggregate. You can then join that on the player table to get player details.

```sql
SELECT a.player_id, display_name, SUM(yards) AS yards, gameid 
FROM player_yards_by_game a
LEFT JOIN player p ON a.player_id = p.player_id 
GROUP BY a.player_id, display_name, gameid 
ORDER BY gameid ASC, display_name
```
Your data should look like this:

|player_id| display_name | yards | gameid  |
|-----| ------------- |:-------------:| -----:|
|2555415| Austin Hooper     | 765.52 | 2018090600 |
|2556445| Brian Poole    | 661.74     |   2018090600 |
|2560854| Calvin Ridley | 822.3     |    2018090600 |

This query can be the foundation of many other analysis questions. This section returns to the query for further analysis.  

### **Average yards run for a player over a game**

This query uses one of the TimescaleDB percentile functions to find the mean yards run per game by a single player. 

```sql
WITH sum_yards AS (
  SELECT a.player_id, display_name, SUM(yards) AS yards, gameid 
  FROM player_yards_by_game a
  LEFT JOIN player p ON a.player_id = p.player_id 
  GROUP BY a.player_id, display_name, gameid 
)
SELECT player_id, display_name, mean(percentile_agg(yards)) as yards
FROM sum_yards
GROUP BY player_id, display_name
ORDER BY yards DESC
```
When you run this query you might notice that the `player_id` and `display_name` are null for the first row. This row represents the avereage yard data for the football. 

### **Average and median yards run per game by type of player (not taking avg of individual)**

  For this query, you will use another one of the TimescaleDB percentile functions called `percentile_agg`. You will set the `percentile_agg` function to find the 50th percentile which will return the approximate median.

```sql
WITH sum_yards AS (
--Add position to the table to allow for grouping by it later
  SELECT a.player_id, display_name, SUM(yards) AS yards, p.position, gameid 
  FROM player_yards_by_game a
  LEFT JOIN player p ON a.player_id = p.player_id 
  GROUP BY a.player_id, display_name, p.position, gameid 
)
--Find the mean and median for each position type
SELECT position, mean(percentile_agg(yards)) AS mean_yards, approx_percentile(0.5, percentile_agg(yards)) AS median_yards
FROM sum_yards
GROUP BY position
ORDER BY mean_yards DESC
```
If you scroll to the bottom of your results you should see this:

|position| mean_yards        | median_yards  |
|-----| ------------- |:----------------:|
|HB| 275.04279069767404    | 250.88667462709043 |
|DE| 185.76162011173133   | 33.750683636185684 |
|FB| 100.37912844036691 | 67.0876116670915 |
|DT| 19.692499999999992  | 17.796475991050432 |

Notice how the Defensive End (DE) position has such a large discrepency between the mean and median values. The median data implies that generally most DE players do not run very much during passing plays. However, the mean data shows that some of the DE players must be running a lot. Who could those players be?

### **Number of snap plays by player where they were on the offense**

In this query, you are counting the number of passing events a player was involved in while playing the offensive. You will notice how much slower this query runs than the ones above which use continuous aggregates. The speed you see here is comparable to what you would get in the other queries without using continuous aggregates.

```sql
WITH snap_events AS (
-- Create a table that filters the play events to show only snap plays
-- and display the players team information
	SELECT DISTINCT player_id, t.event, t.gameid, t.playid,
		CASE 
			WHEN t.team = 'away' THEN g.visitor_team 
			WHEN t.team = 'home' THEN g.home_team 
			ELSE NULL 
			END AS team_name
	FROM tracking t 
	LEFT JOIN game g ON t.gameid = g.game_id 
	WHERE t.event LIKE '%snap%'
)
-- Count these events and filter results to only display data when the player was
-- on the offensive
SELECT a.player_id, pl.display_name, COUNT(a.event) AS play_count, a.team_name
FROM snap_events a
LEFT JOIN play p ON a.gameid = p.gameid AND a.playid = p.playid 
LEFT JOIN player pl ON a.player_id = pl.player_id 
WHERE a.team_name = p.possessionteam 
GROUP BY a.player_id, pl.display_name, a.team_name
ORDER BY play_count DESC
```

Notice that the two highest passing plays are for Ben Roethlisberger and JuJu Smith-Schuster, a Quarterback and Wide Receiver respectively for the Pittsburgh Steelers. These may be two great options to consider when drafting your fantasy football leauge. 

### **Number of plays vs points scored**

Use this query to get data on the number of plays and final score for each game during the 2018 season. This data is separated by team so that we can compare the number of plays with a team's win or loss.

```sql
WITH play_count AS (
-- Count distinct plays, join on the stadium and game tables for team names and game date
SELECT gameid, COUNT(playdescription) AS plays, p.possessionteam as team_name, g.game_date 
FROM play p 
LEFT JOIN game g ON p.gameid = g.game_id 
GROUP BY gameid, team_name, game_date
), visiting_games AS (
-- Join on scores to grab only the visting team's data
SELECT gameid, plays, s.visitor_team as team_name, s.visitor_score AS team_score FROM play_count p
INNER JOIN scores s ON p.team_name = s.visitor_team_abb 
AND p.game_date = s."date"
), home_games AS (
-- Join on scores to grab only the home team's data
SELECT gameid, plays, s.home_team AS team_name , s.home_score AS team_score FROM play_count p
INNER JOIN scores s ON p.team_name = s.home_team_abb 
AND p.game_date = s."date"
)
-- union the two resulting tables together
SELECT * FROM visiting_games
UNION ALL
SELECT * FROM home_games
ORDER BY gameid ASC, team_score DESC
```
The image below is an example of a visualization that you could create with the data collected from this query. The scatterplot is grouped, showing the winning team's plays and scores as gold, and the losing team's plays and scores as brown. 

<img class="main-content__illustration" src="" alt="Top Three Players by Position"/>

The y-axis, or the number of plays for one team during a single game shows that more plays do not always imply a guaranteed win. In fact, the top three teams with the highest number of plays for a single game all appeared to have lost. There are many interesting facts which you could glean from this query, this scatterplot being just one possibility. 

### **Average yards per game for top three players of each position**

You can use this PostgreSQL query to extract the average yards run by an individual player over one game. This query will only include the top three highest player's average yard values per position type. The data is ordered by the average yards run across all players for each position. This becomes important later on. 

Note: This query excludes some position types from the list due to such low average yard values, the excluded positions are Kicker, Punter, Nose Tackle, Long Snapper, and Defensive Tackle 

```sql
WITH total_yards AS (
-- This table sums the yards a player runs over each game
	SELECT t.player_id, SUM(yards) AS yards, t.gameid
	FROM player_yards_by_game t
	GROUP BY t.player_id, t.gameid
), avg_yards AS (
-- This table takes the average of the yards run by each player and calls out thier position
	SELECT p.player_id, p.display_name, AVG(yards) AS avg_yards, p."position" 
	FROM total_yards t
	LEFT JOIN player p ON t.player_id = p.player_id 
	GROUP BY p.player_id, p.display_name, p."position"
), ranked_vals AS (
-- This table ranks each player by the average yards they run per game 
SELECT a.*, RANK() OVER (PARTITION BY a."position" ORDER BY avg_yards DESC) 
FROM avg_yards AS a
), ranked_positions AS (
-- This table takes the average of the average yards run for each player so that we can order
-- the positions by this average of averages
SELECT v."position", AVG(v.avg_yards) AS avg_yards_positions
FROM ranked_vals v
GROUP BY v."position"
)
SELECT v.*, p.avg_yards_positions FROM ranked_vals v
LEFT JOIN ranked_positions p ON v.position = p.position
WHERE v.rank <= 3 AND v.position != 'null' AND v.position NOT IN ('K', 'P', 'NT', 'LS', 'DT')
ORDER BY p.avg_yards_positions DESC, v.rank ASC
```

This is one possible visualization that you could create with this data:

<img class="main-content__illustration" src="" alt="Top Three Players by Position"/>

Notice that the average yards overall for Free Safety players is higher than that of Wide Receivers (this is because of how we ordered the data, noted above). However, individual Wide Receivers run more yards on average per game. Also, notice that Kyle Juszczyk runs far more on average than other Fullback players. 

(todo include queries and viz)


## Resources

* Github project repository
* NFL Big Data Bowl on Kaggle
* 