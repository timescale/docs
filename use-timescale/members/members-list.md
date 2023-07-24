---
title: Manage members
excerpt: Add or remove members from a project, or leave a project
products: [cloud]
keywords: [members, projects, admin, roles]
tags: [users]
cloud_ui:
    path:
        - [members]
---

# Members

When you log in to your [Timescale account][cloud-login], navigate to the
`Members` page to manage users of your project. From here, you can see the
current members of your Timescale project, and add and remove members.

## Add or remove members

You can add members to your project group from the `Members` section in your
Cloud console. The new member does not need to have a Timescale account
before you add them. If they do not yet have an account, they are prompted to
create one.

<Procedure>

### Adding members to a project group

1.  [Log in to your Timescale account][cloud-login] and navigate to
    the `Members` section.
1.  Click `Add new user`.
1.  Type the email address of the person that you want to add, and click `Add
    user`. A confirmation email is sent to the email address you entered.
1.  Follow the instructions in the confirmation email to confirm the email
    address. Alternatively, the new member can sign in to a Timescale
    account with the invited email address, and accept the invitation by
    navigating to the `Invitations` section, and clicking `Accept`. For invitees
    that do not have a Timescale account, the invite is automatically
    accepted when they create a new account with the invited email address.
1.  The new project member can switch to the shared project by selecting it from
    the `Project` drop-down menu.

<img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tsc-add-members.webp" alt="Adding a new member to a project in Timescale"/>

</Procedure>

<Procedure>

### Removing members from a project group

1.  [Log in to your Timescale account][cloud-login] and navigate to
    the `Members` section.
1.  Locate the member you want to remove in the list, and click the trash can
    icon.
1.  Confirm the deletion by clicking `Remove`.
1.  The member is deleted from the project immediately, and can no longer switch
    to the shared project.

</Procedure>

<Procedure>

### Leaving a project group

1.  [Log in to your Timescale account][cloud-login] and navigate to
    the `Members` section.
1.  Click `Leave project`.
1.  Confirm the action by clicking `Leave`.
1.  Your account is removed from the project immediately, and you can no longer
    switch to the shared project.

<img class="main-content__illustration"
src="https://assets.timescale.com/docs/images/tsc-leave-members.webp"
alt="Leaving a project in Timescale"/>

</Procedure>

[cloud-login]: https://console.cloud.timescale.com/
