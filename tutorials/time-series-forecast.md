---
title: Time-series forecasting
excerpt: Predict likely future values of a dataset based on historical data
products: [cloud, mst, self_hosted]
keywords: [forecast, analytics]
---

# Time-series forecasting

Time-series forecasting enables us to predict likely
future values for a dataset based on historical time-series
data. Time-series data collectively represents how a system,
process, or behavior changes over time. When you accumulate
millions of data points over a time period, you can build models
to predict the next set of values likely to occur.

Time-series predictions can be used to:

*   Forecast cloud infrastructure expenses next quarter
*   Forecast the value of a given stock in the future
*   Forecast the number of units of a product likely to be sold next quarter
*   Forecast the remaining lifespan of an IoT device
*   Forecast the number of taxi or ride share drivers necessary for a big holiday evening

Time-series forecasting alone is a powerful tool. But time-series
data joined with business data can be a competitive advantage for
any developer. TimescaleDB is PostgreSQL for time-series data and
as such, time-series data stored in TimescaleDB can be easily
joined with business data in another relational database in order
to develop an even more insightful forecast into how your data
(and business) changes over time.

This time-series forecasting example demonstrates how to integrate
TimescaleDB with R, Apache MADlib, and Python to perform various time-series
forecasting methods. It uses New York City taxicab data that is also
used in the [Hello Timescale Tutorial][hello_timescale]. The dataset contains
information about all yellow cab trips in New York City in January 2016,
including pickup and dropoff times, GPS coordinates, and total price of a trip.
You can extract some interesting insights from this rich dataset, build a
time-series forecasting model, and explore the use of various forecasting
and machine learning tools.

### Setting up

Prerequisites:

*   [Installed TimescaleDB][install]
*   Downloaded and loaded dataset from [Hello Timescale Tutorial][hello_timescale]
*   [Installed and set up PostGIS in database][tutorial-postgis]
*   [Installed R][install_r]
*   [Installed Python][install_python]

First, let's create the schema and populate the tables. Download the file
[`forecast.sql`][forecast-sql] and execute the following command:

```bash
psql -U postgres -d tsdb -h localhost -f forecast.sql
```

The `forecast.sql` file contains SQL statements that create three
TimescaleDB hypertables `rides_count`, `rides_length` and `rides_price`.
Let's look at how to create the `rides_count` table as an example.
Here is a portion of the code taken from `forecast.sql`:

```sql
CREATE TABLE rides_count(
  one_hour TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  count NUMERIC
);
SELECT create_hypertable('rides_count', 'one_hour');

INSERT INTO rides_count
  SELECT time_bucket_gapfill('1 hour', pickup_datetime, '2016-01-01 00:00:00','2016-01-31 23:59:59') AS one_hour,
    COUNT(*) AS count
  FROM rides
  WHERE ST_Distance(pickup_geom, ST_Transform(ST_SetSRID(ST_MakePoint(-74.0113,40.7075),4326),2163)) < 400
    AND pickup_datetime < '2016-02-01'
  GROUP BY one_hour
  ORDER BY one_hour;
```

Notice that you have made the `rides_count` table a TimescaleDB hypertable.
This allows you to take advantage of TimescaleDB's faster insert and query
performance with time-series data. Here, you can see how PostgreSQL aggregate
functions such as `COUNT` and various PostGIS functions all work as usual
with TimescaleDB. You can use PostGIS to select data points from the original
`rides` table where the pickup location is less than 400m from the GPS location
(40.7589, -73.9851), which is Times Square.

The data comes from the [NYC Taxi and Limousine Commission][NYCTLC]. It is
missing data points for certain hours. You can gapfill the missing values with
0. To learn more, see the [gap filling][gap_filling] documentation. A similar
method is used to create `rides_length` and `rides_price`.

Before you move onto the next few sections, check that the following tables
are in your database.

