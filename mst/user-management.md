---
title: User management
excerpt: Add and manage users for your Managed Service for TimescaleDB project
product: mst
keywords: [users, admin]
tags: [manage]
---

# User Management
You can add new users, and manage existing users, in the Managed Service for
TimescaleDB console. New users can be added to an entire project, or a single
service.

## Project members
You can invite new users to join your project as project members. There are
several roles available for project members:

|Role|Invite more users|Modify billing information|Manage existing services|Start and stop services|View service information|
|-|-|-|-|-|-|
|Admin|✅|✅|✅|✅|✅|
|Operator|❌|❌|✅|✅|✅|
|Developer|✅|❌|✅|❌|✅|
|Read-only|❌|❌|❌|❌|✅|

Users who can manage existing services can create databases and connect to them,
on a service that already exists. To create a new service, users need the start
and stop services permission.

<procedure>

### Adding project members
1.  [Log in to your account][mst-login]. By default, you start in the
    `Services` view, showing any services you currently have in your project.
1.  Check that you are in the project that you want to change the members for,
    and click `Members`.
1.  In the `Project members` page, type the email address of the member you want
    to add, and select a role for the member.
1.  Click `Send invitation`.
1.  The new user is sent an email inviting them to the project, and the invite
    shows in the `Pending invitations` list. You can click `Withdraw invitation`
    to remove an invitation before it has been accepted.
1.  When they accept the invitation, the user details show in the `Members`
    list. You can edit a member role by selecting a new role in the list. You
    can delete a member by clicking the delete icon in the list.

</procedure>

## Service users
By default, when you create a new service, a new `tsdbadmin` user is created.
This is the user that you use to connect to your new service.

The `tsdbadmin` user is the owner of the database, but is not a superuser. To
access features requiring a superuser, log in as the `postgres` user instead.

On Managed Service for TimescaleDB services, the `tsdbadmin` user can:

* Create a database
* Create a role
* Perform replication
* Bypass row level security (RLS)

This allows you to use the `tsdbadmin` user to create another user with any
other roles. For a complete list of roles available, see the
[PostgreSQL role attributes documentation][pg-roles-doc].

<highlight type="important">
Your service must be running before you can manage users.
</highlight>

<procedure>

### Adding service users
1.  [Log in to your account][mst-login]. By default, you start in the
    `Services` view, showing any services you currently have in your project.
1.  Click the name of the service that you want to add users to, and navigate
    to the `Users` tab.
1.  In the `Username` field, type a name for your user. If you want to allow
    the user to be replicated, toggle `Allow replication`. Click
    `Add service user` to save the user.
1.  The new user shows in the `Username` list. You can view the password by
    clicking the eye icon. Use the options in the list to change the replication
    setting and password, or delete the user.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/mst-serviceuser.png" alt="Add a new MST service user"/>

</procedure>

[mst-login]: https://portal.managed.timescale.com
[pg-roles-doc]: https://www.postgresql.org/docs/current/role-attributes.html
