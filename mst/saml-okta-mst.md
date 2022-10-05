---
title: Setting up SAML authentication with Okta
excerpt: Learn how to make corporate level configuration like the authentication setup on Managed Service for TimescaleDB 
product: mst
---

# Set up authentication

SAML (security assertion markup language) is a standard for exchanging authentication
and authorization data between an identity provider and a service provider. You can operate
it with MST so that you and your collaborators can use your preferred authentication service.

## Before you begin

1.  Create a new authentication method in MST.
1.  Create the Okta application and assign users to it.

<procedure>

## Creating a new authentication method

1.  Log in to your [MST account] [mst-login].

1.  Under `PROJECT` in the top left, click the drop down arrow and select `See all projects & accounts`.

1.  Click the `Account` you want to edit, or create a new one.

1.  In the `Account page`, select the `Authentication` tab.

1.  Click `Add Authentication Method`. Set the `Method Name` as `<OKTA>` and
    `Method Type` as `SAML`.

1.  Choose the team to add invited people or leave the field blank and click `Add`.

1.  The system shows two parameters required to set up SAML 
    authentication in your identity provider: `Metadata URL` and `ACS URL`.

</procedure>

## Creating the Okta application and assigning users

This is a two step process. First create the SAML SP-initiated
authentication flow, then create a bookmark app that redirects to
the Managed Service for TimescaleDB login page.

<procedure>

1.  Log in to the `Admin` portal and navigate to the `Applications` tab.

1.  Click `Add Application` and click `Create New App`. You should see
    the `Create a new Application Integration` form.

1.  Select `SAML 2.0` for the `Sign on method`, and click `Create`.

1.  In the `Create SAML Integration` set the `App name`, `App logo`, and `App visibility`,
    then click `Next`.

1.  Update the `Configure SAML` page with these values:
    *   Single sign on URL:
   `https://api.timescale.io/v1/sso/saml/account/{account_id}/method/{account_authentication_method_id/acs`
   The value in Timescale Console on the newly created `Authentication method`
   page.
    *   Audience URI (SP Entity ID):
    `https://api.timescale.io/v1/sso/saml/account/{account_id}/method/{account_authentication_method_id}/metadata`
   The value in Timescale Console on the newly created `Authentication method` page.
    *   Default Relay State:`https://portal.managed.timescale.com/`
    The homepage of the MST Console and is fundamental for IdP initiated sign-on
    to function correctly.

1.  In the `ATTRIBUTE STATEMENTS`should have an entry with these values:

   |Parameter|Example value|
   |-|-|
   |name|`email`|
   |value|`user.email`|

1.  Click `Next`, then click Finish`. You are redirected to your application in Okta.

1.  In the `Assignments` tab of the Okta application, click Assign` to assign
    users or groups to the application.

1.  In the `Sign On` tab of the Okta application, click `View Setup Instructions`
    and gather the required information to configure Okta in MST.
1.  Download the Certificate file to configure Okta in MST.

</procedure>

## Set up the Okta Application in Managed Service for TimescaleDB

<procedure>

1.  Log in to your [MST account] [mst-login].
1.  In the `Authentication` tab of the `Account page, finalize the configuration.
1.  In the `SAML Certificate` field, add the Certificate file.
1.  Check `Enable IdP Login`, and `Enable authentication method`.
1.  Click `Edit methd` to save the settings.

</procedure>

You can now use the `Account Link URL` on the authentication configuration page
to link your Okta account and MST profile. You can also invite other members of
your team to log in or sign up to MST using Okta with the sign up link shown in
the `Authentication method` page.

## Troubleshooting

### Authentication failed

When launching MST SAML application getting the following error::

   ```bash
   Authentication Failed

   Login failed.  Please contact your account administrator for more details.
   ```

Check Okta authentication in MST console if `Enable IdP login` and `Enable authentication method` are
enabled.

### Invalid `RelayState`

If you get the `Invalid RelayState`, then you are attempting an IdP-initiated
auth flow, for example by clicking the MST SAML app from the Okta UI.
Previously, MST did not support IdP-initiated flows, but now it is possible if
you set the `Default RelayState` in Okta to the corresponding console of your
account.

### [The Okta password does not work

Make sure to use the `Account Link URL` to add the Okta Authentication method to
your MST profile.

After it is linked, you should get the choice of multiple sign-in methods as
well as see the other Authentication method in `User Information`->
`Authentication` section on the [MST account] [mst-login].

[mst-login]: https://portal.managed.timescale.com
