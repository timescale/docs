By default, when you create a new $SERVICE_SHORT, a new `tsdbadmin` user is created.
This is the user that you use to connect to your new $SERVICE_SHORT.

<Highlight type="important">

The `tsdbadmin` user is the owner of the database, but is not a superuser. You
cannot access the `postgres` user. There is no superuser access to $CLOUD_LONG databases.

</Highlight>

In your $SERVICE_SHORT, the `tsdbadmin` user can create another user
with any other role. For a complete list of roles available, see the
[$PG role attributes documentation][pg-roles-doc].

You cannot create multiple databases in a single $SERVICE_SHORT. If you need data isolation, use schemas or create additional $SERVICE_SHORTs.

[pg-roles-doc]: https://www.postgresql.org/docs/current/role-attributes.html
