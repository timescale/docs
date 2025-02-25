---
title: "Quick Start: Laravel and Timescale"
excerpt: Get started with Timescale Cloud or TimescaleDB using Laravel
keywords: [Laravel]
---

import QuickstartIntro from "versionContent/_partials/_quickstart-intro.mdx";

# Laravel quick start

<QuickstartIntro />

This quick start guide shows you how to:

*   [Connect to a Timescale service][connect]
*   [Create a relational table][create-table]
*   [Create a hypertable][create-a-hypertable]
*   [Insert data][insert]
*   [Execute a query][query]
*   [Explore aggregation functions][explore]

## Prerequisites

Before you start, make sure you have:

*   Created a Timescale service. For more information, see the
    [start up documentation][install]. Make a note of the Connection Information
    in the Timescale service that you created.
*   Installed the [Laravel][laravel-installation] Installer.

## Connect to a Timescale service

In this section, you create a connection to your Timescale service through the Laravel
application.

<Procedure>

<Collapsible heading="Connect to Timescale" headingLevel={3}>

1.  Create a new Laravel application configured to use PostgreSQL as the database.
    Your Timescale service works as a PostgreSQL extension.
    Don't run migrations yet, as the connection information will be provided in the next step.

    ```bash
     laravel new timescale-app
    ```
    
    Now switch directory to the newly created Laravel application and install the JavaScript dependencies:
    
    ```bash
    cd timescale-app
    ```

1.  Update the database credentials in the `.env` file of your Laravel application with the
    information shown when the Timescale service was created.

    ```ini
    DB_CONNECTION=pgsql
    DB_HOST=<Host>
    DB_PORT=<Port>
    DB_DATABASE=<Database Name>
    DB_USERNAME=<Username>
    DB_PASSWORD=<Password>
    ```

