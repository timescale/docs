# Metrics and Datadog
For those already or interested in using Datadog, detailed Timescale Cloud service metrics can easily be sent to Datadog with just a few clicks. We've put together a quick guide to get you started. But first, what exactly is Datadog?

What is Datadog?
Datadog is a popular cloud-based monitoring service that allows various metrics to be sent to it via special metrics collection agent software installed on servers.

It provides easy-to-use graphing functionality as well as the ability to arrange multiple graphs into service dashboards, alerting, logging functionality and so on.

Timescale + Datadog
Enabling Datadog metrics for Timescale Cloud services only involves two simple steps:

Create and enter a Datadog API key

Enable Datadog metrics for the Timescale Cloud service you want metrics for

1. Create and enter your Datadog API key
First, you will need to create an API key in Datadog. Log into Datadog and select Integrations ==> APIs from the side menu:


If you have any, you can pick an existing API key, but for this example we will create a new Timescale-specific API key.

Enter a description for the new key, click the Create API key button, and a 32 character API key is created:


We will need the hexadecimal value under the Key column, so copy it for pasting into Timescale Cloud:


Next, go to your Timescale Cloud account, make sure the correct Timescale Cloud project is active, and choose Service Integrations from the left menu bar.

Name your Datadog key and paste the hexadecimal API key to the API key field:


Click the Add your Datadog API key button and we're almost done. Now, we'll activate Datadog metrics for the Timescale Cloud services of your choice.

2. Activate Datadog for Timescale Cloud services
First, navigate to Services in the Timescale Cloud web console and click a service to open a detailed view for it:


NOTE: If there is a maintenance update available named "Datadog metrics support" available for your service, it will need to be applied before Datadog can be enabled for the service.

Next, click the Manage button under Service integrations and a dialog with the available service integrations opens:


Lastly, click the Enable button to turn on Datadog metrics for this service and that's it!


Note: it may take a minute or two for Datadog to start displaying the metrics for the service.

Setting up Datadog dashboards

On Datadog dashboard editor, add a new widget (or edit existing one). Select a metric (for example, for Kafka service jvm.heap_memory ), and Datadog will autocomplete various tags to from  field. You can select multiple filters; for example, timescale-service-type:kafka  and timescale-project:prod . After configuring the graph, click Done, and remember to save the dashboard as well.

FAQ

Does this affect my billing?
No. using the Datadog integration does not affect Timescale Cloud billing.

Do note though that Datadog will still charge for the integration's metrics based on their regular pricing. The costs incurred from Datadog are solely your responsibility as the Datadog account owner.

Is Datadog logging supported?

Datadog logging is not currently supported.
