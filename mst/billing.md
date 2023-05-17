---
title: Billing on Managed Service for TimescaleDB
excerpt: Billing and account management in Managed Service for TimescaleDB
products: [mst]
keywords: [billing, invoicing, accounts]
---

# Billing

By default, all new Managed Service for TimescaleDB services require a credit
card, which is charged at the end of the month for all charges accrued over that
month. Each project is charged separately. Your credit card statement records
the transaction as coming from Aiven, as Aiven provides billing services for
Managed Service for TimescaleDB.

Managed Service for TimescaleDB uses hourly billing. This charge is
automatically calculated, based on the services you are running in your
project. The price charged for your project includes:

*   Virtual machine
*   Networking
*   Backups
*   Setting up

<Highlight type="note">
Managed Service for TimescaleDB does not charge you for network traffic used by
your service. However, your application cloud service provider might charge you
for the network traffic going to or from your service.
</Highlight>

Terminating or powering a service down stops the accumulation of new charges
immediately. However, the minimum hourly charge unit is one hour. For example,
if you launch a Managed Service for TimescaleDB service and shut it down after
40 minutes, you are charged for one full hour.

Migrating to different service plan levels does not incur extra charges for the
migration itself. Note, though, that some service plan levels are more costly
per hour, and your new service is charged at the new rate.

Migrating a service to another cloud region or different cloud provider does not
incur extra charges.

<Highlight type="note">
All prices listed for Managed Service for TimescaleDB are inclusive of credit
card and processing fees. However, in some cases, your credit card provider
might charge additional fees, such as an international transaction fee. These
fees are not charged by Timescale or Aiven.
</Highlight>

## Taxation

Aiven provides billing services for Managed Service for TimescaleDB. These
services are provided by Aiven Ltd, a private limited company incorporated in
Finland.

If you are within the European Union, Finnish law requires that you are charged
a value-added tax (VAT). The VAT percentage depends on where you are domiciled.
For business customers in EU countries other than Finland, you can use the
reverse charge mechanism of 2006/112/EC article 196, by entering a valid VAT ID
into the billing information of your project.

If you are within the United States, no tax is withheld from your payments. In
most cases, you do not require a W-8 form to confirm this, however, if you
require a `W-8BEN-E` form describing this status, you can
[request one][timescale-support].

If you are elsewhere in the world, no taxes are applied to your account,
according to the Value-Added Tax Act of Finland, section 69&nbsp;h.

## Corporate billing

If you prefer to pay by invoice, or if you are unable to provide a credit card
for billing, you can switch your project to corporate billing instead. Under
this model, invoices are generated at the end of the month based on actual
usage, and are sent in `.pdf` format by email to the billing email addresses you
configured in your dashboard.

Payment terms for corporate invoices are 10 days net, by bank transfer, to the
bank details provided on the invoice. By default, services are charged in US
Dollars (USD), but you can request your invoices be sent in either Euros (EUR)
or Pounds Sterling (GBP) at the invoice date's currency exchange rates.

To switch from credit card to corporate billing, make sure your billing profile
and email address is correct in your project's billing settings, and send a message
to the [Timescale support team][timescale-support] asking to be changed to corporate
billing.

[timescale-support]: https://www.timescale.com/contact/
