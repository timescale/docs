---
title: Install Timescale from cloud image
excerpt: Install self-hosted Timescale from a pre-built cloud image
products: [self_hosted]
keywords: [installation, self-hosted]
tags: [cloud image]
---

import WhereTo from "versionContent/_partials/_where-to-next.mdx";

# Install Timescale from a pre-built cloud image

You can install Timescale on a cloud hosting provider,
from a pre-built, publicly available machine image. These instructions show you
how to use a pre-built Amazon machine image (AMI), on Amazon Web Services (AWS).
The currently available pre-built cloud image is:

*   Ubuntu 20.04 Amazon EBS-backed AMI

The Timescale AMI uses Elastic Block Store (EBS) attached volumes. This allows
you to store image snapshots, dynamic IOPS configuration, and provides some
protection of your data if the EC2 instance goes down. Choose an EC2 instance
type that is optimized for EBS attached volumes. For information on choosing the
right EBS optimized EC2 instance type, see the AWS
[instance configuration documentation][aws-instance-config].

<Highlight type="note">
This section shows how to use the AMI from within the AWS EC2 dashboard.
However, you can also use the AMI to build an instance using tools like
Cloudformation, Terraform, the AWS CLI, or any other AWS deployment tool that
supports public AMIs.
</Highlight>

<Procedure>

## Installing Timescale from a pre-build cloud image

1.  Make sure you have an [Amazon Web Services account][aws-signup], and are
    signed in to [your EC2 dashboard][aws-dashboard].
1.  Navigate to `Images → AMIs`.
1.  In the search bar, change the search to `Public images` and type _Timescale_
    search term to find all available Timescale images.
1.  Select the image you want to use, and click `Launch instance from image`.
    <img class="main-content__illustration"
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/aws_launch_ami.png"
    alt="Launch an AMI in AWS EC2"/>

</Procedure>

After you have completed the installation, connect to your instance and
configure your database. For information about connecting to the instance, see
the AWS [accessing instance documentation][aws-connect]. The easiest way to
configure your datase is to run the `timescaledb-tune` script, which is included
with the `timescaledb-tools` package. For more information, see the
[configuration][config] section.

<Highlight type="note">
After running the `timescaledb-tune` script, you need to restart the PostgreSQL
service for the configuration changes to take effect. To restart the service,
run `sudo systemctl restart postgresql.service`.
</Highlight>

## Set up the Timescale extension

When you have PostgreSQL and Timescale installed, connect to your instance and
set up the Timescale extension.

<Procedure>

### Setting up the Timescale extension

1.  On your instance, at the command prompt, connect to the PostgreSQL
    instance as the `postgres` superuser:

    ```bash
    sudo -u postgres psql
    ```

1.  At the prompt, create an empty database. For example, to create a database
    called `tsdb`:

    ```sql
    CREATE database tsdb;
    ```

1.  Connect to the database you created:

    ```sql
    \c tsdb
    ```

1.  Add the Timescale extension:

    ```sql
    CREATE EXTENSION IF NOT EXISTS timescaledb;
    ```

</Procedure>

You can check that the Timescale extension is installed by using the `\dx`
command at the command prompt. It looks like this:

```sql
tsdb=# \dx

                                      List of installed extensions
    Name     | Version |   Schema   |                            Description
-------------+---------+------------+-------------------------------------------------------------------
 plpgsql     | 1.0     | pg_catalog | PL/pgSQL procedural language
 timescaledb | 2.1.1   | public     | Enables scalable inserts and complex queries for time-series data
(2 rows)

(END)
```

<WhereTo />

[aws-signup]: https://portal.aws.amazon.com/billing/signup
[aws-dashboard]: https://console.aws.amazon.com/ec2/
[aws-instance-config]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-optimized.html
[aws-connect]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html
[install-psql]: /timescaledb/:currentVersion:/how-to-guides/connecting/psql/
[config]: /timescaledb/:currentVersion:/how-to-guides/configuration/