```sql
\dt
             List of relations
 Schema |      Name       | Type  |  Owner
--------+-----------------+-------+----------
 public | payment_types   | table | postgres
 public | rates           | table | postgres
 public | rides           | table | postgres
 public | rides_count     | table | postgres
 public | rides_length    | table | postgres
 public | rides_price     | table | postgres
 public | spatial_ref_sys | table | postgres

(7 rows)
```

### Seasonal ARIMA with R

The [ARIMA (Autoregressive Integrated Moving Average) model][arima] is a
tool that is often used in time-series analysis to better understand a
dataset and make predictions on future values. The ARIMA model can be
broadly categorized as seasonal and non-seasonal. Seasonal ARIMA models
are used for datasets that have characteristics that repeat over fixed
periods of time. For example, a dataset of hourly temperature values over
a week has a seasonal component with a period of 1 day, since the temperature
goes up during the day and down over night every day. In contrast, the price
of Bitcoin over time is (probably) non-seasonal since there is no clear
observable pattern that recurs in fixed time periods.

This tutorial uses R to analyze the seasonality of the number of taxicab pickups
at Times Square over a week.

The table `rides_count` contains the data needed for this section of the tutorial.
`rides_count` has two columns `one_hour` and `count`. The `one_hour` column is
a TimescaleDB `time_bucket` for every hour from January 1 to January 31.
The `count` column is the number of pickups from Times Square during each hourly period.

```sql
SELECT * FROM rides_count;
      one_hour       | count
---------------------+-------
 2016-01-01 00:00:00 |   176
 2016-01-01 01:00:00 |   218
 2016-01-01 02:00:00 |   221
 2016-01-01 03:00:00 |   344
 2016-01-01 04:00:00 |   397
 2016-01-01 05:00:00 |   269
 2016-01-01 06:00:00 |   192
 2016-01-01 07:00:00 |   145
 2016-01-01 08:00:00 |   166
 2016-01-01 09:00:00 |   233
 2016-01-01 10:00:00 |   295
 2016-01-01 11:00:00 |   440
 2016-01-01 12:00:00 |   472
 2016-01-01 13:00:00 |   472
 2016-01-01 14:00:00 |   485
 2016-01-01 15:00:00 |   538
 2016-01-01 16:00:00 |   430
 2016-01-01 17:00:00 |   451
 2016-01-01 18:00:00 |   496
 2016-01-01 19:00:00 |   538
 2016-01-01 20:00:00 |   485
 2016-01-01 21:00:00 |   619
 2016-01-01 22:00:00 |  1197
 2016-01-01 23:00:00 |   798
 ...
```

Create two PostgreSQL views, `rides_count_train` and `rides_count_test`  for
the training and testing datasets.

```sql
-- Make the training dataset
CREATE VIEW rides_count_train AS
SELECT * FROM rides_count
WHERE one_hour <= '2016-01-21 23:59:59';

-- Make the testing dataset
CREATE VIEW rides_count_test AS
SELECT * FROM rides_count
WHERE one_hour >= '2016-01-22 00:00:00';
```

R has an [RPostgres][rpostgres] package which allows you to connect to your database from R.
The code below establishes a connection to the PostgreSQL database `nyc_data`.
You can connect to a different database simply by changing the parameters of
`dbConnect`. The final line of code should print out a list of all tables in
your database. This means that you have successfully connected and are ready
to query the database from R.

```r
# Install and load RPostgres package
install.packages("RPostgres")
library("DBI")

# creates a connection to the postgres database
con <- dbConnect(RPostgres::Postgres(), dbname = "nyc_data",
      host = "localhost",
      user = "postgres")

# list tables in database to verify connection
dbListTables(con)
```

You can query the database with SQL code inside R. Putting the query result
in an R data frame allows you to analyze the data using tools provided by R.

