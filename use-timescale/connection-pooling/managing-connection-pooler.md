---
title: Managing connection pooler
excerpt: Add, delete, and manage your connection pooler
products: [cloud]
keywords: [connection pooling, connection pooler, pooler, connections]
cloud_ui:
    path:
        - [services, :serviceId]
---

import PoolingIntro from "versionContent/_partials/_early_access.mdx";
import EarlyAccess from "versionContent/_partials/_early_access.mdx";

# Managing a connection pooler

<PoolingIntro />

<EarlyAccess />

## Add a connection pooler

When you create a new service, you have the option to also create a connection
pooler. Alternatively, you can add a connection pooler to an existing service in
the Timescale portal.

<Procedure>

### Adding a connection pooler

1.  [Log in to the Timescale portal][cloud-login] and click the service
    you want to add a connection pooler to.
1.  In the `Connection info` section, navigate to the `Connection pooler` tab,
    and click `Add connection pooler`.
1.  When the pooler has been added, your pooler connection details are displayed
    in the `Connection pooler` tab. Use this information to connect to your
    pooler.
1.  By default, your pooler is started as a session pool. You can change this to
    a transaction pool by selecting it from the drop-down menu. For more
    information about the different pool types, see the
    [About connection pooling][about-connection-pooling-types] section.

    <img class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/connection_pooler.webp"
    width={1375} height={944}
    alt="Timescale Service Connection Info section, the Connection Pooler tab, showing information for a transaction pool" />

</Procedure>

## Removing a connection pooler

If you no longer need a connection pooler, you can remove it in the Timescale
portal. When you have removed your connection pooler, make sure that you also
update your application to adjust the port it uses to connect to your service.

<Procedure>

### Removing a connection pooler

1.  [Log in to the Timescale portal][cloud-login] and click the service
    you want to remove a connection pooler from.
1.  In the `Connection info` section, navigate to the `Connection pooler` tab,
    and click `Remove connection pooler`.
1.  Confirm that you want to remove the connection pooler.

    <Highlight type="note">
    After you have removed a pooler, if you add it back in the future, it uses the
    same connection string and port that was used before.
    </Highlight>

</Procedure>

[cloud-login]: https://console.cloud.timescale.com
