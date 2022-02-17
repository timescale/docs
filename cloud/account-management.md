# Account management
You can manage billing for your Timescale Cloud account by navigating to the
`Billing` details section in your Cloud console. From here, you can see your
monthly usage, past payments you have made, the estimated cost of your next
payment confirmation, and your current payment method.

## About Timescale Cloud billing
Timescale Cloud payment confirmations are issued on the first day of every
month, and cover usage of your Timescale Cloud services for the entire calendar
month. By default, your payment confirmation is sent to the email address you
registered your account with. If you want to set a different billing email
address, you can do so on the `Billing` details page, see instructions in this
section.

The billing email you receive at the end of each calendar month includes a PDF
copy of your payment confirmation for your own records. The PDF includes
information on the services you have used through the month, broken down into
storage, compute, and VPC hourly consumption.

You can see previously issued payment confirmations on the `Billing` details
page, in the `Past Payments` section. If a payment could not be processed,
payment confirmations in this section display an error asking you to review the
payment method.

When you open a new Timescale Cloud account, the first 30 days are free for
you to use. During the trial, a payment confirmation is issued on the last day
of the calendar month for the value of the services you have used, with a
discount applied to bring the payment confirmation total to $0.00. If the
entirety of your consumption for the month was within the trial, you do not
receive an emailed payment confirmation, but the payment confirmation is
available to download in the `Past Payments` section.

## Add or change payment methods
If you haven't yet added a payment method, you can add one in this section. You
can also update to a new credit card here.

<procedure>

### Adding or changing a payment method
1.  [Log in to your Timescale Cloud account][cloud-login] and navigate to
    the `Billing` details section.
1.  Click `Add a payment method`. If you already have a payment method saved,
    you need to delete it before you start. Click the trash can icon to delete
    your saved credit card.
1.  Type your credit card details, and click `Add billing address`.
1.  Type your address, and click `Save payment method`.
1.  Confirm your new credit card is saved by checking the details on
    the `Billing` page.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/add_credit_card.png" alt="Adding a payment method in Timescale Cloud"/>

<highlight type="note">
The first charge on your new credit card is for the period from the date you
added the card, to the end of that calendar month. After that, all payment
confirmations are for usage from the first of the month, to the last day of the
month.
</highlight>

</procedure>

## Add or change your billing email address
By default, your Timescale Cloud payment confirmations are sent to the email
address that you used when you signed up. This is also the address that receives
alerts about your Timescale Cloud services. If you want your payment
confirmations to also go to a different email address, for example the email address
for your finance department, you can add it in the `Billing` details section.

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
