# Billing - Account management
If you haven't yet added a payment method, you can add one in this section. You
can also update to a new credit card here. 

## Add, update, or delete a payment method
You can add up to three credit cards to the `Wallet` and set one of the cards as
`primary` for payments. If you want to delete the last card in the `Wallet`, you
have to first delete all the services and then schedule the last card to be
deleted at the end of the month. However, if you are still on trial, you can 
delete the card in the `Wallet` without deleting the services.
<procedure>

### Adding, updating, or deleting a payment method
1.  [Log in to your Timescale Cloud account][cloud-login] and navigate to
    the `Billing` details section.
1.  In the `Wallet` section, click `Add payment method`. If you already have
    three credit cards saved in the payment methods, you need to delete at least
    one of them before you start. Click the trash can icon to delete your saved
    credit card.
1.  Type your credit card details, and click `Continue`.
    The `Add payment method: billing address` page appears.
1.  Type your billing and company addresses. The company address is
    required to determine any applicable sales tax.
    * If your billing address is the same as your company address, select
      `Billing  address is the same as company address`, and click `Save`.
    * If your billing address is not the same as your company address, click
      `Continue`. Type your company address, and click `Save`.        
1.  Confirm your new credit card is saved by checking the details on the
    `Billing` page.
    You can update your billing address and company address by clicking the edit
    icon in the `primary` payment method. However, you can only edit the billing
    address on other payment methods.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/add_credit_card.png" alt="Adding a payment method in Timescale Cloud"/>

<highlight type="note">
The first credit card that you add to the payment method is set as the `Primary
payment method`, by default. After you add other cards to the payment method,
click `Set as primary` to set that card as primary for payments.
</highlight>

</procedure>

<highlight type="note">
The first charge on your new credit card is for the period from the date you
added the card, to the end of that calendar month. After that, all payment
confirmations are for usage from the first of the month, to the last day of the
month.
</highlight>

## Add or update your billing email address
By default, your Timescale Cloud payment confirmations are sent to the email
address that you used when you signed up. This is also the address that receives
alerts about your Timescale Cloud services. If you want your payment
confirmations to also go to a different email address, for example the email
address for your finance department, you can add it in the `Billing` details
section.

<highlight type="note">
When you add a billing email address, payment confirmations are sent to both the
email address you add, and the original email address that you signed up with.
</highlight>

<procedure>

### Adding a billing email address
1.  [Log in to your Timescale Cloud account][cloud-login] and navigate to
    the `Billing` details section.
1.  In the `Payment emails` tab, click `Add New Email`.
1.  Type the email address that you want Timescale Cloud payment confirmations
    sent to, and click `Add email`. A confirmation email is sent to the email
    address you entered.
1.  Follow the instructions in the confirmation email to confirm the email
    address. Another email is sent to the address you signed up with to notify
    that the new email address is saved.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tsc-add-billing-email.png" alt="Adding a new billing email address in Timescale Cloud"/>

</procedure>

[cloud-login]: https://console.cloud.timescale.com/