```r
# query the database and input the result into an R data frame
# training dataset with data 2016/01/01 - 2016/01/21
count_rides_train_query <- dbSendQuery(con, "SELECT * FROM rides_count_train;")
count_rides_train <- dbFetch(count_rides_train_query)
dbClearResult(count_rides_train_query)
head(count_rides_train)
             one_hour count
1 2016-01-01 00:00:00   176
2 2016-01-01 01:00:00   218
3 2016-01-01 02:00:00   221
4 2016-01-01 03:00:00   344
5 2016-01-01 04:00:00   397
6 2016-01-01 05:00:00   269

# testing dataset with data 2016/01/22 - 2016/01/31
count_rides_test_query <- dbSendQuery(con, "SELECT * FROM rides_count_test")
count_rides_test <- dbFetch(count_rides_test_query)
dbClearResult(count_rides_test_query)
head(count_rides_test)
             one_hour count
1 2016-01-22 00:00:00   702
2 2016-01-22 01:00:00   401
3 2016-01-22 02:00:00   247
4 2016-01-22 03:00:00   169
5 2016-01-22 04:00:00   140
6 2016-01-22 05:00:00   100
```

In order to feed the data into an ARIMA model, you must first convert the
data frame into a time-series object in R. [`xts`][r-xts] is a package that allows
you to do this easily. You can also set the frequency of the time-series object
to 168. This is because the number of pickups is expected to fluctuate with
a fixed pattern every week, and there are 168 hours in a week, or in other
words, 168 data points in each seasonal period. If you want to model
the data as having a seasonality of 1 day, you can change the frequency
parameter to 24.

```r
# Install and load xts package
install.packages("xts")
library("xts")

# convert the data frame into time-series
xts_count_rides <- xts(count_rides_train$count, order.by = as.POSIXct(count_rides_train$one_hour, format = "%Y-%m-%d %H:%M:%S"))

# set the frequency of series as weekly 24 * 7
attr(xts_count_rides, 'frequency') <- 168
```

The [`forecast`][r-forecast] package in R provides a useful function
`auto.arima`, which automatically finds the best ARIMA parameters for the
dataset. Set the parameter D, which captures the seasonality of the model,  to 1
to force the function to find a seasonal model. This calculation can take a
while to compute (in this dataset, around five minutes). Once the computation is
complete, you can save the output of the `auto.arima` function into `fit` and
get a summary of the ARIMA model that has been created.

```r
# Install and load the forecast package needed for ARIMA
install.packages("forecast")
library("forecast")

# use auto.arima to automatically get the arima model parameters with best fit
fit <- auto.arima(xts_count_rides[,1], D = 1, seasonal = TRUE)

# see the summary of the fit
summary(fit)
Series: xts_count_rides[, 1]
ARIMA(4,0,2)(0,1,0)[168] with drift

Coefficients:
         ar1      ar2     ar3     ar4      ma1     ma2   drift
      2.3211  -1.8758  0.3959  0.1001  -1.7643  0.9444  0.3561
s.e.  0.0634   0.1487  0.1460  0.0588   0.0361  0.0307  0.0705

sigma^2 estimated as 5193:  log likelihood=-1911.21
AIC=3838.42   AICc=3838.86   BIC=3868.95

Training set error measures:
                     ME     RMSE      MAE       MPE     MAPE      MASE
Training set -0.2800571 58.22306 33.15943 -1.783649 7.868031 0.4257707
                    ACF1
Training set -0.02641353
```

Finally, the ARIMA model can be used to forecast future values.
The `h` parameter specifies the number of steps to forecast.

```r
# forecast future values using the arima model, h specifies the number of readings to forecast
fcast <- forecast(fit, h=168)
fcast
         Point Forecast      Lo 80     Hi 80         Lo 95     Hi 95
4.000000       659.0645  566.71202  751.4169  517.82358229  800.3053
4.005952       430.7339  325.02891  536.4388  269.07209741  592.3956
4.011905       268.1259  157.28358  378.9682   98.60719504  437.6446
4.017857       228.3024  116.08381  340.5210   56.67886523  399.9260
4.023810       200.7340   88.25064  313.2174   28.70554423  372.7625
4.029762       140.5758   28.04128  253.1103  -31.53088134  312.6824
4.035714       196.1703   83.57555  308.7650   23.97150358  368.3690
4.041667       282.6171  169.80545  395.4288  110.08657346  455.1476
4.047619       446.6713  333.28115  560.0614  273.25604289  620.0865
4.053571       479.9449  365.53618  594.3537  304.97184340  654.9180
...
```

