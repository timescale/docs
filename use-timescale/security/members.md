---
title: Role-based access to Tiger Cloud projects
excerpt: Manage your projects and services in Tiger Cloud Console. Add and delete users, assign roles, join and leave projects, transfer project ownership, and configure authentication
products: [cloud]
keywords: [members, projects, admin, roles]
tags: [users]
cloud_ui:
  path:
    - [members]
---

# Role-based access to $PROJECT_LONGs

When you sign up for a [30-day free trial][sign-up], $CLOUD_LONG creates a $PROJECT_SHORT with built-in role-based access. This includes the following roles: 

- `Owner`: $CLOUD_LONG assigns this role to you when your $PROJECT_SHORT is created. As Owner, you can add and delete other users, transfer project ownership, administer $SERVICE_SHORTs, and edit $PROJECT_SHORT settings. 
- `Admin`: the Owner assigns this role to other users in the $PROJECT_SHORT. A user with the `Admin` role has the same scope of rights as the `Owner` but cannot transfer project ownership.
- `Viewer`: the Owner and Admin assign this role to other users in the $PROJECT_SHORT. A Viewer has limited, read-only access to $CONSOLE_LONG. This means that a Viewer cannot modify $SERVICE_SHORTs and their configurations in any way. A Viewer has no access to the $DATA_MODE and has read-queries-only access to $SQL_EDITOR. 

![Project users in $CONSOLE](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-cloud-console-project-users-overview.png)

If you have the [$ENTERPRISE $PRICING_PLAN][pricing-plans], you can use your company [SAML][saml]
identity provider to log in to $CONSOLE_SHORT.

<Highlight type="important">

$PROJECT_LONG RBAC roles do not overlap with database-level roles for the individual $SERVICE_SHORTs in your $PROJECT_SHORT. This page describes the user roles available in $CONSOLE_SHORT. For the database-level user roles, see [Manage database level user roles][database-rbac].

</Highlight>

## Add a user to your $PROJECT_SHORT

New users do not need to have a $ACCOUNT_LONG before you add them, they are
prompted to create one when they respond to the confirmation email. Existing users
join a $PROJECT_SHORT in addition to the other $PROJECT_SHORTs they are already members of.

To add a user to a $PROJECT_SHORT:

<Procedure>

1.  In [$CONSOLE][cloud-login], click `Invite users`, then click `Add new user`.

1.  Type the email address of the person that you want to add, select their role, and click `Invite
    user`.

    ![Send a user invitation in $CONSOLE](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-cloud-console-add-new-user.png)

    [$ENTERPRISE $PRICING_PLAN][pricing-plans] and SAML users receive a notification in $CONSOLE_SHORT. Users in the
    other $PRICING_PLANs receive a confirmation email. The new user then [joins the $PROJECT_SHORT][join-a-project].

</Procedure>

## Join a $PROJECT_SHORT

When you are asked to join a $PROJECT_SHORT, the $CONSOLE sends you an invitation email. Follow the
instructions in the invitation email to join the $PROJECT_SHORT:

- **New $CLOUD_LONG user**:
    1. In the invitation email, click `Accept Invite`.
       $CLOUD_LONG opens.
    2. Follow the setup wizard and create a new $ACCOUNT_SHORT.

       You are added to the $PROJECT_SHORT you were invited to.

- **Existing $CLOUD_LONG user**:
    1. In the invitation email, click `Accept Invite`.

       $CONSOLE_LONG opens and you are added to the $PROJECT_SHORT.

- **[Enterprise plan][pricing-plans] and SAML user**:
    1. Log in to $CONSOLE_SHORT using your company's identity provider.
    2. Click `Notifications`, then accept the invitation.

       $CONSOLE_LONG opens, and you are added to the $PROJECT_SHORT. As you are now
       included in more than one $PROJECT_SHORT, you can easily [change $PROJECT_SHORTs][change-project].


## Resend a $PROJECT_SHORT invitation

$PROJECT_SHORT_CAP invitations are valid for 7 days. To resend a $PROJECT_SHORT invitation:

