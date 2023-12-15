---
title: Manage project ownership
excerpt: Add or remove members from a project, or leave a project
products: [cloud]
keywords: [members, projects, admin, roles]
tags: [users]
cloud_ui:
    path:
        - [members]
---

# Project Ownership

There must be one `Owner` in a project at any given time. Project ownership grants you the ability to remove any member from the project.
<Procedure>

### Project Ownership transfer

If you are the `Owner` of a project, and have a [two-factor authentication][2fa] method enabled, you can 
transfer project ownership to another `Member` of the project. You will lose your ownership rights in the operation.

1.  [Log in to your Timescale account][cloud-login] and navigate to
    the `Members` section.
2.  Click the ⋮ menu next to the person you want to transfer project ownership to. 
    If you are unable to make this action at this time, hovering the greyed out button will explain why.
3.  Enter your password, and click `Verify`.
4.  Complete the proposed two-factor authentication challenge and click `Confirm`.

<img class="main-content__illustration"
width={1375} height={944}
src="https://assets.timescale.com/docs/images/tsc-transfer-ownership.webp"
alt="Transfer ownership of a project in Timescale"/>

</Procedure>

<Highlight type="note">

If you don't have two-factor authentication or login to Timescale using an [SAML authentication][saml], this option is unavailable to you and on hovering a tooltip will tell so.
Instead you can [reach out](https://www.timescale.com/contact) to have this action done.

</Highlight>

[cloud-login]: https://console.cloud.timescale.com/
[saml]: /use-timescale/:currentVersion:/security/saml/
[2fa]: /use-timescale/:currentVersion:/security/multi-factor-authentication/