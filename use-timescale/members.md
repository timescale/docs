---
title: User management
excerpt: User management in Timescale Cloud
products: [cloud]
keywords: [members, projects, admin, roles]
tags: [users]
cloud_ui:
    path:
        - [members]
---

# User management

When you sign up for a [30-day free trial][sign-up], $CLOUD_LONG creates a project for you, and
you are assigned the `Owner` role for the project. As the project owner, you have rights to
add and delete other users, and edit project settings. Users that you add to the project are 
assigned the `Member` role. Members have rights to collaborate with you on your project, and help 
create and administer the services running in the project. 

![Project users in $CONSOLE](https://assets.timescale.com/docs/images/console-users.png)

If you have the [Enterprise pricing plan][pricing-plans], you can use your company identity 
provider to log in to $CONSOLE.

## Add a user to your project

New users do not need to have a $CONSOLE account before you add them, they are
prompted to create one when they respond to the confirmation email. Existing users
join a project in addition to the other projects they are already members of.

To add a user to a project:

<Procedure>

1.  In [$CONSOLE][cloud-login], click `Invite users`, then click `Add new user`.
    ![Send a user invitation in $CONSOLE](https://assets.timescale.com/docs/images/console-add-user.png)

1.  Type the email address of the person that you want to add, and click `Add
    user`.

    $CONSOLE sends a confirmation email to the new user, who [joins the project][join-a-project].

</Procedure>

## Join a project

When you are asked to join a $CLOUD_LONG project, $CONSOLE sends you an invitation email. Follow the
instructions in the invitation email to join the project:

- **New $CLOUD_LONG user**:
  1. In the invitation email, click **Accept Invite**.
     $CLOUD_LONG opens.
  2. Follow the setup wizard and create a new $CLOUD_LONG account.

     You are added to the project you were invited to.

- **Existing $CLOUD_LONG user**:
  1. In the invitation email, click **Accept Invite**.

     $CLOUD_LONG opens and you are added to the project.

- **Enterprise $CLOUD_LONG user**:
  1. In the invitation email, click **Use your company identity provider to log in to Timescale**.

     $CLOUD_LONG opens and you are added to the project.


## Resend a project invitation

Project invitations are valid for 7 days. To resend a project invitation:

<Procedure>

1.  In [$CONSOLE][cloud-login], click `Invite users`.
    ![Resend a user invitation $CONSOLE](https://assets.timescale.com/docs/images/console-resend-invitation.png)
1.  Next to the person you want to invite to your project, click `Resend invitation`.

</Procedure>

## Change the current project

To change the project you are currently working in:

<Procedure>

1. In [$CONSOLE][cloud-login], click `Timescale Project`, then `Current project`.
   ![Change project in $CONSOLE](https://assets.timescale.com/docs/images/console-change-project.png)
2. Select the project you want to use.

You can now manage the users and services in this project

</Procedure>

## Transfer project ownership

Each project in $CONSOLE has one `owner`. As the project owner, you have rights to
add and delete users, edit project settings, and transfer the owner role to another user. When you transfer
ownership to another user, you lose ownerships rights.

To transfer project ownership:

<Procedure>

1.  In [$CONSOLE][cloud-login], click `Invite users`.
2.  Next to the person you want to transfer project ownership to, click `⋮`.
    ![Transfer project ownership in $CONSOLE](https://assets.timescale.com/docs/images/console-transfer-ownership.png)
    If you are unable to transfer ownership, hover over the greyed out button to see details.
3.  Enter your password, and click `Verify`.
4.  Complete the two-factor authentication challenge and click `Confirm`.

</Procedure>

If you have the [Enterprise pricing plan][pricing-plans], and log in to Timescale using [SAML authentication][saml]
or have not enabled [two-factor authentication][2fa], [contact support](https://www.timescale.com/contact) to transfer
project ownership.


## Leave a project

To stop working in a project:

<Procedure>

1. In [$CONSOLE][cloud-login], click `Invite users`.
1. Click `Leave project`, then click `Leave`.
   ![Leave project in $CONSOLE](https://assets.timescale.com/docs/images/console-leave-project.png)

Your account is removed from the project immediately, you can no longer access this project.

</Procedure>


## Remove users from a project

To remove a user's access to a project:

<Procedure>

1.  In [$CONSOLE][cloud-login], click `Invite users`.
1.  Next to the person you want to remove, click `⋮`, then click the trash can icon.
    ![Remove a user in $CONSOLE](https://assets.timescale.com/docs/images/console-remove-user.png)
1.  In `Remove user`, click `Remove`.

The user is deleted immediately, they can no longer access your project.

</Procedure>


[cloud-login]: https://console.cloud.timescale.com/
[saml]: /use-timescale/:currentVersion:/security/saml/
[2fa]: /use-timescale/:currentVersion:/security/multi-factor-authentication/
[cloud-login]: https://console.cloud.timescale.com/
[sign-up]: https://console.cloud.timescale.com/
[pricing-plans]: /about/:currentVersion:/pricing-and-account-management/
[join-a-project]: /use-timescale/:currentVersion:/members/#join-a-project