The output of `forecast` can be hard to decipher. You can plot the
forecasted values with the code below:

```r
# plot the values forecasted
plot(fcast, include = 168, main="Taxicab Pickup Count in Times Square by Time", xlab="Date", ylab="Pickup Count", xaxt="n", col="red", fcol="blue")
ticks <- seq(3, 5, 1/7)
dates <- seq(as.Date("2016-01-15"), as.Date("2016-01-29"), by="days")
dates <- format(dates, "%m-%d %H:%M")
axis(1, at=ticks, labels=dates)
legend('topleft', legend=c("Observed Value", "Predicted Value"), col=c("red", "blue"), lwd=c(2.5,2.5))

# plot the observed values from the testing dataset
count_rides_test$x <- seq(4, 4 + 239 * 1/168, 1/168)
count_rides_test <- subset(count_rides_test, count_rides_test$one_hour < as.POSIXct("2016-01-29"))
lines(count_rides_test$x, count_rides_test$count, col="red")
```

<img class="main-content__illustration" src="http://assets.iobeam.com/images/docs/rides_count.png" alt="Rides Count Graph" />

In the graphing of this data, the grey area around the prediction line in blue
is the prediction interval, or the uncertainty of the prediction, while the
red line is the actual observed pickup count. The number of pickups on Saturday
January 23 is zero because the data is missing for this period of time.

You might find that the prediction for January 22 matches impressively with the
observed values, but the prediction overestimates for the following days. It is
clear that the model has captured the seasonality of the data, as you can see
the forecasted values of the number of pickups drop dramatically overnight from
1&nbsp;AM, before rising again from around 6&nbsp;AM. There is a noticeable
increase in the number of pickups in the afternoon compared to the morning, with
a slight dip around lunchtime and a sharp peak around 6&nbsp;PM when presumably people
take cabs to return home after work.

While these findings do not reveal anything completely unexpected, it is still
valuable to have the analysis verify your expectations. It must be noted that the
ARIMA model is not perfect and this is evident from the anomalous prediction
made for January 25. The ARIMA model created uses the previous week's data to
make predictions. January 18 2016 was Martin Luther King day, and so the
distribution of ride pickups throughout the day is slightly different from that
of a standard Monday. Also, the holiday probably affected riders' behavior on
the surrounding days too. The model does not pick up such anomalous data that
arise from various holidays and this must be noted before reaching a conclusion.
Simply taking out such anomalous data, by only using the first two weeks of
January for example, may have led to a more accurate prediction. This
demonstrates the importance of understanding the context behind your data.

Although R offers a rich library of statistical models, it requires importing the
data into R before performing calculations. With a larger dataset, this can
become a bottleneck to marshal and transfer all the data to the R process (which
itself might run out of memory and start swapping). So, let's look into an
alternative method that allows you to move computations to the database and
improve this performance.

### Non-Seasonal ARIMA with Apache MADlib

[MADlib][madlib] is an open source library for in-database data analytics that
provides a wide collection of popular machine learning methods and various
supplementary statistical tools.

MADlib supports many machine learning algorithms that are available in R and
Python. And by executing these machine learning algorithms within the database,
it may be efficient enough to process them against an entire dataset rather than
pulling a much smaller sample to an external program.

Install MADlib following the steps outlined in their documentation:
[MADlib Installation Guide][madlib_install].

Set up MADlib in the `nyc_data` database:

```bash
/usr/local/madlib/bin/madpack -s madlib -p postgres -c postgres@localhost/nyc_data install
```

<Highlight type="warning">
This command might differ depending on the directory in which you installed
MADlib and the names of your PostgreSQL user, host and database.
</Highlight>

Now you can make use of MADlib's library to analyze the taxicab dataset. Here,
you can train an ARIMA model to predict the price of a ride from JFK to Times
Square at a given time.

