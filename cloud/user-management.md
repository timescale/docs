# User management
You can manage users for your Timescale Cloud account by navigating to the
`Members` section in your Cloud console. From here, you can see the current
members of your Timescale Cloud project, and add and remove members.

## About Timescale Cloud user management
Timescale Cloud allows you to collaborate with other users on your projects.
When you have created your project, you can add other users so that they can see
your project in their Timescale Cloud console. You can add, manage, and delete
users from the `Members` section of the Cloud console.

You are assigned an `Administrator` role for projects that you create,
and have the ability to add and delete other users, as well as change the
project name. If you have been added to a project, you are assigned a `Member`
role.

## Add or remove members
You can add members to your project group from the `Members` section in your
Cloud console.  The new member does not need to have a Timescale Cloud account
before you add them. If they do not yet have an account, they are prompted to
create one.

<procedure>

### Adding members to a project group
1.  [Log in to your Timescale Cloud account][cloud-login] and navigate to
    the `Members` section.
1.  Click `Add New Member`.
1.  Type the email address of the person that you want to add. A confirmation
    email is sent to the email address you entered.
1.  Follow the instructions in the confirmation email to confirm the email
    address. Alternatively, the new member can sign in to a Timescale Cloud
    account with the invited email address, and accept the invitation by
    navigating to the `Invitations` section, and clicking `Accept`. For invitees
    that do not have a Timescale Cloud account, the invite is automatically
    accepted when they create a new account with the invited email address.
1.  The new project member can switch to the shared project by selecting it from
    the `Project` drop down menu.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-add-members.png" alt="Adding a new member to a project in Timescale Cloud"/>

</procedure>

<procedure>

### Removing members from a project group
1.  [Log in to your Timescale Cloud account][cloud-login] and navigate to
    the `Members` section.
1.  Locate the member you want to remove in the list, and click the trash can
    icon.
1.  Confirm the deletion by typing DELETE, and click `Delete`.
1.  The member is deleted from the project immediately, and can no longer switch
    to the shared project.

</procedure>

<procedure>

### Leaving a project group
1.  [Log in to your Timescale Cloud account][cloud-login] and navigate to
    the `Members` section.
1.  Click `Leave Project`.
1.  Confirm the action, and click `Leave`.
1.  Your account is removed from the project immediately, and you can no longer
    switch to the shared project.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-leave-members.png" alt="Leaving a project in Timescale Cloud"/>

</procedure>


[cloud-login]: https://console.cloud.timescale.com/
