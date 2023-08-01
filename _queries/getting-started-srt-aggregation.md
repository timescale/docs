SELECT
  time_bucket('1 day', time) AS bucket,
  symbol,
  max(price) AS high,
  first(price, time) AS open,
  last(price, time) AS close,
  min(price) AS low
FROM stocks_real_time srt
WHERE time > now() - INTERVAL '1 week'
GROUP BY bucket, symbol
ORDER BY bucket, symbol
LIMIT 10;

-- Output

day                    | symbol |     high     |   open   |  close   |     low
-----------------------+--------+--------------+----------+----------+--------------
2023-06-07 00:00:00+00 | AAPL   |       179.25 |   178.91 |   179.04 |       178.17
2023-06-07 00:00:00+00 | ABNB   |       117.99 |    117.4 | 117.9694 |          117
2023-06-07 00:00:00+00 | AMAT   |     134.8964 |   133.73 | 134.8964 |       133.13
2023-06-07 00:00:00+00 | AMD    |       125.33 |   124.11 |   125.13 |       123.82
2023-06-07 00:00:00+00 | AMZN   |       127.45 |   126.22 |   126.69 |       125.81
...