Let's look at the `rides_price` table. The `trip_price` column is the
average price of a trip from JFK to Times Square during each hourly period. Data
points that are missing due to no rides being taken during a certain hourly
period are filled with the previous value. This is done by
[gap filling][gap_filling], mentioned earlier in this tutorial.

```sql
SELECT * FROM rides_price;
      one_hour       |    trip_price
---------------------+------------------
 2016-01-01 00:00:00 |            58.34
 2016-01-01 01:00:00 |            58.34
 2016-01-01 02:00:00 |            58.34
 2016-01-01 03:00:00 |            58.34
 2016-01-01 04:00:00 |            58.34
 2016-01-01 05:00:00 |            59.59
 2016-01-01 06:00:00 |            58.34
 2016-01-01 07:00:00 | 60.3833333333333
 2016-01-01 08:00:00 |          61.2575
 2016-01-01 09:00:00 |           58.435
 2016-01-01 10:00:00 |           63.952
 2016-01-01 11:00:00 | 59.9576923076923
 2016-01-01 12:00:00 |           60.462
 2016-01-01 13:00:00 |            61.65
 2016-01-01 14:00:00 |           58.342
 2016-01-01 15:00:00 |          59.8965
 2016-01-01 16:00:00 | 61.6468965517241
 2016-01-01 17:00:00 |           58.982
 2016-01-01 18:00:00 |         64.28875
 2016-01-01 19:00:00 | 60.8433333333333
 2016-01-01 20:00:00 |        61.888125
 2016-01-01 21:00:00 | 61.4064285714286
 2016-01-01 22:00:00 |  61.107619047619
 2016-01-01 23:00:00 | 57.9088888888889
```

You can also create two tables for the training and testing datasets.
You can create tables instead of views here because you need to add columns
to these datasets later in the time-series forecast analysis.

```sql
-- Make the training dataset
SELECT * INTO rides_price_train FROM rides_price
WHERE one_hour <= '2016-01-21 23:59:59';

-- Make the testing dataset
SELECT * INTO rides_price_test FROM rides_price
WHERE one_hour >= '2016-01-22 00:00:00';
```

