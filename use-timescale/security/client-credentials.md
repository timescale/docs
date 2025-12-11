---
title: Client credentials
excerpt: Tiger Cloud lets you use client credentials to programmatically access resources instead of using username and password. Set up client credentials in Tiger Cloud Console
products: [cloud]
keywords: [client credentials, accounts, prgrammatic access]
tags: [authentication tokens]
---

# Client credentials

You can use client credentials to programmatically access resources instead
of using your username and password. You can generate multiple client
credentials for different applications or use cases rather than a single set of
user credentials for everything.

## Create client credentials

When you create client credentials, a public key and a private key are generated.
These keys act as the username and password for programmatic client
applications. It is important that you save these keys in a safe place. You can
also delete these client credentials when the client applications no longer need
access to $CLOUD_LONG resources. For more information about obtaining an access
token programmatically, see the 
[$CLOUD_LONG Terraform provider documentation][terraform-provider].

<Procedure>

1.  Log in to [$CONSOLE][cloud-login] and click `Settings`.
1.  Click `Create credentials`.
1.  In the `New client credentials` dialog, you can view the `Public key` and the
    `Secret Key`.
    Copy your secret key and store it in a secure place. You won't be able to
    view the `Secret Key` again in $CONSOLE.
1.  Click `Done`.
    You can use these keys in your client applications to access $CLOUD_LONG
    resources inside the respective $PROJECT_SHORT.
    $CLOUD_LONG generates a default `Name` for the client credentials.
1.  Click the ⋮ menu and select `Rename credentials`.
1.  In the `Edit credential name` dialog, type the new name and click `Accept`.

</Procedure>

## Delete client credentials

<Procedure>

1.  Log in to [$CONSOLE][cloud-login] and click `Settings`.
1.  Click the ⋮ menu of the client credential,
    and select `Delete`.
1.  In the `Are you sure` dialog, type the name of the client credential, and
    click `Delete`.

</Procedure>

[cloud-login]: https://console.cloud.timescale.com/
[terraform-provider]: https://registry.terraform.io/providers/timescale/timescale/latest/docs
