SELECT
  time_bucket('1 day', time) AS bucket,
  symbol,
  min(price) AS low
FROM stocks_real_time srt
WHERE time > now() - INTERVAL '1 week'
LIMIT 10;

-- Output

day                    | symbol |     high     |   open   |  close   |     low
-----------------------+--------+--------------+----------+----------+--------------
2023-06-07 00:00:00+00 | AAPL   |       179.25 |   178.91 |   179.04 |       178.17
2023-06-07 00:00:00+00 | ABNB   |       117.99 |    117.4 | 117.9694 |          117
2023-06-07 00:00:00+00 | AMZN   |       127.45 |   126.22 |   126.69 |       125.81
...