Now you can use [MADlib's ARIMA][madlib_arima] library to make forecasts
on your dataset.

MADlib does not yet offer a method that automatically finds the best
parameters of the ARIMA model. So, the non-seasonal orders of the
ARIMA model are obtained by using R's `auto.arima` function in the same
way you obtained them in the previous section with seasonal ARIMA.
Here is the R code:

```r
# Connect to database and fetch records
library("DBI")
con <- dbConnect(RPostgres::Postgres(), dbname = "nyc_data",
      host = "localhost",
      user = "postgres")
rides_price_train_query <- dbSendQuery(con, "SELECT * FROM rides_price_train;")
rides_price_train <- dbFetch(rides_price_train_query)
dbClearResult(rides_price_train_query)

# convert the dataframe into a time-series
library("xts")
xts_rides_price <- xts(rides_price_train$trip_price, order.by = as.POSIXct(rides_price_train$one_hour, format = "%Y-%m-%d %H:%M:%S"))
attr(xts_rides_price, 'frequency') <- 168

# use auto.arima() to calculate the orders
library("forecast")
fit <- auto.arima(xts_rides_price[,1])

# see the summary of the fit
summary(fit)
Series: xts_rides_price[, 1]
ARIMA(2,1,3)

Coefficients:
         ar1      ar2      ma1     ma2      ma3
      0.3958  -0.5142  -1.1906  0.8263  -0.5791
s.e.  0.2312   0.1593   0.2202  0.2846   0.1130

sigma^2 estimated as 11.06:  log likelihood=-1316.8
AIC=2645.59   AICc=2645.76   BIC=2670.92

Training set error measures:
                    ME    RMSE      MAE         MPE    MAPE      MASE
Training set 0.1319955 3.30592 2.186295 -0.04371788 3.47929 0.6510487
                     ACF1
Training set -0.002262549
```

Of course, you can continue the analysis with R by following the same steps in
the previous seasonal ARIMA section. Unfortunately, MADlib does not yet offer a
way to automatically find the orders of the ARIMA model.

However with a larger dataset, you could take the approach of loading
a subset of the data to calculate the model's parameters in R and
then train the model using MADlib. You can use a combination of the
options outlined in this tutorial to take advantage of the strengths
and work around weaknesses of the different tools.

Using the parameters ARIMA(2,1,3) found using R, you can use MADlib's
`arima_train` and `arima_forecast` functions.

```sql
-- train arima model and forecast the price of a ride from JFK to Times Square
DROP TABLE IF EXISTS rides_price_output;
DROP TABLE IF EXISTS rides_price_output_residual;
DROP TABLE IF EXISTS rides_price_output_summary;
DROP TABLE IF EXISTS rides_price_forecast_output;

SELECT madlib.arima_train('rides_price_train', -- input table
      'rides_price_output', -- output table
      'one_hour', -- timestamp column
      'trip_price', -- time-series column
      NULL, -- grouping columns
      TRUE, -- include_mean
      ARRAY[2,1,3] -- non-seasonal orders
      );

SELECT madlib.arima_forecast('rides_price_output', -- model table
                        'rides_price_forecast_output', -- output table
                        240 -- steps_ahead (10 days)
                        );
```

Let's examine what values the trained ARIMA model forecasted for
the next day.

```sql
SELECT * FROM rides_price_forecast_output;
 steps_ahead | forecast_value
-------------+----------------
           1 |  62.3175746635
           2 |  62.7126520845
           3 |  62.8920386424
           4 |  62.7550446339
           5 |   62.606406819
           6 |  62.6197088842
           7 |  62.7032173055
           8 |  62.7292577943
           9 |  62.6956015822
          10 |  62.6685763075
...
```

The model seems to suggest that the price of a ride from JFK to
Times Square remains pretty much constant on a day-to-day basis.
MADlib also provides various statistical functions to evaluate the model.

```sql
ALTER TABLE rides_price_test ADD COLUMN id SERIAL PRIMARY KEY;
ALTER TABLE rides_price_test ADD COLUMN forecast DOUBLE PRECISION;

UPDATE rides_price_test
SET forecast = rides_price_forecast_output.forecast_value
FROM rides_price_forecast_output
WHERE rides_price_test.id = rides_price_forecast_output.steps_ahead;

SELECT madlib.mean_abs_perc_error('rides_price_test', 'rides_price_mean_abs_perc_error', 'trip_price', 'forecast');

SELECT * FROM rides_price_mean_abs_perc_error;
 mean_abs_perc_error
---------------------
  0.0423789161532639
(1 row)
```

Earlier, you had to set up the columns of the `rides_price_test` table to
fit the format of MADlib's `mean_abs_perc_error` function. There
are multiple ways to evaluate the quality of a model's forecast
values. In this case, you calculated the mean absolute percentage
error and got 4.24%.

What can you take away from this? The non-seasonal ARIMA model
predicts that the price of a trip from the airport to Manhattan
remains constant at $62 and performs well against the testing
dataset. Unlike some ride hailing apps such as Uber that have
surge pricing during rush hours, yellow taxicab prices stay
pretty much constant all day.

From a technical standpoint, you have seen how TimescaleDB integrates
seamlessly with other PostgreSQL extensions PostGIS and MADlib.
This means that TimescaleDB users can easily take advantage of
the vast PostgreSQL ecosystem.

### Holt-Winters with Python

The [Holt-Winters][holt-winters] model is another widely used tool in time-series
analysis and forecasting. It can only be used for seasonal time-series data.
The Holt-Winters model uses simple exponential smoothing to make
future predictions. So with time-series data, the forecast is
calculated from taking a weighted average of past values, with more
recent data points having greater weight than previous points.
Holt-Winters is considered to be simpler than ARIMA, but there is
no clear answer as to which time-series prediction model is superior
in time-series forecasting. It is advised to create both models for
a particular dataset and compare the performance to find out which is
more suitable.

You can use Python to analyze how long it takes from the Financial
District to Times Square at different time periods during the day.
You need to install these Python packages:

```bash
pip install psycopg2
pip install pandas
pip install numpy
pip install statsmodels
```

The format of the data is very similar to the previous two sections.
The `trip_length` column in the `rides_length` table is the average
length of a ride from the Financial District to Times Square in the
given time period.

```sql
SELECT * FROM rides_length;
     three_hour      |   trip_length
---------------------+-----------------
 2016-01-01 00:00:00 | 00:21:50.090909
 2016-01-01 03:00:00 | 00:17:15.8
 2016-01-01 06:00:00 | 00:13:21.666667
 2016-01-01 09:00:00 | 00:14:20.625
 2016-01-01 12:00:00 | 00:16:32.366667
 2016-01-01 15:00:00 | 00:19:16.921569
 2016-01-01 18:00:00 | 00:22:46.5
 2016-01-01 21:00:00 | 00:17:22.285714
 2016-01-02 00:00:00 | 00:19:24
 2016-01-02 03:00:00 | 00:19:24
 2016-01-02 06:00:00 | 00:12:13.5
 2016-01-02 09:00:00 | 00:17:17.785714
 2016-01-02 12:00:00 | 00:20:56.785714
 2016-01-02 15:00:00 | 00:24:41.730769
 2016-01-02 18:00:00 | 00:29:39.555556
 2016-01-02 21:00:00 | 00:20:09.6
...
```

You can also create two PostgreSQL views for the training
and testing datasets.

```sql
-- Make the training dataset
CREATE VIEW rides_length_train AS
SELECT * FROM rides_length
WHERE three_hour <= '2016-01-21 23:59:59';

-- Make the testing dataset
CREATE VIEW rides_length_test AS
SELECT * FROM rides_length
WHERE three_hour >= '2016-01-22 00:00:00';
```

Python has a [`psycopg2`][python-psycopg2] package that allows you to query the
database in Python:

```python
import psycopg2
import psycopg2.extras

# establish connection
conn = psycopg2.connect(dbname='nyc_data', user='postgres', host='localhost')

# cursor object allows querying of database
# server-side cursor is created to prevent records to be downloaded until explicitly fetched
cursor_train = conn.cursor('train', cursor_factory=psycopg2.extras.DictCursor)
cursor_test = conn.cursor('test', cursor_factory=psycopg2.extras.DictCursor)

# execute SQL query
cursor_train.execute('SELECT * FROM rides_length_train')
cursor_test.execute('SELECT * FROM rides_length_test')

# fetch records from database
ride_length_train = cursor_train.fetchall()
ride_length_test = cursor_test.fetchall()
```

You can now manipulate the data to feed it into the Holt-Winters model.

```python
import pandas as pd
import numpy as np

# make records into a pandas dataframe
ride_length_train = pd.DataFrame(np.array(ride_length_train), columns = ['time', 'trip_length'])
ride_length_test = pd.DataFrame(np.array(ride_length_test), columns = ['time', 'trip_length'])

# convert the type of columns of dataframe to datetime and timedelta
ride_length_train['time'] = pd.to_datetime(ride_length_train['time'], format = '%Y-%m-%d %H:%M:%S')
ride_length_test['time'] = pd.to_datetime(ride_length_test['time'], format = '%Y-%m-%d %H:%M:%S')
ride_length_train['trip_length'] = pd.to_timedelta(ride_length_train['trip_length'])
ride_length_test['trip_length'] = pd.to_timedelta(ride_length_test['trip_length'])

# set the index of dataframes to the timestamp
ride_length_train.set_index('time', inplace = True)
ride_length_test.set_index('time', inplace = True)

# convert trip_length into a numeric value in seconds
ride_length_train['trip_length'] = ride_length_train['trip_length']/np.timedelta64(1, 's')
ride_length_test['trip_length'] = ride_length_test['trip_length']/np.timedelta64(1, 's')
```

This data can now be used to train a Holt-Winters model that is imported from
the [`statsmodels`][python-statsmodels] package. You can expect the pattern to
repeat weekly, and therefore set the `seasonal_periods` parameter to 56 (there
are eight 3-hour periods in a day, seven days in a week). Since the seasonal
variations are likely to be fairly constant over time, you can use the additive
method rather than the multiplicative method, which is specified by the `trend`
and `seasonal` parameters.

```python
from statsmodels.tsa.api import ExponentialSmoothing
fit = ExponentialSmoothing(np.asarray(ride_length_train['trip_length']), seasonal_periods = 56, trend = 'add', seasonal = 'add').fit()
```

You use the model that has been trained to make a forecast and compare
with the testing dataset.

```python
ride_length_test['forecast'] = fit.forecast(len(ride_length_test))
```

Now `ride_length_test` has a column with the observed values and
predicted values from January 22 to January 31. You can plot
these values on top of each other to make a visual comparison:

```python
import matplotlib.pyplot as plt
plt.plot(ride_length_test)
plt.title('Taxicab Ride Length from Financial District to Times Square by Time')
plt.xlabel('Date')
plt.ylabel('Ride Length (seconds)')
plt.legend(['Observed', 'Predicted'])
plt.show()
```

<img class="main-content__illustration" src="http://assets.iobeam.com/images/docs/rides_length.png" alt="Rides Length Graph" />

The model predicts that the length of a trip from the Financial
District to Times Square fluctuates roughly between 16 minutes
and 38 minutes, with high points midday and low points overnight.
The trip length is notably longer during weekdays than it is
during weekends (January 23, 24, 30, 31).

The initial reaction from the plotted graph is that the model
does a relatively good job in capturing the overall trend, but at
times has quite a large margin of error. This can be due to the
inherent irregularity of Manhattan's traffic situation with
frequent roadblocks, accidents, and unexpected weather conditions.
Moreover, as it was the case with taxi pickup counts in your analysis
with R using the seasonal ARIMA model, the Holt-Winters model was
also thrown off by the anomalous data points on Martin Luther King
day on the previous Monday.

### Takeaways from analysis

This tutorial looked at different ways you can build statistical models to
analyze time-series data and how you can leverage the full power of the
PostgreSQL ecosystem with TimescaleDB. This tutorial also looked at integrating
TimescaleDB with R, Apache MADlib, and Python. You can simply choose the option
you are most familiar with from a vast number of choices that TimescaleDB
inherits from PostgreSQL. ARIMA and Holt-Winters are just a couple from a wide
variety of statistical models and machine learning algorithms that you can use
to analyze and make predictions on time-series data in your TimescaleDB
database.

[NYCTLC]: http://www.nyc.gov/html/tlc/html/about/trip_record_data.shtml
[arima]: https://en.wikipedia.org/wiki/Autoregressive_integrated_moving_average
[forecast-sql]: http://assets.iobeam.com/sql/forecast.sql
[gap_filling]: /use-timescale/:currentVersion:/query-data/advanced-analytic-queries/#gap-filling
[hello_timescale]: /tutorials/:currentVersion:/nyc-taxi-cab/
[holt-winters]: https://otexts.org/fpp2/holt-winters.html
[install]: /getting-started/latest/
[install_python]: https://www.python.org/downloads/
[install_r]: https://www.r-project.org/
[madlib]: http://madlib.apache.org/
[madlib_arima]: http://madlib.apache.org/docs/latest/group__grp__arima.html
[madlib_install]: https://cwiki.apache.org/confluence/display/MADLIB/Installation+Guide
[python-psycopg2]: https://pypi.org/project/psycopg2/
[python-statsmodels]: http://www.statsmodels.org/dev/tsa.html
[r-forecast]: https://cran.r-project.org/web/packages/forecast/forecast.pdf
[r-xts]: https://cran.r-project.org/web/packages/xts/xts.pdf
[rpostgres]: https://cran.r-project.org/web/packages/RPostgres/index.html
[tutorial-postgis]: /tutorials/:currentVersion:/nyc-taxi-cab/#mission-monitoring
