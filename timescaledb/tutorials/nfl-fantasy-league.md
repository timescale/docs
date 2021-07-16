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
* Pandas, Matplotlib, and Numpy (`pip install pandas matplotlib numpy`)

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

To analyze the dataset you will need to install two libraries, if you haven't already: Pandas, Matplotlib, and Numpy.

### Install pandas, matplotlib, and numpy
```bash
pip install pandas matplotlib numpy
```

1. Number of yards run in game for passing plays, by player and game 
1. Avg yards run for a player over a game
1. Average and median yards run per game by type of player (not taking avg of individual)
1. Num of snap plays by player where they were on the offense
1. [Number of plays vs points scored](number-of-players-vs-points-scored)
1. [Average yards per game for top 3 players of each position](#average-yards-per-game-for-top-3-players-of-each-position)

### **Number of plays vs points scored**

We will be using the following query to get data on the number of plays and final score for each game during the 2018 season. This data will be separated by team so that we can compare the number of plays with a team's win or loss.

```sql
with play_count as (
-- Count distinct plays, join on the stadium and game tables for team names and game date
select gameid, count(playdescription) as plays, si.team_name, g.game_date 
from play p 
left join stadium_info si on p.possessionteam = si.team_abbreviation 
left join game g on p.gameid = g.game_id 
group by gameid, si.team_name, game_date
), visiting_games as (
-- Join on scores to grab only the visting team's data
select gameid, plays, s.visitor_team as team_name, s.visitor_score as team_score from play_count p
inner join scores s on p.team_name like '%' || s.visitor_team || '%' 
and p.game_date = s."date"
), home_games as (
-- Join on scores to grab only the home team's data
select gameid, plays, s.home_team as team_name , s.home_score as team_score from play_count p
inner join scores s on p.team_name like '%' || s.home_team || '%' 
and p.game_date = s."date"
)
-- union the two resulting tables together
select * from visiting_games
union all
select * from home_games
order by gameid asc, team_score desc
```
With the python script below, we will use our query above to create a scatterplot displaying each team's outcome for every game in the season. The scatterplot will be grouped, showing the winning team's plays and scores as gold, and the losing team's plays and scores as brown. 

```python
# Import needed python modules
import psycopg2
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Define the connection string, you will have to update this string for your database
CONNECTION = "dbname=tsdb user=tsdbadmin password={PASSWORD} host={HOST} port={PORT} sslmode=require"

# Define the Postgres query 
query = 'with play_count as ( '\
    'select gameid, count(playdescription) as plays, si.team_name, g.game_date  '\
    'from play p  '\
    'left join stadium_info si on p.possessionteam = si.team_abbreviation  '\
    'left join game g on p.gameid = g.game_id  '\
    'group by gameid, si.team_name, game_date '\
    '), visiting_games as ( '\
    'select gameid, plays, s.visitor_team as team_name, s.visitor_score as team_score from play_count p '\
    'inner join scores s on p.team_name like \'%\' || s.visitor_team || \'%\'  '\
    'and p.game_date = s."date" '\
    '), home_games as ( '\
    'select gameid, plays, s.home_team as team_name , s.home_score as team_score from play_count p '\
    'inner join scores s on p.team_name like \'%\' || s.home_team || \'%\'  '\
    'and p.game_date = s."date" '\
    ') '\
    'select * from visiting_games '\
    'union all '\
    'select * from home_games '\
    'order by gameid asc, team_score desc'


# Import data into a pandas Dataframe from the database using a cursor
with psycopg2.connect(CONNECTION) as conn:
        cursor = conn.cursor()
        cursor.execute(query)
        data = cursor.fetchall()
        df = pd.DataFrame(data, columns=['gameid', 'plays', 'team_name', 'team_score'])
        cursor.close()

# Add column to Dataframe to identify winning and losing team
a = [1, 0]
b = a*253
df.insert(4, "win_bin", b)

# Define font object for title of graph
font = {'weight': 'heavy',
        'size': 16,
        }

# Create a scatterplot of the team's scores vs number of plays
fig, ax = plt.subplots()

# Split up the data so that wins and loses can be identifyed by color
scat1 = ax.scatter( x=df['team_score'].loc[df['win_bin'] == 1], y=df['plays'].loc[df['win_bin'] == 1], color='gold', label='Win')
scat2 = ax.scatter( x=df['team_score'].loc[df['win_bin'] == 0], y=df['plays'].loc[df['win_bin'] == 0], color='rosybrown', label='Loss')

# Specify label and tick information
ax.set_ylabel('Team\'s Number of Plays for One Game')
ax.set_xlabel('Team\'s Score for One Game')
ax.set_title('Outcome of Game Given Scores and Plays ', fontdict=font, pad=20)
ax.legend(handles=[scat1, scat2], loc='upper right')

# Define figure dimensions
fig.set_figheight(6)
fig.set_figwidth(8)
fig.tight_layout()

plt.show()
```

Your graph should look like this...

<img class="main-content__illustration" src="" alt="Top Three Players by Position"/>

Let's look at the y-axis, or the number of plays for one team during a single game, it appears that more plays do not always imply a guaranteed win. In fact, the top three teams with the highest number of plays for a single game all appeared to have lost. There are many interesting facts which you could glean from this query, this scatterplot being just one possibility. 

### **Average yards per game for top 3 players of each position**

We will be using the following Postgres query to extract the average yards run by an individual player over one game. This query will only include the top three highest player's average yard values per position type. The data is ordered by the average yards run across all players for each position, later on we will see why this is significant. 

Note: This query excludes some position types from the list due to such low average yard values, the excluded positions are Kicker, Punter, Nose Tackle, Long Snapper, and Defensive Tackle 

```sql
with total_yards as (
-- This table sums the yards a player runs over each game
	SELECT t.player_id, SUM(t.dis) AS yards, t.gameid
	FROM tracking t 
	GROUP BY t.player_id, t.gameid
), avg_yards as (
-- This table takes the average of the yards run by each player and calls out thier position
	select p.player_id, p.display_name, avg(yards) as avg_yards, p."position" 
	FROM total_yards t
	LEFT JOIN player p ON t.player_id = p.player_id 
	group by p.player_id, p.display_name, p."position"
), ranked_vals as (
-- This table ranks each player by the average yards they run per game 
select a.*, rank() over (partition by a."position" order by avg_yards desc) 
from avg_yards as a
), ranked_positions as (
-- This table takes the average of the average yards run for each player so that we can order
-- the positions by this average of averages
select v."position", avg(v.avg_yards) as avg_yards_positions
from ranked_vals v
group by v."position"
)
select v.*, p.avg_yards_positions from ranked_vals v
left join ranked_positions p on v.position = p.position
where v.rank <= 3 and v.position != 'null' and v.position not in ('K', 'P', 'NT', 'LS', 'DT')
order by p.avg_yards_positions desc, v.rank asc
```

Now that we have a query ready, we can pull the data into python and create some visualizations! Use the following script to create a grouped bar chart of our top three players average yard performance by position. 

```python
# Import needed python modules
import psycopg2
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Define the connection string, you will have to update this string for your database
CONNECTION = "dbname=tsdb user=tsdbadmin password={PASSWORD} host={HOST} port={PORT} sslmode=require"

# Define the Postgres query 
query = 'with total_yards as ( '\
    '	SELECT t.player_id, SUM(t.dis) AS yards, t.gameid '\
    '	FROM tracking t '\
    '	GROUP BY t.player_id, t.gameid '\
    '), avg_yards as ( '\
    '	select p.player_id, p.display_name, avg(yards) as avg_yards, p."position"  '\
    '	FROM total_yards t '\
    '	LEFT JOIN player p ON t.player_id = p.player_id  '\
    '	group by p.player_id, p.display_name, p."position" '\
    '), ranked_vals as ( '\
    'select a.*, rank() over (partition by a."position" order by avg_yards desc) '\
    'from avg_yards as a '\
    '), ranked_positions as ( '\
    'select v."position", avg(v.avg_yards) as avg_yards_positions '\
    'from ranked_vals v '\
    'group by v."position" '\
    ') '\
    'select v.*, p.avg_yards_positions from ranked_vals v '\
    'left join ranked_positions p on v.position = p.position '\
    'where v.rank <= 3 and v.position != \'null\' and v.position not in (\'K\', \'P\', \'NT\', \'LS\', \'DT\') '\
    'order by p.avg_yards_positions desc, v.rank asc '

# Import data into a pandas Dataframe from the database using a cursor
with psycopg2.connect(CONNECTION) as conn:
        cursor = conn.cursor()
        cursor.execute(query)
        data = cursor.fetchall()
        df = pd.DataFrame(data, columns=['player_id', 'displayname', 'avg_yards', 'position', 'rank', 'avg_yards_positions'])
        cursor.close()


# Create labels, ticks, and define font information
labels = ['Free Safety','Strong Safety','Corner Back','Wide Receiver','Safety','Middle Linebacker','Inside Linebacker','Outside Linebacker','Tight End','Quarter Back','Linebacker','Defense Back','Running Back','Halfback','Fullback','Defense End']
x = np.arange(len(labels))
yticks = range(1,1700, 100)
font = {'weight': 'heavy',
        'size': 16,
        }

# Create matplotlib grouped barchart
fig, ax = plt.subplots()

# Define three different sets of bars for each rank level
bar1 = ax.bar(x - .3, df['avg_yards'].loc[df['rank'] == 1], .3, color='royalblue')
bar2 = ax.bar(x, df['avg_yards'].loc[df['rank'] == 2], 0.3 , color='cornflowerblue')
bar3 = ax.bar(x + .3, df['avg_yards'].loc[df['rank'] == 3], 0.3 , color='lightsteelblue')

# Specify label and tick information
ax.set_ylabel('Average Yards Run')
ax.set_xlabel('Player\'s Position, Ordered by the Average Yards Run of All Players for Each Position', labelpad=20)
ax.set_title('Top Three Average Yards Run by Players During One Game, Separated by Position', fontdict=font, pad=20)
ax.set_xticks(x)
ax.set_yticks(yticks)
ax.set_xticklabels(labels, rotation=45)

# Set up bars to display the players name 
ax.bar_label(container=bar1 ,labels=df['displayname'].loc[df['rank'] == 1], padding=3, rotation=90)
ax.bar_label(container=bar2 ,labels=df['displayname'].loc[df['rank'] == 2], padding=3, rotation=90)
ax.bar_label(container=bar3 ,labels=df['displayname'].loc[df['rank'] == 3], padding=3, rotation=90)

# Define figure dimensions
fig.set_figheight(8)
fig.set_figwidth(14)
fig.tight_layout()

plt.show()
```

Your graph should look like this...

<img class="main-content__illustration" src="" alt="Top Three Players by Position"/>

Coming back to the statement earlier, notice that the average yards overall Free Safety players is higher than that of Wide Receivers (This is because of how we ordered the data, noted above). However, individual Wide Receivers run more yards on average per game. Also, notice that Kyle Juszczyk runs far more on average than other Fullback players. 

(todo include queries and viz)


## Resources

* Github project repository
* NFL Big Data Bowl on Kaggle
* 