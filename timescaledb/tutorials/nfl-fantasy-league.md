# Win your NFL fantasy league with TimescaleDB

This tutorial is a step-by-step guide on how to ingest and analyze american football data with TimescaleDB.

The dataset that we're using is provided by the National Football League (NFL) and contains data about 
all the passing plays of the 2018 NFL season. We're going to ingest this dataset with Python into TimescaleDB 
and start exploring it to discover interesting things about players that could help you win your next fantasy season. 
If you aren't an NFL fan, don't worry, you will still find this tutorial helpful as it's showcasing how to 
get started with TimescaleDB and explore a real world dataset with SQL and Python.


1. [Create tables][]
2. [Ingest data from CSV files][] 
3. [Analyze NFL data][]
   
## Prerequisites

* Python 3
* TimescaleDB (see [installation options][install-timescale]) 
* [Psql][psql-install] or any other PostgreSQL client (e.g. DBeaver)
* Pandas and Matplotlib (`pip install pandas matplotlib`)

## Download the dataset

Download dataset here!

## Create tables

You will need to create four tables:

* game
  
  Information about each game.
* player
  
  Player information.
* play
  
  Play information
* tracking
  
  Tracking information from each play.

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

Now that you have all the data ingested, let's go over some ideas on how you can analyze the data to help you perfect
your fantasy drafting strategy and win your fantasy season.

To analyze the dataset you need to install two libraries, if you haven't already: Pandas and Matplotlib.

### Install pandas and matplotlib
```bash
pip install pandas matplotlib 
```

1. Number of yards run in game for passing plays, by player and game 
1. Avg yards run for a player over a game
1. Average and median yards run per game by type of player (not taking avg of individual)
1. Num of snap plays by player where they were on the offense
1. [Number of plays vs points scored](number-of-players-vs-points-scored)
1. [Average yards per game for top three players of each position](#average-yards-per-game-for-top-three-players-of-each-position)

### **Number of plays vs points scored**

Use this query to get data on the number of plays and final score for each game during the 2018 season. This data is separated by team so that we can compare the number of plays with a team's win or loss.

```sql
WITH play_count AS (
-- Count distinct plays, join on the stadium and game tables for team names and game date
SELECT gameid, COUNT(playdescription) AS plays, si.team_name, g.game_date 
FROM play p 
LEFT JOIN stadium_info si ON p.possessionteam = si.team_abbreviation 
LEFT JOIN game g ON p.gameid = g.game_id 
GROUP BY gameid, si.team_name, game_date
), visiting_games AS (
-- Join on scores to grab only the visting team's data
SELECT gameid, plays, s.visitor_team AS team_name, s.visitor_score AS team_score FROM play_count p
INNER JOIN scores s ON p.team_name LIKE '%' || s.visitor_team || '%' 
AND p.game_date = s."date"
), home_games AS (
-- Join on scores to grab only the home team's data
SELECT gameid, plays, s.home_team AS team_name , s.home_score AS team_score FROM play_count p
INNER JOIN scores s ON p.team_name LIKE '%' || s.home_team || '%' 
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
	SELECT t.player_id, SUM(t.dis) AS yards, t.gameid
	FROM tracking t 
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