1.  Install the [Enhanced PostgreSQL driver for Laravel](https://github.com/tpetry/laravel-postgresql-enhanced):

    ```ruby
    composer require tpetry/laravel-postgresql-enhanced
    ```

1.  Create a new  Laravel migration:

    ```ruby
    php artisan make:migration activate_timescale
    ```

    A new migration file `<current-datetime>_activate_timescale.php` is created in
    the `database/migrations` directory. Activate the Timescale extension:

    ```php
    <?php

    use Illuminate\Database\Migrations\Migration;
    use Tpetry\PostgresqlEnhanced\Support\Facades\Schema;
    
    return new class extends Migration
    {
        public function up(): void
        {
            Schema::createExtensionIfNotExists('timescaledb');
            Schema::createExtensionIfNotExists('timescaledb_toolkit');
        }
    };
    ```
    
    Finally, run the migration:

    ```ruby
    php artisan migrate
    ```

</Collapsible>

</Procedure>

## Create a relational table

In this section, you create a table to store the user agent or browser and
Laravel execution time for every visitor loading a page. You could easily
extend this simple example to store a host of additional analytics information
interesting to you.

<Procedure>

<Collapsible heading="Create a relational table" headingLevel={3}>

1.  Generate a model and migration for the table:

    ```ruby
    php artisan make:model --migration PageLoad
    ```

1.  Change the migration code in the `<migration-datetime>_create_page_loads_table.php`
    file located at the `database/migrations` directory to:

    ```php
    <?php
    
    use Illuminate\Database\Migrations\Migration;
    use Tpetry\PostgresqlEnhanced\Schema\Blueprint;
    use Tpetry\PostgresqlEnhanced\Support\Facades\Schema;
    
    return new class extends Migration
    {
        public function up(): void
        {
            Schema::create('page_loads', function (Blueprint $table) {
                $table->identity(always: true);
                $table->ipAddress('ip');
                $table->text('url');
                $table->text('user_agent');
                $table->float('runtime');
                $table->timestampsTz();
    
                $table->primary(['id', 'created_at']);
            });
        }
    };
    ```

    <Highlight type="important">
    In the next chapter, you will instruct Timescale to automatically partition the table and
    create new hypertable chunks by the `created_at` column. However, Timescale requires that 
    any `UNIQUE` or `PRIMARY KEY` indexes on the table include all partitioning columns, which
    in this case is the `created_at` column.
    
    Primary keys with multiple columns are not supported by Eloquent so you can't use the automatic
    route model binding of Laravel. For acceptable performance on big tables, you should load the rows
    by all primary key columns.
    </Highlight>

1.  Run the migration to create the table:

    ```ruby
    php artisan migrate
    ```

1.  Change the generated model in `app/Models/PageLoad.php` to allow filling the migration columns:

    ```php
    <?php

    namespace App\Models;
    
    use Illuminate\Database\Eloquent\Model;
    
    class PageLoad extends Model
    {
        protected $fillable = [
            'ip',
            'runtime',
            'url',
            'user_agent',
        ];
    }
    ```

</Collapsible>

</Procedure>

## Create a hypertable

When you have created the relational table, you can transform it to a hypertable.
All operation like adding indexes, altering columns, inserting data, selecting data,
and most other tasks are executed like you always do in Laravel. A hypertable is just
a regular table with more superpowers.

<Procedure>

<Collapsible heading="Create a hypertable" headingLevel={3}>

1.  Create a migration to modify the `page_loads` table and transform it to a hypertable:

    ```ruby
    php artisan make:migration --table=page_loads make_hypertable
    ```

    A new migration file `<current-datetime>_make_hypertable.php` is created in
    the `database/migrations` directory.

1.  Change the migration code in the `<current-datetime>_make_hypertable.php`
    file located at the `database/migrations` directory to:

    ```php
    <?php
    
    use Illuminate\Database\Migrations\Migration;
    use Tpetry\PostgresqlEnhanced\Schema\Blueprint;
    use Tpetry\PostgresqlEnhanced\Schema\Timescale\Actions\CreateHypertable;
    use Tpetry\PostgresqlEnhanced\Support\Facades\Schema;
    
    return new class extends Migration
    {
        public function up(): void
        {
            Schema::table('page_loads', function (Blueprint $table) {
                $table->timescale(new CreateHypertable('created_at', interval: '14 days'));
            });
        }
    };
    ```

1.  Run the migration:

    ```ruby
    php artisan migrate
    ```

</Collapsible>

</Procedure>

## Insert data

You will now write a simple example to log all requests handled by Laravel to the created
hyptertable within the Timescale service. The `PageLoad` model could in your application
be extended by many more interesting information to build a performance analysis dashboard.

<Procedure>

<Collapsible heading="Insert data into Timescale" headingLevel={3}>

1.  Create a new middleware to log every request handled by Laravel:

    ```ruby
    php artisan make:middleware StorePageLoad
    ```

1.  Extend the generated `StorePageLoad` middleware located at `app/Http/Middleware/StorePageLoad.php`
    to save a new `PageLoad` model with the request's information to the database:

    ```php
    <?php
    
    namespace App\Http\Middleware;
    
    use App\Models\PageLoad;
    use Closure;
    use Illuminate\Http\Request;
    use Symfony\Component\HttpFoundation\Response;
    
    class StorePageLoad
    {
        /**
         * Handle an incoming request.
         *
         * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
         */
        public function handle(Request $request, Closure $next): Response
        {
            $response = $next($request);

            PageLoad::create([
                'ip' => $request->ip(),
                'url' => $request->fullUrl(),
                'user_agent' => $request->userAgent(),
                'runtime' => microtime(true) - LARAVEL_START,
            ]);

            return $response;
        }
    }
    ```

1.  Register the middleware by appending it to the middleware stack in the `bootstrap/app.php file:

    ```php
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->append(App\Http\Middleware\StorePageLoad::class);
    })
    ```

1.  Start the Laravel app and open the page multiple times:

    ```bash
    php artisan serve
    ```

1.  You can now peek into the database to see the saved `PageLoad` models:

    ```bash
    php artisan tinker --execute="dump(App\Models\PageLoad::all()->toArray())"
    ```

    The result will be similar to:

    ```bash
    [!] Aliasing 'PageLoad' to 'App\Models\PageLoad' for this Tinker session.

    array:9 [
        0 => array:7 [
            "id" => 1
            "ip" => "127.0.0.1"
            "url" => "http://localhost:8000"
            "user_agent" => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
            "runtime" => "0.38390707969666"
            "created_at" => "2025-02-25T10:22:43.000000Z"
            "updated_at" => "2025-02-25T10:22:43.000000Z"
        ]
        1 => array:7 [
            "id" => 2
            "ip" => "127.0.0.1"
            "url" => "http://localhost:8000"
            "user_agent" => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
            "runtime" => "0.16254186630249"
            "created_at" => "2025-02-25T10:22:45.000000Z"
            "updated_at" => "2025-02-25T10:22:45.000000Z"
        ]
        2 => array:7 [
            "id" => 3
            "ip" => "127.0.0.1"
            "url" => "http://localhost:8000"
            "user_agent" => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:135.0) Gecko/20100101 Firefox/135.0"
            "runtime" => "0.62188597679138"
            "created_at" => "2025-02-25T10:23:07.000000Z"
            "updated_at" => "2025-02-25T10:23:07.000000Z"
        ]
    ]
    ```

</Collapsible>

</Procedure>

## Explore aggregation functions

Now that you have performance statics saves, you can explore the data:

<Procedure>

<Collapsible heading="Explore aggregation functions" headingLevel={3}>

1.  Create an artisan command:

    ```bash
    php artisan make:command ViewStatistics
    ```
    
1.  Modify the created command in `app/Console/Commands/ViewStatistics.php` to
    calculate and display daily runtime statistics:

    ```php
    <?php
    
    namespace App\Console\Commands;
    
    use App\Models\PageLoad;
    use Illuminate\Console\Command;
    use Illuminate\Support\Facades\DB;
    use Symfony\Component\Console\Attribute\AsCommand;
    
    #[AsCommand(name: 'app:view-statistics')]
    class ViewStatistics extends Command
    {
        public function handle(): void
        {
            $statistics = PageLoad::query()
                ->select(columns: [
                    DB::raw("time_bucket('1 day', created_at) AS day"),
                    DB::raw('count(*) as count'),
                    DB::raw('avg(runtime) as runtime_avg'),
                    DB::raw('approx_percentile(0.50, percentile_agg(runtime)) as runtime_p50'),
                    DB::raw('approx_percentile(0.95, percentile_agg(runtime)) as runtime_p95'),
                    DB::raw('array_to_json(histogram(runtime, 0.0, 1.0, 5)) as runtime_histogram'),
                ])
                ->withCasts([
                    'runtime_histogram' => 'array',
                ])
                ->whereBetween('created_at', [now()->subDays(7)->startOfDay(), now()])
                ->groupBy('day')
                ->orderBy('day', 'desc')
                ->get()
                ->toArray();
    
            foreach ($statistics as $statistic) {
                $this->newLine();
    
                $this->components->twoColumnDetail('<fg=green;options=bold>'.substr($statistic['day'], 0, 10).'</>', sprintf('<fg=yellow;options=bold>%s requests</>', number_format($statistic['count'])));
                $this->components->twoColumnDetail('Runtime <fg=gray>avg</>', sprintf('%.3fs', $statistic['runtime_avg']));
                $this->components->twoColumnDetail('Runtime <fg=gray>p50</>', sprintf('%.3fs', $statistic['runtime_p50']));
                $this->components->twoColumnDetail('Runtime <fg=gray>p95</>', sprintf('%.3fs', $statistic['runtime_p95']));
                $this->components->twoColumnDetail('Runtime <fg=gray>count(0.000s - 0.199s)</>', number_format($statistic['runtime_histogram'][1]));
                $this->components->twoColumnDetail('Runtime <fg=gray>count(0.200s - 0.399s)</>', number_format($statistic['runtime_histogram'][2]));
                $this->components->twoColumnDetail('Runtime <fg=gray>count(0.400s - 0.599s)</>', number_format($statistic['runtime_histogram'][3]));
                $this->components->twoColumnDetail('Runtime <fg=gray>count(0.600s - 0.799s)</>', number_format($statistic['runtime_histogram'][4]));
                $this->components->twoColumnDetail('Runtime <fg=gray>count(0.800s - 0.999s)</>', number_format($statistic['runtime_histogram'][5]));
                $this->components->twoColumnDetail('Runtime <fg=gray>count(1.000s+)</>', number_format($statistic['runtime_histogram'][6]));
            }
        }
    }
    ```

1.  Run the command:
    
    ```bash
    php artisan app:view-statistics
    ```
    
    You should now see statistics like these:

    {insert quick-start/laravel.png image here}

</Collapsible>

</Procedure>

## Next steps

Now that you're able to connect, read, and write to a TimescaleDB instance from
your Laravel application, be sure to check out these advanced TimescaleDB topics:

*   Read up on [Compressions](https://docs.timescale.com/use-timescale/latest/compression/) to make
    the stored data up to 90% smaller and [Continuous Aggregates](https://docs.timescale.com/use-timescale/latest/continuous-aggregates/)
    to automatically pre-compute your query results for millisecond query times on any data size.
*   Refer to the [Enhanced PostgreSQL driver for Laravel](https://github.com/tpetry/laravel-postgresql-enhanced#timescale) documentation
    on how to utilize Timescale with Laravel.

[connect]: #connect-to-timescaledb
[create-table]: #create-a-relational-table
[create-a-hypertable]: #create-a-hypertable
[insert]: #insert-rows-of-data
[query]: #execute-a-query
[explore]: #explore-aggregation-functions
[install]: /getting-started/latest/
[laravel-installation]: https://laravel.com/docs/11.x/installation
[time_bucket]: /api/:currentVersion:/hyperfunctions/time_bucket/
