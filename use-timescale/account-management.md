---
title: Billing - Account management
excerpt: Manage billing information for your Timescale account
products: [cloud]
keywords: [billing, accounts, admin]
tags: [payment]
cloud_ui:
    path:
        - [billing, details]
---

# Billing and account management

If you haven't yet added a payment method, you can add one in this section. You
can also update to a new credit card here.

<Highlight type="important">
If you prefer to pay by invoice, or if you are unable to provide a credit card
for billing, you can switch your project to corporate billing instead. To switch
from credit card to corporate billing, contact Support by clicking the `Support`
button in the Timescale console and ask to be changed to corporate billing.
</Highlight>

## Add, update, or delete a payment method

You can add up to three credit cards to the `Wallet` and set one of the cards as
`primary` for payments. If you want to delete the last card in the `Wallet`, you
have to first delete all the services and then schedule the last card to be
deleted at the end of the month. However, if you are still on trial, you can
delete the card in the `Wallet` without deleting the services.

<Procedure>

### Adding, updating, or deleting a payment method

1.  [Log in to your Timescale account][cloud-login] and navigate to
    the `Billing` details section.
2.  In the `Wallet` section, click `Add payment method`. If you already have
    three credit cards saved in the payment methods, you need to delete at least
    one of them before you start. Click the trash can icon to delete your saved
    credit card.
3.  Type your credit card details, and click `Continue`.
    The `Add payment method: billing address` page appears.
4.  Type your billing and company addresses. The company address is
    required to determine any applicable sales tax.
    *   If your billing address is the same as your company address, select
      `Billing  address is the same as company address`, and click `Save`.
    *   If your billing address is not the same as your company address, click
      `Continue`. Type your company address, and click `Save`.
5.  Confirm your new credit card is saved by checking the details on the
    `Billing` page.
    You can update your billing address and company address by clicking the edit
    icon in the `primary` payment method. However, you can only edit the billing
    address on other payment methods.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-add-creditcard.png" alt="Adding a payment method in Timescale"/>

</Procedure>

The first credit card that you add to the payment method is set as the `Primary
payment method`, by default. After you add other cards to the payment method,
click `Set as primary` to set that card as primary for payments.

<Highlight type="note">
The first charge on your new credit card is for the period from the date you
added the card, to the end of that calendar month. After that, all payment
confirmations are for usage from the first of the month, to the last day of the
month.
</Highlight>

## Add or update your billing email address

By default, your payment confirmations are sent to the email
address that you used when you signed up. This is also the address that receives
alerts about your Timescale services. If you want your payment
confirmations to also go to a different email address, for example the email
address for your finance department, you can add it in the `Billing` details
section.

<Highlight type="note">
When you add a billing email address, payment confirmations are sent to both the
email address you add, and the original email address that you signed up with.
</Highlight>

<Procedure>

### Adding a billing email address

1.  [Log in to your Timescale account][cloud-login] and navigate to
    the `Billing` details section.
1.  In the `Payment emails` tab, click `Add New Email`.
1.  Type the email address that you want  payment confirmations
    sent to, and click `Add email`. A confirmation email is sent to the email
    address you entered.
1.  Follow the instructions in the confirmation email to confirm the email
    address. Another email is sent to the address you signed up with to notify
    that the new email address is saved.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-add-billing-email.png" alt="Adding a new billing email address in Timescale"/>

</Procedure>

## Add or update your company details

By default, your company name and address is set to be the same as that used for
your payment method. You can change your company name and address in the
`Billing` details section.

<Procedure>

### Adding or updating your company name and address

1.  [Log in to your Timescale account][cloud-login] and navigate to
    the `Billing` details section.
2.  In the `Billing details` tab, locate the `Company info` section and click
    the pencil icon.
3.  Complete the company name and address information, and click `Save`.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc_edit_companyinfo.png" alt="Adding or updating the company name and address in Timescale"/>

</Procedure>

[cloud-login]: https://console.cloud.timescale.com/
