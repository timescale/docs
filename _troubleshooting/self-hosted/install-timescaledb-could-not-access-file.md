---
title: Can't access file "timescaledb" after installation
section: troubleshooting
products: [self_hosted]
topics: [installation, configuration]
errors:
  - language: text
    message: |-
      Log error: could not access file "timescaledb"
keywords: [configuration]
tags: [install, configuration]
---

{/*
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
*/}

If your PostgreSQL logs have this error preventing it from starting up,
you should double check that the TimescaleDB files have been installed
to the correct location. Our installation methods use `pg_config` to
get PostgreSQL's location. However if you have multiple versions of
PostgreSQL installed on the same machine, the location `pg_config`
points to may not be for the version you expect. To check which
version TimescaleDB used:

```bash
$ pg_config --version
PostgreSQL 12.3
```

If that is the correct version, double check that the installation path is
the one you'd expect. For example, for PostgreSQL 11.0 installed via
Homebrew on macOS it should be `/usr/local/Cellar/postgresql/11.0/bin`:

```bash
$ pg_config --bindir
/usr/local/Cellar/postgresql/11.0/bin
```

If either of those steps is not the version you are expecting, you need
to either (a) uninstall the incorrect version of PostgreSQL if you can or
(b) update your `PATH` environmental variable to have the correct
path of `pg_config` listed first, that is, by prepending the full path:

```bash
export PATH = /usr/local/Cellar/postgresql/11.0/bin:$PATH
```

Then, reinstall TimescaleDB and it should find the correct installation
path.
