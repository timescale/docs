---
title: Multi-factor user authentication
excerpt: Manage Multi-factor user authentication for your Timescale account
products: [cloud]
keywords: [mfa, accounts, admin]
tags: [two-factor user authentication]
---

# Multi-factor user authentication

You can use two-factor authentication to log in to your $COMPANY account. Two-factor authentication, also known as two-step verification or 2FA, enables
secure logins that require an authentication code in addition to your user
password. The code is provided by an authenticator app on your mobile device. There are multiple authenticator apps available. 

![Timescale Console 2FA](https://assets.timescale.com/docs/images/timescale-console-2fa.png)

This page describes how to configure two-factor authentication with Google Authenticator.

## Prerequisites

Before you begin, make sure you have:

*   Installed the [Google Authenticator application][install-google-authenticator]
    on your mobile device.

## Configure two-factor authentication with Google Authenticator

Take the following steps to configure two-factor authentication:

<Procedure>

1.  Log in to [$CONSOLE][cloud-login].
1.  Click the `User name` icon in the bottom left of $CONSOLE and select `Account`.
1.  In `Account`, click `Add two-factor authentication`.
1.  On your mobile device, open Google Authenticator, tap `+`, and select
    `Scan a QR code`.
1.  Scan the QR code provided by $CONSOLE in `Connect to an authenticator app` and click `Next`.
1.  In $CONSOLE, enter the verification code provided by Google Authenticator, and click `Next`.
1.  In `Save your recovery codes`, copy, download, or print the
    recovery codes. These are used to recover
    your account if you lose your device.
1.  Verify that you have saved your recovery codes, by clicking `OK, I saved my
    recovery codes`.
1.  If two-factor authentication is enabled correctly, an email notification is
    sent to you.

</Procedure>

<Highlight type="info">
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

1.  Log in to [$CONSOLE][cloud-login].
1.  Click the `User name` icon in the bottom left and select `Account`.
1.  In `Account`, navigate to `Two-factor authentication`.
1.  Click `Regenerate recovery codes`.
1.  In `Two-factor authentication`, enter the verification code from
    your authenticator app.
    Alternatively, if you do not have access to the authenticator app,
    click `Use recovery code instead` to enter a recovery code.
1.  Click `Next`.
1.  In `Save your recovery codes`, copy, download, or print the
    recovery codes. These are used to recover
    your account if you lose your device.
1.  Verify that you have saved your recovery codes, by clicking `OK, I saved my recovery codes`.

</Procedure>

## Remove two-factor authentication

If you need to enroll a new device for two-factor authentication, you can
remove two-factor authentication from your account and then add it
again with your new device.

<Procedure>

1.  Log in to [$CONSOLE][cloud-login].
1.  Click the `User name` icon in the bottom left of $CONSOLE and select `Account`.
1.  In `Account`, navigate to `Two-factor authentication`.
1.  Click `Remove two-factor authentication`.
1.  Enter the verification code from your authenticator app to confirm. Alternatively click `Use recovery code instead` to type the
    recovery code.
1.  Click `Remove`.

</Procedure>

[cloud-login]: https://console.cloud.timescale.com/
[install-google-authenticator]: https://support.google.com/accounts/answer/1066447
