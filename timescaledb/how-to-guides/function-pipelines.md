# Function Pipelines #

Function pipelines offer a concise and readable way to chain operations on TimescaleDB Toolkit types.

## Timevector Pipeline Elements ##

There are a number of kinds of timevector pipeline elements.
 - [Transforms](#transforms) change the contents of the timevector, returning
   the updated vector
 - [Finalizers]() finish off the pipeline and output the resulting data.
    These can be further divided into
     - Output functions output the contents of the timevector in a specified
       format
     - Aggregation functions run an aggregation of the contents of the
       `timevector` and return the results

### Transforms ###
These function pipeline elements change the contents of a `timevector`.

#### Vectorized Math Functions #### 
These function pipeline elements modify each `value` inside the `timevector`
with the specified mathematical function. They are applied point-by-point and
they produce a one-to-one mapping from the input to output `timevector`. Each
point in the input has a corresponding point in the output, with its `value`
transformed by the mathematical function specified.

<highlight type="tip">

Note that elements  are always applied left to right, order of operations is not
taken into account even in the presence of explicit parenthesization. This means
for a `timevector` row `('2020-01-01 00:00:00+00', 20.0)`, the pipeline

```SQL
timevector(‘2021-01-01 UTC’, 10) -> add(5) -> (mul(2) -> add(1))
```

means the same thing as

```SQL
timevector(‘2021-01-01 UTC’, 10) -> add(5) -> mul(2) -> add(1)
```

and will give the result `('2020-01-01 00:00:00+00', 31.0)`,
not `('2020-01-01 00:00:00+00', 25.0)`, nor `('2020-01-01 00:00:00+00', 31.0)`.
If multiple arithmetic operations are needed and precedence is important,
consider using a [lambda](#lambda-elements).
</highlight>

##### Unary Mathematical Functions #####
|Element|Description|
|---|---|
|`abs()`|Computes the absolute value of each value|
|`cbrt()`|Computes the cube root of each value|
|`ceil()`|Computes the first integer greater than or equal to each value|
|`floor()`|Computes the first integer less than or equal to each value|
|`ln()`|Computes the natural logarithm of each value|
|`log10()`|Computes the base 10 logarithm of each value|
|`round()`|Computes the closest integer to each value |
|`sign()`|Computes +/-1 for each positive/negative value|
|`sqrt()`|Computes the square root for each value|
|`trunc()`|Computes only the integer portion of each value|

These elements apply the corresponding mathematical function to each datapoint
in the `timevector` leaving the timestamp and ordering the same. Note that even
if an element logically computes an integer, `timevectors` only deal with
double precision floating point values, so the computed value will be the
floating point representation of said integer. 

```SQL
SELECT
    toolkit_experimental.timevector(time, value)
    	-> toolkit_experimental.abs()
    	-> toolkit_experimental.unnest()
FROM (VALUES (TimestampTZ '2021-01-06 UTC',   0.0 ),
             (            '2021-01-01 UTC',  25.0 ),
             (            '2021-01-02 UTC',   0.10),
             (            '2021-01-04 UTC', -10.0 ),
             (            '2021-01-05 UTC',   3.3 )
     ) as v(time, value);
```
```
            ?column?            
--------------------------------
 ("2021-01-06 00:00:00+00",0)
 ("2021-01-01 00:00:00+00",25)
 ("2021-01-02 00:00:00+00",0.1)
 ("2021-01-04 00:00:00+00",10)
 ("2021-01-05 00:00:00+00",3.3)
(5 rows)
```

##### Binary Mathematical Functions #####
|Element|Description|
|---|---|
|`add(N)`|Computes each value plus `N`|
|`div(N)`|Computes each value divided by `N`|
|`logn(N)`|Computes the logarithm base `N` of each value|
|`mod(N)`|Computes the remainder when each number is divided by `N`|
|`mul(N)`|Computes each value multiplied by `N`|
|`power(N)`|Computes each value taken to the `N` power|
|`sub(N)`|Computes each value less `N`|

Runs the corresponding mathematical function on the `value` in each point in the
`timevector` using the supplied number as the second argument of the function.
This means that `vector -> power(2)` will square all of the `values`,
and `vector -> logn(3)` will give the log-base-3 of each `value`.

```SQL
SELECT
    toolkit_experimental.timevector(time, value)
    -> toolkit_experimental.power(2)
    -> toolkit_experimental.unnest()
FROM (VALUES (TimestampTZ '2021-01-06 UTC',   0.0 ),
             (            '2021-01-01 UTC',  25.0 ),
             (            '2021-01-02 UTC',   0.10),
             (            '2021-01-04 UTC', -10.0 ),
             (            '2021-01-05 UTC',   3.3 )
     ) as v(time, value);
```
```
                    ?column?                     
-------------------------------------------------
 ("2021-01-06 00:00:00+00",0)
 ("2021-01-01 00:00:00+00",625)
 ("2021-01-02 00:00:00+00",0.010000000000000002)
 ("2021-01-04 00:00:00+00",100)
 ("2021-01-05 00:00:00+00",10.889999999999999)
(5 rows)
```

#### Compound transforms #### 
Unlike mathematical transforms, which are applied only to the `value` in each
point in a `timevector` and always produce one-to-one output `timevectors`,
compound transforms may involve both the `time` and `value` parts of the points
in the `timevector` and they are not necessarily one-to-one; one or more points
in the input can be used to produce zero or more points in the output. So, where
mathematical transforms will always produce `timevectors` of the same length,
compound transforms may produce larger or smaller `timevectors` as output. 

##### `delta()` #####

Calculates the difference between consecutive `values` in the `timevector`.
The first point in the `timevector` is omitted as there is no previous value and
it cannot have a `delta()`. Data should be sorted using the `sort()` element
before passing into `delta()`.

```SQL
SELECT (
    toolkit_experimental.timevector(time, value)
    -> toolkit_experimental.sort()
    -> toolkit_experimental.delta()
    -> toolkit_experimental.unnest() ).* 
FROM (VALUES (TimestampTZ '2021-01-06 UTC',   0.0 ),
             (            '2021-01-01 UTC',  25.0 ),
             (            '2021-01-02 UTC',   0.10),
             (            '2021-01-04 UTC', -10.0 ),
             (            '2021-01-05 UTC',   3.3 )
     ) as v(time, value);
```
```
             ?column?             
----------------------------------
 ("2021-01-02 00:00:00+00",-24.9)
 ("2021-01-04 00:00:00+00",-10.1)
 ("2021-01-05 00:00:00+00",13.3)
 ("2021-01-06 00:00:00+00",-3.3)
(4 rows)
```

<highlight type="tip">
Note that the first row is missing (there is one fewer row) as there is no way
to compute a delta without a previous value.
</highlight>

##### `fill_to(INTERVAL, fill_method)` ##### 
Assures that there is a point at least every `interval`, if there is not a
point, it will fill the point in using the method provided. The timevector
must be sorted before calling fill_to().

|fill_method|description|
|---|---|
|LOCF|Last object carried forward, fill with last known value prior to the hole|
|Interpolate|Fill the hole using a collinear point with the first known value on either side|
|Linear|This is just an alias for Interpolate|
|Nearest|Fill with the matching value from the closer of the points preceding or following the hole|

```SQL
SELECT
    toolkit_experimental.timevector(time, value)
    -> toolkit_experimental.sort()
    -> toolkit_experimental.fill_to('1 day', 'LOCF')
    -> toolkit_experimental.unnest()
FROM (VALUES (TimestampTZ '2021-01-06 UTC',   0.0 ),
             (            '2021-01-01 UTC',  25.0 ),
             (            '2021-01-02 UTC',   0.10),
             (            '2021-01-04 UTC', -10.0 ),
             (            '2021-01-05 UTC',   3.3 )
     ) as v(time, value);
```
```
            ?column?            
--------------------------------
 ("2021-01-01 00:00:00+00",25)
 ("2021-01-02 00:00:00+00",0.1)
 ("2021-01-03 00:00:00+00",0.1)
 ("2021-01-04 00:00:00+00",-10)
 ("2021-01-05 00:00:00+00",3.3)
 ("2021-01-06 00:00:00+00",0)
(6 rows)
```

##### `lttb(resolution INTEGER)` #####

Uses the graphical downsampling algorithm
Largest Triangle Three Buckets (LTTB) to downsample a `timevector` to the
specified resolution while maintaining visual acuity.

##### `sort()` #####

Sorts the `timevector` by time (ascending). Is a no-op if the `timevector` is
already sorted.

```SQL
SELECT 
    toolkit_experimental.timevector(time, value)
    -> toolkit_experimental.sort()
    -> toolkit_experimental.unnest()
FROM (VALUES (TimestampTZ '2021-01-06 UTC',   0.0 ),
             (            '2021-01-01 UTC',  25.0 ),
             (            '2021-01-02 UTC',   0.10),
             (            '2021-01-04 UTC', -10.0 ),
             (            '2021-01-05 UTC',   3.3 )
     ) as v(time, value);
```
```
            ?column?            
--------------------------------
 ("2021-01-01 00:00:00+00",25)
 ("2021-01-02 00:00:00+00",0.1)
 ("2021-01-04 00:00:00+00",-10)
 ("2021-01-05 00:00:00+00",3.3)
 ("2021-01-06 00:00:00+00",0)
(5 rows)
```

#### Lambda Elements ####

These functions use the Toolkit’s experimental lambda syntax to transform
a timevector. The lambda syntax is briefly summarized below.

##### Lambda Summary #####
A lambda is an expression that is applied to the elements of a `timevector`.
It is written as a string, usually `$$`-quoted, containing the expression to be
run. An example using most of the syntax is

```SQL
$$
 let $is_relevant = $time > '2021-01-01't and $time < '2021-10-14't;
 let $is_significant = abs(round($value)) >= 0;
 $is_relevant and $is_significant
$$
```

The expression can be constructed from the following components:

**Variable declarations** such as `let $foo = 3; $foo * $foo`. Variable
declarations are ended with a semicolon. All lambdas must end with an
expression, this does not have a semicolon. Multiple variable declarations may
follow one another, ie `let $foo = 3; let $bar = $foo * $foo; $bar * 10`
(which is a rather odd way to write 90, but, y’know). 

**Variable names** such as `$foo`. They must start with a `$` symbol. The
variables `$time` and `$value` are special: they refer to the time and value of
the point in the vector the lambda expression is being called on.

**Function calls** such as `abs($foo)` most mathematical functions are supported.

**Binary operations** containing the arithmetic binary operators `and`, `or`,
`=`, `!=`, `<`, `<=`, `>`, `>=`, `^`, `*`, `/`, `+`, `-` are supported

**Interval literals** are expressed with a trailing `i`. For example `'1 day'i`.
Except for the trailing `i` these follow the postgres `INTERVAL` input format.

**Time literals** such as `'2021-01-02 03:00:00't` (note trailing `t`).
Except for the trailing `t` these follow the postgres `TIMESTAMPTZ` input format.

**Number literals** such as `42`, `0.0`, `-7`, `1e2`.

Lambdas follow a grammar that is roughly equivalent to the EBNF
```EBNF
Expr     = ('let' Variable '=' Tuple ';')* Tuple
Tuple    = Binops (',' Binops)*
Binops   = Unaryops (Binop Unaryops)*
UnaryOps = ('-' | 'not') UnaryOps | Term
Term     = Variable | Time | Interval | Number | Function | '(' Expr ')'
Function = FunctionName '(' (Binops ',')* ')'
Variable = …
Time     = …
Interval = …
Number   = …
```

##### `map()` #####

`map()` maps a lambda over each element of the `timevector`. This lambda must
either return either a `DOUBLE PRECISION` in which case only the values of each
point in the `timevector` is altered, or a `(TIMESTAMPTZ, DOUBLE PRECISION)` in
which case both the times and values are changed.

```SQL
SELECT
   toolkit_experimental.timevector(time, value)
   -> toolkit_experimental.map($$ $value + 1 $$)
   -> toolkit_experimental.unnest()
FROM (VALUES (TimestampTZ '2021-01-06 UTC',   0.0 ),
             (            '2021-01-01 UTC',  25.0 ),
             (            '2021-01-02 UTC',   0.10),
             (            '2021-01-04 UTC', -10.0 ),
             (            '2021-01-05 UTC',   3.3 )
     ) as v(time, value);
```
```
            ?column?            
--------------------------------
 ("2021-01-06 00:00:00+00",1)
 ("2021-01-01 00:00:00+00",26)
 ("2021-01-02 00:00:00+00",1.1)
 ("2021-01-04 00:00:00+00",-9)
 ("2021-01-05 00:00:00+00",4.3)
(5 rows)
```
```SQL
SELECT
   toolkit_experimental.timevector(time, value)
   -> toolkit_experimental.map($$ ($time + '1day'i, $value * 2) $$)
   -> toolkit_experimental.unnest()
FROM (VALUES (TimestampTZ '2021-01-06 UTC',   0.0 ),
             (            '2021-01-01 UTC',  25.0 ),
             (            '2021-01-02 UTC',   0.10),
             (            '2021-01-04 UTC', -10.0 ),
             (            '2021-01-05 UTC',   3.3 )
     ) as v(time, value);
```
```
            ?column?            
--------------------------------
 ("2021-01-07 00:00:00+00",0)
 ("2021-01-02 00:00:00+00",50)
 ("2021-01-03 00:00:00+00",0.2)
 ("2021-01-05 00:00:00+00",-20)
 ("2021-01-06 00:00:00+00",6.6)
(5 rows)
```

##### `filter()` #####

`filter()` filters a `timevector` based on a lambda expression that should
return `true` for every point that should remain in the `timevector`timeseries,
and `false` for every point that should be removed.

```SQL
SELECT
   toolkit_experimental.timevector(time, value)
   -> toolkit_experimental.filter($$ $time != '2021-01-01't AND $value > 0 $$)
   -> toolkit_experimental.unnest()
FROM (VALUES (TimestampTZ '2021-01-06 UTC',   0.0 ),
             (            '2021-01-01 UTC',  25.0 ),
             (            '2021-01-02 UTC',   0.10),
             (            '2021-01-04 UTC', -10.0 ),
             (            '2021-01-05 UTC',   3.3 )
     ) as v(time, value);
```
```
            ?column?            
--------------------------------
 ("2021-01-02 00:00:00+00",0.1)
 ("2021-01-05 00:00:00+00",3.3)
(2 rows)
```
#### Finalizers ####

Finish off the timevector pipeline and output some value.

##### `timevector` output #####
These pipeline elements are used at the end of function pipelines that return 
timevector`s in order to get them into a format more useful for use later.

 - `unnest()` returns a set of `(TimestampTZ, DOUBLE PRECISION)` pairs
 - `materialize()` forces the pipeline to materialize a timevector. This will
    block any optimizations that materialize a timevector lazily

##### `timevector` aggregates #####

`average()`, `counter_agg()`, `hyperloglog()`, `stats_agg()`, `sum()`, `num_vals()`

These elements take a `timevector` and run the corresponding aggregate over it
to produce a result

```SQL
SELECT toolkit_experimental.timevector(time, value) -> toolkit_experimental.num_vals()
FROM (VALUES (TimestampTZ '2021-01-06 UTC',   0.0 ),
             (            '2021-01-01 UTC',  25.0 ),
             (            '2021-01-02 UTC',   0.10),
             (            '2021-01-04 UTC', -10.0 ),
             (            '2021-01-05 UTC',   3.3 )
     ) as v(time, value);
```
```
 ?column? 
----------
        5
(1 row)
```
```SQL
SELECT
    toolkit_experimental.timevector(time, value)
    -> toolkit_experimental.stats_agg()
    -> toolkit_experimental.stddev()
FROM (VALUES (TimestampTZ '2021-01-06 UTC',   0.0 ),
             (            '2021-01-01 UTC',  25.0 ),
             (            '2021-01-02 UTC',   0.10),
             (            '2021-01-04 UTC', -10.0 ),
             (            '2021-01-05 UTC',   3.3 )
     ) as v(time, value);
```
```
      ?column?      
--------------------
 12.924666339987272
(1 row)
```


## Aggregate accessors and mutators ##

These act like the normal function-based accessors for aggregates. You can use
them to get a value from the aggregate part of a function pipeline like so:

```SQL
SELECT device_id, 
timevector(ts, val) -> sort() -> delta() -> stats_agg() -> variance() 
FROM measurements
```

But these don’t just work on `timevector`s - they also work on a normally
produced aggregate as well. 

When used instead of normal function accessors and mutators they can make the
syntax more clear by getting rid of nested functions like: 

```SQL
SELECT approx_percentile(0.5, percentile_agg(val)) 
FROM measurements
```

Instead, we can use the arrow accessor to convey the same thing: 
```SQL
SELECT percentile_agg(val) -> approx_percentile(0.5) 
FROM measurements
```

### By aggregate family: ###
#### Counter Aggregates ####
Counter aggregates deal with resetting counters. Counters are a common type of
metric in the application performance monitoring and metrics world. All values
have resets accounted for. These elements must have a `CounterSummary` to their
left when used in a pipeline, from a `counter_agg()` aggregate or pipeline element.

|Element|Description|
|---|---|
|`counter_zero_time()`|The time at which the counter value is predicted to have been zero based on the least squares fit of the points input to the `CounterSummary`(x intercept) |
|`corr()`|The correlation coefficient of the least squares fit line of the adjusted counter value.|
|`delta()`|Computes the last - first value of the counter|
|`extapolated_delta(method)`| Computes the delta extrapolated using the provided method to bounds of range. Bounds must have been provided in the aggregate or a `with_bounds` call |
|`idelta_left()` / `idelta_right()`|Computes the instantaneous difference between the second and first points (left) or last and next-to-last points (right) |
|`intercept()`|The y-intercept of the least squares fit line of the adjusted counter value.|
|`irate_left()` / `irate_right()`|Computes the instantaneous rate of change between the second and first points (left) or last and next-to-last points (right) |
|`num_changes()`| Number of times the counter changed values.|
|`num_elements()`| Number of items - any with the exact same time will have been counted only once.|
|`num_changes()`| Number of times the counter reset.|
|`slope()`|The slope of the least squares fit line of the adjusted counter value.|
|`with_bounds(range)`|Applies bounds using the `range` (a `TSTZRANGE`) to the `CounterSummary` if they weren’t provided in the aggregation step |

#### Percentile Approximation ####
These aggregate accessors deal with percentile approximation. For now accessors
are only implemented them for `percentile_agg` and `uddsketch` based aggregates.
We have not yet implemented the pipeline aggregate for this. 

|Element|Description|
|---|---|
|`approx_percentile(p)`| The approximate value at percentile `p` |
|`approx_percentile_rank(v)`|The approximate percentile a value `v` would fall in|
|`error()`|The maximum relative error guaranteed by the approximation|
|`mean()`| The exact average of the input values.|
|`num_vals()`| The number of input values|

#### Statistical aggregates ####
These aggregate accessors add support for common statistical aggregates (and
were stabilized in our 1.3 release this week!). These allow you to compute and
`rollup()` common statistical aggregates like `average`, `stddev` and more
advanced ones like `skewness` as well as 2 dimensional aggregates like `slope`
and `covariance`.  Because there are both 1D and 2D versions of these, the
accessors can have multiple forms, for instance, `average()` calculates the
average on a 1D aggregate while `average_y()` & `average_x()` do so on each
dimension of a 2D aggregate.

|Element|Description|
|---|---|
|`average() / average_y() / average_x()`|The average of the values. |
|`corr()`|The correlation coefficient of the least squares fit line.|
|`covariance(method)`|The covariance of the values using either `population` or `sample` method.|
| `determination_coeff()`| The determination coefficient (aka R squared)  of the values.|
|`kurtosis(method) / kurtosis_y(method) / kurtosis_x(method)`|The kurtosis (4th moment) of the values using either `population` or `sample` method.|
|`intercept()`|The intercept of the least squares fit line.|
|`num_vals()`|The number of values seen.|
|`skewness(method) / skewness_y(method) / skewness_x(method)`|The skewness (3rd moment) of the values using either `population` or `sample` method.|
|`slope()`|The slope of the least squares fit line.|
|`stddev(method) / stddev_y(method) / stddev_x(method)`|The standard deviation of the values using either `population` or `sample` method.|
| `sum()` | The sum of the values. |
|`variance(method) / variance_y(method) / variance_x(method)`|The variance of the values using either `population` or `sample` method.|
|`x_intercept()`|The x intercept of the least squares fit line.|

#### Time Weighted Averages ####
The `average()` accessor may be called on the output of a `time_weight()` like so:

```SQL
SELECT time_weight('Linear', ts, val) -> average()  FROM measurements;
```

#### Approximate Count Distinct (Hyperloglog) ####

This is an approximation for distinct counts. The `distinct_count()` accessor
may be called on the output of a `hyperloglog()` like so:

```SQL
SELECT hyperloglog(device_id) -> distinct_count() FROM measurements;
```

## Alphabetical index of vector pipeline elements ## 

| Element | Category| Output |
|---|---|---|
| `abs()` | Unary Mathematical | `timevector` pipeline | 
| `add(val DOUBLE PRECISION)` | Binary Mathematical | `timevector` pipeline |
| `average()` | Aggregate Finalizer | DOUBLE PRECISION | 
| `cbrt()` | Unary Mathematical |  `timevector` pipeline | 
| `ceil()` | Unary Mathematical |  `timevector` pipeline | 
|`counter_agg()` | Aggregate Finalizer |  `CounterAgg` | 
| `delta()` | Compound | `timevector` pipeline |
| `div` | Binary Mathematical | `timevector` pipeline |
| `fill_to` | Compound | `timevector` pipeline |
| `filter` | Lambda | `timevector` pipeline |
| `floor` | Unary Mathematical | `timevector` pipeline |
| `hyperloglog` | Aggregate Finalizer | HyperLogLog |
| `ln` | Unary Mathematical | `timevector` pipeline |
| `log10` | Unary Mathematical | `timevector` pipeline |
| `logn` | Binary Mathematical | `timevector` pipeline |
| `lttb` | Compound | `timevector` pipeline |
| `map` | Lambda | `timevector` pipeline |
| `materialize` | Output | `timevector` pipeline |
| `mod` | Binary Mathematical | `timevector` pipeline |
| `mul` | Binary Mathematical | `timevector` pipeline |
| `num_vals` | Aggregate Finalizer | BIGINT |
| `power` | Binary Mathematical | `timevector` pipeline |
| `round` | Unary Mathematical | `timevector` pipeline |
| `sign` | Unary Mathematical | `timevector` pipeline |
| `sort` | Compound | `timevector` pipeline |
| `sqrt` | Unary Mathematical | `timevector` pipeline |
| `stats_agg` | Aggregate Finalizer | StatsSummary1D |
| `sub` | Binary Mathematical | `timevector` pipeline |
| `sum` | Aggregate Finalizer | `timevector` pipeline |
| `trunc` | Unary Mathematical | `timevector` pipeline |
| `unnest` | Output | `TABLE (time TIMESTAMPTZ, value DOUBLE PRECISION)` |
