---
title: Client credentials
excerpt: Client credentials to programmatically access your Timescale account
product: cloud
keywords: [client credentials, accounts, prgrammatic access]
tags: [authentication tokens]
---

# Client credentials

You can use client credentials to programmatically access resources instead
of using your username and password. You can generate multiple client
credentials for different applications or use cases rather than a single set of
user credentials for everything.

## Creating client credentials

When you create client credentials, a public key and a private key is generated.
These keys act as the username and password for programmatic client
applications. It is important that you save these keys in a safe place. You can
also delete these client credentials when the client applications no longer need
access to Timescale resources.

<Procedure>

### Creating client credentials

1.  [Log in to your Timescale account][cloud-login].
1.  Navigate to the `Project Settings` page to create client credentials for
    your project.
1.  In the `Project Settings` page, click `Create credentials`.
1.  In the `New client credentials` dialog, you can view the `Public key` and the
    `Secret Key`.
    Copy your secret key and store it in a secure place. You won't be able to
    view the `Secret Key` again in the console.
1.  Click `Done`.
    You can use these keys in your client applications to access Timescale
    resources inside the respective project.
    Timescale generates a default `Name` for the client credentials.
1.  Click the ⋮ menu and select `Rename credentials`.
1.  In the  `Edit credential name` dialog, type the new name and click `Accept`.

</Procedure>

### Deleting client credentials

<Procedure>

1.  [Log in to your Timescale account][cloud-login].
1.  Navigate to the `Project Settings` page to view client credentials for
    your project.
1.  In the `Project Settings` page, click the ⋮ menu of the client credential,
    and select `Delete`.
1.  In the `Are you sure` dialog, type the name of the client credential, and
    click `Delete`.

</Procedure>

[cloud-login]: https://console.cloud.timescale.com/
