```sh
pg_dumpall -d "$SOURCE" \
  --quote-all-identifiers \
  --roles-only \
  --no-role-passwords \
  --file=roles.sql
```

<Highlight type="important">
Please note that AWS RDS does not permit dumping of roles with passwords, which
is why the above command is executed with the `--no-role-passwords`. However,
when the migration of roles to your Timescale instance is complete, you will
need to manually assign passwords to the necessary roles using the following
command: `ALTER ROLE role_name WITH PASSWORD 'password';`
</Highlight>

Timescale services do not support roles with superuser access. If your SQL dump
includes roles that have such permissions, you'll need to modify the file to be
compliant with the security model.

You can use the following `sed` command to remove unsupported statements and
permissions from your `roles.sql` file:
```sh
sed -i -E \
-e '/CREATE ROLE "postgres";/d' \
-e '/ALTER ROLE "postgres"/d' \
-e '/CREATE ROLE "rds/d' \
-e '/ALTER ROLE "rds/d' \
-e '/TO "rds/d' \
-e '/GRANT "rds/d' \
-e 's/(NO)*SUPERUSER//g' \
-e 's/(NO)*REPLICATION//g' \
-e 's/(NO)*BYPASSRLS//g' \
-e 's/GRANTED BY "[^"]*"//g' \
roles.sql
```

<Highlight type="info">
This command works only with the GNU implementation of `sed` (sometimes referred
to as `gsed`). For the BSD implementation (the default on macOS), you need to add
an extra argument to change the `-i` flag to `-i ''`.

To check the sed version, you can use the command `sed --version`. While the
GNU version explicitly identifies itself as GNU, the BSD version of sed
generally doesn't provide a straightforward `--version` flag and simply outputs
an "illegal option" error.
</Highlight>

A brief explanation of this script is:
* `CREATE ROLE "postgres";` and `ALTER ROLE "postgres"`: These statements are
removed because they require superuser access, which is not supported by Timescale.
* `CREATE ROLE "rds`, `ALTER ROLE “rds`, `TO "rds`, `GRANT "rds`: Any creation
or alteration of rds prefixed roles are removed because of their lack of any use
in a Timescale instance. Similarly, any grants to or from "rds" prefixed roles
are ignored as well.
* `(NO)SUPERUSER`, `(NO)REPLICATION`, `(NO)BYPASSRLS`: Assigning these permissions
to a role is an action that requires superuser privileges.
* `GRANTED BY` role_specification: The GRANTED BY clause can also have permissions
that require superuser access and should therefore be removed. Note: As per the
TimescaleDB documentation, the GRANTOR in the GRANTED BY clause must be the
current user, and this clause mainly serves the purpose of SQL compatibility.
Therefore, it's safe to remove it.