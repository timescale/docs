---
title: Multi-factor user authentication
excerpt: Manage Multi-factor user authentication for your Timescale account
products: [cloud]
keywords: [mfa, accounts, admin]
tags: [two-factor user authentication]
---

# Multi-factor user authentication

You can use two-factor authentication to log in to your $COMPANY account.
Two-factor authentication, also known as two-step verification or 2FA, enables
secure logins that require an authentication code in addition to your user
password. The code is provided by an authenticator app on your mobile device. There are multiple authenticator apps available. 
This page describes how to configure two-factor authentication with Google Authenticator.

## Prerequisites

Before you begin, make sure you have:

*   Installed the [Google Authenticator application][install-google-authenticator]
    on your mobile device.

## Configure two-factor authentication with Google Authenticator

Take the following steps to configure two-factor authentication:

<Procedure>

1.  [Log in][cloud-login] to your $COMPANY account.
1.  Click the `User name` icon in the bottom left of $CONSOLE and select `Account`.
1.  In the `Account` page, click `Add two-factor authentication`.
1.  On your mobile device, open Google Authenticator, tap `+`, and select
    `Scan a QR code`.
1.  On your mobile device, scan the QR code provided by $COMPANY in the
    `Connect to an authenticator app` dialog and click `Next`.
1.  In the dashboard, type the verification code provided by Google
    Authenticator, and click `Next`.
1.  In the `Save your recovery codes` dialog, copy, download, or print the
    recovery codes, and save them in a safe place. These are used to recover
    your account if you lose your device.
1.  Verify that you have saved your recovery codes, by clicking `OK, I saved my
    recovery codes`.
1.  If two-factor authentication is enabled correctly, an email notification is
    sent to you.

</Procedure>

<Highlight type="warning">
If you lose access to the mobile device you use for multi-factor authentication,
and you do not have access to your recovery codes, you cannot sign in to your
$COMPANY account. To regain access to your account,
contact [support@timescale.com](mailto:support@timescale.com).
</Highlight>

## Regenerate recovery codes

If you do not have access to your authenticator app and need to log in to
$CONSOLE, you can use your recovery codes. Recovery codes are single-use. If you've used all 10
recovery codes, or lost access to them, you can generate another list. Generating a new list invalidates all previously generated codes.

<Procedure>

1.  [Log in][cloud-login] to your $COMPANY account.
1.  Click the `User name` icon in the bottom left and select `Account`.
1.  In the `Account` page, navigate to the `Two-factor authentication` section.
1.  Click `Regenerate recovery codes`.
1.  In the `Two-factor authentication` dialog, type the verification code from
    your authenticator app.
    Alternatively, if you do not have access to the authenticator application,
    click `Use recovery code instead` to type the recovery code.
1.  Click `Next`.
1.  In the `Save your recovery codes` dialog, copy, download, or print the
    recovery codes, and save them in a safe place. These are used to recover
    your account if you lose your device.
1.  Verify that you have saved your recovery codes, by clicking `OK, I saved my recovery codes`.

</Procedure>

## Remove two-factor authentication

If you need to enroll a new device for two-factor authentication, you can
remove two-factor authentication from your account and then add it
again with your new device.

<Procedure>

1.  [Log in][cloud-login]  to your $COMPANY account.
1.  Click the `User name` icon in the bottom left of $CONSOLE and select `Account`.
1.  In the `Account` page, navigate to the `Two-factor authentication` section.
1.  Click `Remove two-factor authentication`.
1.  In the `Are you sure` dialog, type the verification code from your
    authenticator app. Alternatively click `Use recovery code instead` to type the
    recovery code.
1.  Click `Remove`.

</Procedure>

[cloud-login]: https://console.cloud.timescale.com/
[install-google-authenticator]: https://support.google.com/accounts/answer/1066447
