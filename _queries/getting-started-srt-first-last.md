SELECT symbol, first(price,time), last(price, time)
FROM stocks_real_time srt
WHERE time > now() - INTERVAL '4 days'
GROUP BY symbol
ORDER BY symbol
LIMIT 10;

-- Output

symbol |  first   |   last
-------+----------+----------
AAPL   | 179.0507 |   179.04
ABNB   |   118.83 | 117.9694
AMAT   |   133.55 | 134.8964
AMD    | 122.6476 |   125.13
AMZN   | 126.5599 |   126.69
...
