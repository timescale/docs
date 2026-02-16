import BillingForInactiveServices from "versionContent/_partials/_billing-for-inactive-services.mdx";

You are billed at the end of each month in arrears. Your monthly invoice
includes an itemized cost accounting for each $SERVICE_LONG and any additional charges.

$CLOUD_LONG charges are based on consumption and your pricing plan:

- **Compute**: billed and metered on an hourly basis. This means that you are billed for a full hour even if the actual consumption is less. You can scale compute up and down at any time. If the compute config changes mid-hour, you are billed for the config used at the end of that hour.
- **Storage**: billed and metered on a quarter of an hour basis. Storage grows and shrinks automatically with your data.

For example, over the last month your $SERVICE_LONG has been running compute for 500 hours total:

- 375 hours with 2 CPU
- 125 hours 4 CPU

and consumed high-performance storage for 720 hours total:

- 200 hours with 100 GB
- 520 hours with 150 GB

**Compute cost** = (`375` x `hourly price for 2 CPU`) + (`125` x `hourly price for 4 CPU`)

**High-performance storage cost** = (`200` x `100 GB` x `hourly price per GB`) + (`520` x `150 GB` x `hourly price per GB`)

Some add-ons such as tiered storage, HA replicas, and connection pooling may incur
additional charges. These charges are clearly marked in your billing snapshot in $CONSOLE.

<BillingForInactiveServices />
  