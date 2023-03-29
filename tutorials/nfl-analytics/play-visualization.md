---
title: Visualize pre-snap positions and player movement
excerpt: Create a visualization of a football play using matplotlib
products: [cloud, mst, self_hosted]
keywords: [continuous aggregates, hyperfunctions, analytics, pandas, matplotlib]
---

# Visualize pre-snap positions and player movement

Interestingly, the NFL data set includes data on player movement within each
football play. Visualizing the changes in your time-series data can often provide
even more insight. In this section, we use `pandas` and `matplotlib` to
visually depict a play during the season.

## Install pandas and matplotlib

```bash
pip install pandas matplotlib
```

## Draw football field

```python
def generate_field():
    """Generates a realistic american football field with line numbers and hash marks.

    Returns:
        [tuple]: (figure, axis)
    """
    rect = patches.Rectangle((0, 0), 120, 53.3, linewidth=2,
                             edgecolor='black', facecolor='green', zorder=0)

    fig, ax = plt.subplots(1, figsize=(12, 6.33))
    ax.add_patch(rect)

    # line numbers
    plt.plot([10, 10, 20, 20, 30, 30, 40, 40, 50, 50, 60, 60, 70, 70, 80,
              80, 90, 90, 100, 100, 110, 110, 120, 0, 0, 120, 120],
             [0, 53.3, 53.3, 0, 0, 53.3, 53.3, 0, 0, 53.3, 53.3, 0, 0, 53.3,
              53.3, 0, 0, 53.3, 53.3, 0, 0, 53.3, 53.3, 53.3, 0, 0, 53.3],
             color='white')
    for x in range(20, 110, 10):
        numb = x
        if x > 50:
            numb = 120-x
        plt.text(x, 5, str(numb - 10), horizontalalignment='center', fontsize=20, color='white')
        plt.text(x-0.95, 53.3-5, str(numb-10),
                 horizontalalignment='center', fontsize=20, color='white',rotation=180)

    # hash marks
    for x in range(11, 110):
        ax.plot([x, x], [0.4, 0.7], color='white')
        ax.plot([x, x], [53.0, 52.5], color='white')
        ax.plot([x, x], [22.91, 23.57], color='white')
        ax.plot([x, x], [29.73, 30.39], color='white')

    # set limits and hide axis
    plt.xlim(0, 120)
    plt.ylim(-5, 58.3)
    plt.axis('off')

    return fig, ax
```

## Draw players' movement based on `game_id` and `play_id`

```python
conn = psycopg2.connect(database="db",
                        host="host",
                        user="user",
                        password="pass",
                        port="111")

def draw_play(game_id, play_id, home_label='position', away_label='position', movements=False):
    """Generates a chart to visualize player pre-snap positions and
      movements during the given play.

    Args:
        game_id (int)
        play_id (int)
        home_label (str, optional): Default is 'position' but can be 'displayname'
          or other column name available in the table.
        away_label (str, optional): Default is 'position' but can be 'displayname'
          or other column name available in the table.
        movements (bool, optional): If False, only draws the pre-snap positions.
          If True, draws the movements as well.
    """
    # query all tracking data for the given play
    sql = "SELECT * FROM tracking WHERE gameid={game} AND playid={play} AND team='home'"\
    .format(game=game_id, play=play_id)
    home_team = pd.read_sql(sql, conn)

    sql = "SELECT * FROM tracking WHERE gameid={game} AND playid={play} AND team='away'"\
    .format(game=game_id, play=play_id)
    away_team = pd.read_sql(sql, conn)

    # generate the football field
    fig, ax = generate_field()

    # query pre_snap player positions
    home_pre_snap = home_team.query('event == "ball_snap"')
    away_pre_snap = away_team.query('event == "ball_snap"')

    # visualize pre-snap positions with scatter plot
    home_pre_snap.plot.scatter(x='x', y='y', ax=ax, color='yellow', s=35, zorder=3)
    away_pre_snap.plot.scatter(x='x', y='y', ax=ax, color='blue', s=35, zorder=3)

    # annotate the figure with the players' position or name
    # (depending on the *label* parameter's value)
    home_positions = home_pre_snap[home_label].tolist()
    away_positions = away_pre_snap[away_label].tolist()
    for i, pos in enumerate(home_positions):
        ax.annotate(pos, (home_pre_snap['x'].tolist()[i], home_pre_snap['y'].tolist()[i]))
    for i, pos in enumerate(away_positions):
        ax.annotate(pos, (away_pre_snap['x'].tolist()[i], away_pre_snap['y'].tolist()[i]))

    if movements:
        # visualize player movements for home team
        home_players = home_team['player_id'].unique().tolist()
        for player_id in home_players:
            df = home_team.query('player_id == {id}'.format(id=player_id))
            df.plot(x='x', y='y', ax=ax, linewidth=4, legend=False)

        # visualize player movements for away team
        away_players = away_team['player_id'].unique().tolist()
        for player_id in away_players:
            df = away_team.query('player_id == {id}'.format(id=player_id))
            df.plot(x='x', y='y', ax=ax, linewidth=4, legend=False)

    # query play description and possession team and add them in the title
    sql = """SELECT gameid, playid, playdescription, possessionteam FROM play
             WHERE gameid = {game} AND playid = {play}""".format(game=game_id, play=play_id)
    play_info = pd.read_sql(sql, conn).to_dict('records')
    plt.title('Possession team: {team}\nPlay: {play}'.format(team=play_info[0]['possessionteam'],
    play=play_info[0]['playdescription']))
    # show chart
    plt.show()
```

Then, you can run the `draw_play` function like this to visualize pre-snap
player positions:

```python
draw_play(game_id=2018112900,
          play_id=2826,
          movements=False)
```

![pre snap players figure](https://assets.timescale.com/docs/images/tutorials/nfl_tutorial/player_movement_pre_snap.png)

You can also visualize player movement during the play if you set `movements`
to `True`:

```python
draw_play(game_id=2018112900,
          play_id=2826,
          home_label='position',
          away_label='displayname',
          movements=True)
```

![player movement figure](https://assets.timescale.com/docs/images/tutorials/nfl_tutorial/player_movement.png)

## Conclusion

We hope that through this tutorial you have been able to see how data that does
not appear to be time-series initially, is in fact time-series data after all.
With TimescaleDB, analyzing time-series data can be easy (and fun!) when you use
[hyperfunctions][api-hyperfunctions] and
[continuous aggregates][api-caggs]. We encourage you to
try these functions in your own database and try experimenting with different
kinds of analysis.

[api-hyperfunctions]: /api/:currentVersion:/hyperfunctions/
[api-caggs]: /api/:currentVersion:/continuous-aggregates/create_materialized_view/
