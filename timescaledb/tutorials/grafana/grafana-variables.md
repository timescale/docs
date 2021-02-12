# Using Grafana Variables

Grafana variables enable end-users of your dashboards to filter and customize visualizations.

### Pre-requisites

To complete this tutorial, you will need a cursory knowledge of the Structured Query 
Language (SQL). The tutorial will walk you through each SQL command, but it will be 
helpful if you've seen SQL before.

* To start, [install TimescaleDB][install-timescale].
* Next [setup Grafana][install-grafana].

Once your installation of TimescaleDB and Grafana are complete, ingest the data found 
in the [Hello, Timescale!][hello-timescale] tutorial and configure Grafana to connect
to that database. Be sure to follow the full tutorial if you’re interested in background 
on how to use TimescaleDB.

### Creating a variable
Our goal here will be to create a variable which controls the type of ride displayed in the
visual, based on the payment type used for the ride.

There are several types of payments, which we can see in the `payment_types` table:

```
 payment_type | description
--------------+-------------
            1 | credit card
            2 | cash
            3 | no charge
            4 | dispute
            5 | unknown
            6 | voided trip
(6 rows)
```

Grafana includes many types of variables, and variables in Grafana function just like
variables in programming languages. We define a variable, and then we can reference it
in our queries.

#### Define a new Grafana variable
To create a new variable, go to your Grafana dashboard settings, navigate to the 'Variable'
option in the side-menu, and then click the 'Add variable' button.

In this case, we use the 'Query' type, where our variable will be defined as the results
of SQL query.

Under the 'General' section, we’ll name our variable `payment_type` and give it a type of `Query`.
Then, we’ll assign it the label of “Payment Type", which is how it will appear in a drop-down menu.

We will select our data source and supply the query:

```sql
SELECT payment_type FROM payment_types;
```

Turn on 'Multi-value' and 'Include All option'. This will enable users of your dashboard to
select more than one payment type. Our configuration should look like this:

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/grafana_define_variable.png" alt="Using a variable to filter the results in a Grafana visualization"/>

Click 'Add' to save your variable.

#### Use the variable in a Grafana panel

Let's edit the WorldMap panel we created in the 
[Grafana geo-spatial queries][tutorial-grafana-geospatial] tutorial. The first thing you'll
notice is that now that we've defined a variable for this dashboard, there's now a drop-down
for that variable in the upper left hand corner of the panel.

We can use this variable to filter the results of our query using the `WHERE` clause in SQL.
We will check and see if `rides.payment_type` is in the array of the variable, which we've
named `$payment_type`.

Let's modify our earlier query like so:

```sql
SELECT time_bucket('5m', rides.pickup_datetime) AS time,
       rides.trip_distance AS value,
       rides.pickup_latitude AS latitude,
       rides.pickup_longitude AS longitude
FROM rides
WHERE $__timeFilter(rides.pickup_datetime) AND
  ST_Distance(pickup_geom,
              ST_Transform(ST_SetSRID(ST_MakePoint(-73.9851,40.7589),4326),2163)
  ) < 2000 AND
  rides.payment_type IN ($payment_type)
GROUP BY time,
         rides.trip_distance,
         rides.pickup_latitude,
         rides.pickup_longitude
ORDER BY time
LIMIT 500;
```

Now we can use the drop-down to filter our rides based on the type of payment used:

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/grafana_worldmap_query_with_variable.png" alt="Visualizing time series data in PostgreSQL using the Grafana Worldmap and filtering using a variable"/>

#### Building dynamic panels using Grafana variables

We've seen how you can use a Grafana variable in a query. You can also use a
Grafana variable to build dynamic panels. In our case, we've enabled people to
select data based on the `payment_type` used for a taxi ride. We can also
automatically create a graph panel for **each** of the payment types
selected so that we can see those queries side-by-side.

Let's first create a new graph panel that uses the `$payment_type` variable.
This will be our query:

```sql
SELECT 
  --1--
  time_bucket('5m', pickup_datetime) AS time,
  --2--
  COUNT(*)
FROM rides
WHERE $__timeFilter(pickup_datetime)
AND rides.payment_type IN ($payment_type)
GROUP BY time
ORDER BY time
```