<Procedure>

1.  In [$CONSOLE][cloud-login], click `Invite users`.

1.  Next to the person you want to invite to your $PROJECT_SHORT, click `Resend invitation`.

    ![Resend a user invitation in $CONSOLE](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-cloud-console-resend-user-invitation.png)

</Procedure>

## Change your current $PROJECT_SHORT

To change the $PROJECT_SHORT you are currently working in:

<Procedure>

1. In [$CONSOLE][cloud-login], click the $PROJECT_SHORT name > `Current project` in the top left.

   ![Change project in $CONSOLE](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-cloud-console-change-project.png)

1. Select the $PROJECT_SHORT you want to use.

You can now manage the users and $SERVICE_SHORTs in this $PROJECT_SHORT.

</Procedure>

## Transfer $PROJECT_SHORT ownership

Each $PROJECT_LONG has one Owner. As the $PROJECT_SHORT Owner, you have rights to
add and delete users, edit $PROJECT_SHORT settings, and transfer the Owner role to another user. When you transfer
ownership to another user, you lose your ownership rights.

To transfer $PROJECT_SHORT ownership:

<Procedure>

1.  In [$CONSOLE][cloud-login], click `Invite users`.

1.  Next to the person you want to transfer project ownership to, click `⋮` > `Transfer project ownership`.

    ![Transfer project ownership in $CONSOLE](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-cloud-console-transfer-project-ownership.png)

    If you are unable to transfer ownership, hover over the greyed out button to see the details.

1. Enter your password, and click `Verify`.
1. Complete the two-factor authentication challenge and click `Confirm`.

</Procedure>

If you have the [Enterprise pricing plan][pricing-plans], and log in to $CLOUD_LONG using [SAML authentication][saml]
or have not enabled [two-factor authentication][2fa], [contact support](https://www.timescale.com/contact) to transfer
$PROJECT_SHORT ownership.


## Leave a $PROJECT_SHORT

To stop working in a $PROJECT_SHORT:

<Procedure>

1. In [$CONSOLE][cloud-login], click `Invite users`.

1. Click `⋮` > `Leave project`, then click `Leave`.

   ![Leave a project in $CONSOLE](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-cloud-console-leave-a-project.png)

Your $ACCOUNT_SHORT is removed from the $PROJECT_SHORT immediately, you can no longer access this $PROJECT_SHORT.

</Procedure>

## Change roles of other users in a $PROJECT_SHORT

The Owner can change the roles of all users in the $PROJECT_SHORT. An Admin can change the roles of all users other than the Owner.

To change the role for another user:

<Procedure>

1.  In [$CONSOLE][cloud-login], click `Invite users`.

1.  Next to the corresponding user, select another role in the dropdown. 

    ![Change user role in $CONSOLE](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-cloud-change-user-role.png)

The user role is changed immediately. 

</Procedure>

## Remove users from a $PROJECT_SHORT

To remove a user's access to a $PROJECT_SHORT:

<Procedure>

1.  In [$CONSOLE][cloud-login], click `Invite users`.
1.  Next to the person you want to remove, click `⋮` > `Remove`.
    ![Remove user in $CONSOLE](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-cloud-remove-user-access.png)
1.  In `Remove user`, click `Remove`.

The user is deleted immediately, they can no longer access your $PROJECT_SHORT.

</Procedure>


[cloud-login]: https://console.cloud.timescale.com/
[saml]: /use-timescale/:currentVersion:/security/saml/
[2fa]: /use-timescale/:currentVersion:/security/multi-factor-authentication/
[sign-up]: https://console.cloud.timescale.com/
[pricing-plans]: /about/:currentVersion:/pricing-and-account-management/
[join-a-project]: /use-timescale/:currentVersion:/security/members/#join-a-project
[change-project]: /use-timescale/:currentVersion:/security/members/#change-the-current-project
[saml]: https://en.wikipedia.org/wiki/SAML_2.0
[database-rbac]: /use-timescale/:currentVersion:/security/read-only-role/