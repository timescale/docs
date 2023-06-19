---
title: How to monitor a Django application with Prometheus
excerpt: Set up Prometheus to monitor a Django application
products: [cloud, mst, self_hosted]
keywords: [prometheus, django, monitor]
---

# How to monitor a Django application with Prometheus

## Introduction

Prometheus is an open-source systems monitoring and alerting toolkit that can be
used to easily and cheaply monitor infrastructure and applications. In this
tutorial we show how to monitor a Django application with Prometheus. (And even
if you don't have a Django application, we include an optional step to create
one so that everyone can follow along.)

## Prerequisites

A machine with the following installed:

*   Python
*   [pip][get-pip]
*   A locally running [Prometheus][get-prometheus] instance

<Highlight type="tip">
Since machines commonly have multiple versions of Python
installed, in this tutorial we call `pip` using the `python -m pip [foo]`
syntax instead of the `pip [foo]` syntax. This is to ensure that pip installs
new components for the version of Python that we are using.
</Highlight>

## Step 1 - Set up a basic Django application (optional)

*(Please skip this step if you already have a Django application.)*

### Install Django

```bash
python -m pip install Django
```

*[More info on Django.][get-django]*

### Create a template project

Navigate to the directory where you want to create the project,
and run:

```bash
django-admin startproject mysite
```

This creates a `mysite` directory in your current directory, that looks
something like this ([more here][django-first-app]):

```
mysite/
    manage.py
    mysite/
        __init__.py
        settings.py
        urls.py
        asgi.py
        wsgi.py
```

### Verify that Django is working

Change to the outer `mysite` directory, and run:

```bash
python manage.py runserver
```

You should see something like this:

````
Performing system checks...

System check identified no issues (0 silenced).

You have unapplied migrations; your app may not work properly until they are applied.
Run 'python manage.py migrate' to apply them.

March 10, 2020 - 15:50:53
Django version 3.0, using settings 'mysite.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
````

If that works, then visit `http://127.0.0.1:8000/` from your Web browser.
You should see a "Congratulations!" page, with a rocket taking off.

(If that didn't work, then please take a look at the
[Django documentation][django-first-app] for troubleshooting.)

## Step 2 - Export prometheus-style monitoring metrics from your Django application

We use the [django-prometheus][get-django-prometheus] package for
exporting prometheus-style monitoring metrics from our Django application.

### Install django-prometheus

```bash
python -m pip install django-prometheus
```

### Modify `settings.py` and `urls.py`

In `settings.py`, add:

```
INSTALLED_APPS = [
   ...
   'django_prometheus',
   ...
]

MIDDLEWARE = [
    'django_prometheus.middleware.PrometheusBeforeMiddleware',
    # All your other middlewares go here, including the default
    # middlewares like SessionMiddleware, CommonMiddleware,
    # CsrfViewmiddleware, SecurityMiddleware, etc.
    'django_prometheus.middleware.PrometheusAfterMiddleware',
]
```

In `urls.py`, make sure you have this in the header:

```python
from django.conf.urls import include, path
```

Then add this under urlpatterns:

```python
urlpatterns = [
    ...
    path('', include('django_prometheus.urls')),
]
```

### Verify that metrics are being exported

Restart the application and curl the `/metrics` endpoint:

```bash
python manage.py runserver
curl localhost:8000/metrics
```

(Alternatively, once you've restarted your application,
visit [http://localhost:8000/metrics][localhost-metrics]
from your web browser.)

You should see something like this:

```
# HELP python_gc_objects_collected_total Objects collected during gc
# TYPE python_gc_objects_collected_total counter
python_gc_objects_collected_total{generation="0"} 11716.0
python_gc_objects_collected_total{generation="1"} 1699.0
python_gc_objects_collected_total{generation="2"} 616.0
# HELP python_gc_objects_uncollectable_total Uncollectable object found during GC
# TYPE python_gc_objects_uncollectable_total counter
python_gc_objects_uncollectable_total{generation="0"} 0.0
python_gc_objects_uncollectable_total{generation="1"} 0.0
python_gc_objects_uncollectable_total{generation="2"} 0.0
# HELP python_gc_collections_total Number of times this generation was collected
# TYPE python_gc_collections_total counter
python_gc_collections_total{generation="0"} 7020.0
python_gc_collections_total{generation="1"} 638.0
python_gc_collections_total{generation="2"} 34.0
# HELP python_info Python platform information
# TYPE python_info gauge
python_info{implementation="CPython",major="3",minor="8",patchlevel="0",version="3.8.0"} 1.0
...
```

## Step 3 - Point Prometheus to your Django application metrics endpoint

**(Note: This section assumes that you have a locally running Prometheus
instance.)**

### Update `prometheus.yml`

Under `scrape_configs:`, add:

```yaml
- job_name: django
  scrape_interval: 10s
  static_configs:
  - targets:
    - localhost:8000
```

<Highlight type="note">
Replace the `job_name`, `django`, with your preferred prefix for Django
application metrics in Prometheus. For example, you can use `webapp`.
</Highlight>

### Restart Prometheus

```bash
./prometheus --config.file=prometheus.yml
```

### Verify that Prometheus is scraping metrics from your Django application:

Once you are running Prometheus locally, visit the
[Prometheus Expression Browser (running on localhost)][localhost-prom-browser]
from your web browser.

For example, you can visit the below page, which graphs the total number of
http requests your Django application received in the last hour:

[Graph of Django HTTP requests, served on localhost][localhost-prom-example]

It should look something like this:

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-tutorial-django-prometheus/prom_expression_browser.png" alt="Prometheus graph of Total HTTP Requests in the last hour"/>

If you'd like to do more testing, visit your Django application several
more times and reload the Prometheus Expression Browser to confirm that it
is working. Also feel free to explore the other Django metrics that
Prometheus is collecting.

## Step 4 - Instrument additional aspects of your application (optional)

[Django-prometheus][get-django-prometheus] is quite powerful, and allows
you to easily instrument additional aspects of your application, including:

*   Your databases
*   Your models (for example, monitor the creation/deletion/update rate for your models)
*   Your caches
*   Your own custom metrics in your code

More information on how to do all of these is
[here][get-django-prometheus-more].

## Next steps [](#next-steps)

Congratulations. you are now monitoring your Django application with Prometheus.

[django-first-app]: https://docs.djangoproject.com/en/3.0/intro/tutorial01/
[get-django-prometheus-more]: https://github.com/korfuri/django-prometheus#monitoring-your-databases
[get-django-prometheus]: https://github.com/korfuri/django-prometheus
[get-django]: https://docs.djangoproject.com/en/3.0/topics/install/
[get-pip]: https://pip.pypa.io/en/latest/installing/#installing-with-get-pip-py
[get-prometheus]: https://prometheus.io/docs/prometheus/latest/installation/
[localhost-metrics]: http://localhost:8000/metrics
[localhost-prom-browser]: http://localhost:9090/graph
[localhost-prom-example]: http://localhost:9090/graph?g0.range_input=1h&g0.stacked=1&g0.expr=django_http_requests_total_by_method_total&g0.tab=0