Now, let's make this panel dynamic so that we have a separate panel for each
variable that is checked in the drop-down. Start by changing the title of
the panel to include the variable name. Go to the panel's 'General' tab and
change the 'Title' to the following:

```bash
{$payment_type} Taxi Rides
```

In the 'Repeating' section, select the variable you want to generate dynamic
panels based on. In this case, `payment_type`. You can have your dynamic panels
generate vertically or horizontally. In our case we will opt for repeating
panels, 2 per row, horizontally:

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/grafana_create_dynamic_panels.png" alt="Create a dynamic panel in Grafana"/>

Save and refresh your dashboard. Select some payment types using the drop-down.
Your dashboard should look something like this:

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/grafana_dynamic_panels.png" alt="Dynamic panels in Grafana"/>

#### Improving the Grafana filter to be human readable

But our filter isn't very attractive. We can't tell what '1' means. Fortunately,
when we set up our NYC Taxi Cab dataset, we created a `payment_types` table (which
we queried earlier). The `payment_types.description` field has a more readable
explanation of what each payment code means, for example, 'credit card', 'cash',
and so on. Those readable descriptions are what we want in our drop-down.

Click 'Dashboard settings' (the "gear" icon in the upper-right of your Grafana
visualizations). Select the 'Variables' tab on the left, and click the `$payment_types`
variable. Modify your query to retrieve the `description` and store it in the `__text`
field and retrieve the `payment_type` and store it in the `__value` field, like so:

```sql
SELECT description AS "__text", payment_type AS "__value" FROM payment_types
```

Your configuration should look like this now:

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/grafana_modify_variable.png" alt="Modify our grafana variable to be more human readable"/>

There's no need to alter the query for the WorldMap visualization itself.
Whatever database column is assigned as `__text` is used whenever the variable
is displayed and whatever is assigned to `__value` is used as the actual value
when Grafana makes a query.

As you can see, a variable can be used in a query in much the same way you'd
use a variable in any programming language.

#### Building dynamic panels using Grafana variables

We've seen how you can use a Grafana variable in a query. You can also use a
Grafana variable to build dynamic panels, where panels are created automatically
based on the values selected for a variable. In our case, we've enabled people to
select data based on the `payment_type` used for a taxi ride. We want to 
automatically create a graph panel for **each** of the payment types
selected so that we can see those queries side-by-side.

Let's first create a new graph panel that uses the `$payment_type` variable.
This will be our query:

```sql
SELECT 
  --1--
  time_bucket('5m', pickup_datetime) AS time,
  --2--
  COUNT(*)
FROM rides
WHERE $__timeFilter(pickup_datetime)
AND rides.payment_type IN ($payment_type)
GROUP BY time
ORDER BY time
```

Now, let's make this panel dynamic so that we have a separate panel for each
variable that is checked in the drop-down. Start by changing the title of
the panel to include the variable name. Go to the panel's 'General' tab and
change the 'Title' to the following:

```bash
{$payment_type} Taxi Rides
```

In the 'Repeating' section, select the variable you want to generate dynamic
panels based on. In this case, `payment_type`. You can have your dynamic panels
generate vertically or horizontally. In our case we will opt for repeating
panels, 2 per row, horizontally:

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/grafana_create_dynamic_panels.png" alt="Create a dynamic panel in Grafana"/>

Save and refresh your dashboard. Select some payment types using the drop-down.
Your dashboard should look something like this:

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/grafana_dynamic_panels.png" alt="Dynamic panels in Grafana"/>

### Summary

Complete your Grafana knowledge by following [all the TimescaleDB + Grafana tutorials][tutorial-grafana].

[install-timescale]: /getting-started/installation
[install-grafana]: /getting-started/installation-grafana
[hello-timescale]: /tutorials/tutorial-hello-timescale
[tutorial-grafana]: /tutorials/tutorial-grafana
[tutorial-grafana-geospatial]: /tutorials/tutorial-grafana-geospatial