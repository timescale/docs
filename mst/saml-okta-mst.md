---
title: Setting up SAML authentication with Okta
excerpt: Learn how to make corporate level configuration like the authentication setup on Managed Service for TimescaleDB 
product: mst
---

# Set up Security Assertion Markup Language (SAML) authentication with Okta

SAML is a standard for exchanging authentication and authorization data between
an identity provider and a service provider. You can operate it with MSTso that
you and your collaborators can use your company's favorite authentication
service.

The following is the procedure to setup SAML with `Okta <https://www.okta.com/>`.

## Before you begin

1.  Create a new authentication method in MST.
1.  Create the Okta application and assign users to the Okta application.

<procedure>

## Creating a new authentication method

1.  Login to the [MST account] [mst-login].

1.  Under `PROJECT` in the top left, click the drop down arrow and select `See all projects & accounts`.

1.  Click the `Account` you want to edit or create a new one.

1.  In the `Account page`, select the `Authentication` tab.

1.  Click `Add Authentication Method` and set the `Method Name` as `<OKTA>` and
    `Method Type` as `SAML`.

1.  Choose the team to add invited people or leave it blank and click `Add`.

1.  The two parameter `Metadata URL`, and `ACS URL` to setup the SAML
    authentication in your Identity Provider appears.

</procedure>

## Creating the Okta application and assigning users

This is a two step process. First create the SAML SP-Initiated
authentication flow, then create a bookmark app that redirects to
the Managed Service for TimescaleDB login page.

<procedure>

1.  Login to the `Admin` portal and navigate to the `Applications` tab.

1.  Click `Add Application` and click `Create New App` You should see
    the `Create a new Application Integration` form.

1.  Select `SAML 2.0` for the `Sign on method`, then click `Create`.

1.  In the `Create SAML Integration` set the `App name`, `App logo`, and `App visibility`,
    then click `Next`.

1.  Update the `Configure SAML` page with these values:
    |Parameter|Example value|Description|
   |-|-|-|
   |Single sign on URL|`https://api.timescale.io/v1/sso/saml/account/{account_id}/method/{account_authentication_method_id/acs`|
   The value in Timescale Console on the newly created `Authentication method` page.|
   |Audience URI (SP Entity ID)|`https://api.timescale.io/v1/sso/saml/account/{account_id}/method/{account_authentication_method_id}/metadata`|
   The value in Timescale Console on the newly created `Authentication method` page.|
   |Default Relay State|https://portal.managed.timescale.com/| is the homepage
   of the MST Console and is fundamental for IdP initiated sign-on to function
   correctly.|

1.  In the `ATTRIBUTE STATEMENTS`should have an entry with these values:

   |Parameter|Example value|
   |-|-|
   |name|`email`|
   |value|`user.email`|

1.  Click `Next` then `Finish`. You will be redirect to your application in Okta.

1.  In the `Assignments` tab of the application on Okta, click the `Assign` to assign
    users or groups to the application.

1.  In the `Sign On` tab of the application on Okta, click the `View Setup Instructions`
    and gather the required information to configure Okta in MST.
1.  Download the *Certificate file* that you require to configure Okta in MST.

</procedure>

## Set up the Okta Application in Managed Service for TimescaleDB

<procedure>

1.  Login to the [MST account] [mst-login].
1.  Finalize the configuration on the `Authentication` tab of the `Account page`.
1.  Add the *Certificate file* in the `SAML Certificate` field.
1.  Enable the `Enable IdP Login` and `Enable authentication method`.
1.  Click `Edit methd` to save the settings.

</procedure>

You can now use the `Account Link URL` on the authentication configuration page
to link your Okta account and MST profile. You can also invite other members of
your team to login or signup to MST using Okta with the **Signup link** shown in
the `Authentication method` page.

## Troubleshooting

### Authentication failed

When launching Aiven SAML application getting the following error::

   ```bash
   Authentication Failed

   Login failed.  Please contact your account administrator for more details.
   ```

Check Okta authentication in Aiven console if `Enable IdP login` and `Enable authentication method` are
enabled.

### Invalid `RelayState`

If you get the `Invalid RelayState`, then you are attempting an IdP-initiated
auth flow, for example by clicking the MST SAML app from the Okta UI.
Previously, MST did not support IdP-initiated flows, but now it is possible if
you set the `Default RelayState` in Okta to the corresponding console of your
account.

### The Okta password does not work

Make sure to use the `Account Link URL` to add the Okta Authentication method to your MST profile.

After it is linked, you should get the choice of multiple sign-in methods as well as see the other
Authentication method in `User Information`-> `Authentication` section on the [MST account] [mst-login].

mst-login]: <https://portal.managed.timescale.com>
