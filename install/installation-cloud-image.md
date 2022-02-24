# Install self-hosted TimescaleDB from a pre-built cloud image
You can install a self-hosted TimescaleDB instance on a cloud hosting provider,
from a pre-built, publicly available machine image. These instructions show you
how to use a pre-built Amazon machine image (AMI), on Amazon Web Services (AWS).
The currently available pre-built cloud image is:

*   Ubuntu 18.04 Amazon EBS-backed AMI

The Timescale AMI uses Elastic Block Store (EBS) attached volumes. This allows
you to store image snapshots, dynamic IOPS configuration, and provides some
protection of your data if the EC2 instance goes down. Choose an EC2 instance
type that is optimized for EBS attached volumes. For information on choosing the
right EBS optimized EC2 instance type, see the AWS
[instance configuration documentation][aws-instance-config].

This AMI is available in the US and EU cloud regions. The current image IDs for
each of the available regions are:

|Region|Country or state|Image ID|
|-|-|-|
|us-east-1|North Virginia|`ami-0e1fda26a1ed02cfa`|
|us-east-2|Ohio|`ami-0125218e638acecc6`|
|us-west-1|North California|`ami-067fc377a13e8a478`|
|us-west-2|Oregon|`ami-02ebb0bba83c21e18`|
|eu-central-1|Germany|`ami-091761278280a85ea`|
|eu-north-1|Sweden|`ami-073032763b7b002e2`|
|eu-west-1|Ireland|`ami-079be8591e30184db`|
|eu-west-2|England|`ami-0f470a62b8b999882`|
|eu-west-3|France|`ami-06ffe8616822f2c79`|

<highlight type="note">
This section shows how to use the AMI from within the AWS EC2 dashboard.
However, you can also use the AMI to build an instance using tools like
Cloudformation, Terraform, the AWS CLI, or any other AWS deployment tool that
supports public AMIs.
</highlight>

<procedure>

### Installing self-hosted TimescaleDB from a pre-build cloud image
1.  Make sure you have an [Amazon Web Services account][aws-signup], and
    are signed in to [your EC2 dashboard][aws-dashboard].
1.  Navigate to `Images → AMIs`.
1.  In the search bar, change the search to `Public images` and enter the
    Image ID for your region. Alternatively, you can use the `Timescale` search
    term to find all available Timescale images.
1.  Select the image you want to use, and click `Launch`.
    <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/aws_launch_ami.png" alt="Launch an AMI in AWS EC2"/>

</procedure>

After you have completed the installation, connect to your instance and configure your database. For information about connecting to the instance, see the AWS [accessing instance documentation][aws-connect]. The easiest way to configure your datase is to run the `timescaledb-tune` script, which is included with the `timescaledb-tools` package. For more information, see the [configuration][config] section. 

<highlight type="note">
After running the `timescaledb-tune` script, you need to restart the PostgreSQL service for the configuration changes to take effect. To restart the service, run `sudo systemctl restart postgresql.service`.
</highlight>


## Set up the TimescaleDB extension
When you have PostgreSQL and TimescaleDB installed, connect to your instance and set up the TimescaleDB extension.

<procedure>

### Setting up the TimescaleDB extension
1.  On your instance, at the command prompt, connect to the PostgreSQL
    instance as the `postgres` superuser:
    ```bash
    sudo -u postgres psql
    ```
1.  At the prompt, create an empty database. Our database is
    called `tsdb`:
    ```sql
    CREATE database tsdb;
    ```
1.  Connect to the database you created:
    ```sql
    \c tsdb
    ```
1.  Add the TimescaleDB extension:
    ```sql
    CREATE EXTENSION IF NOT EXISTS timescaledb;
    ```
    
</procedure>

You can check that the TimescaleDB extension is installed by using the `\dx`
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

## Where to next
Now that you have your first TimescaleDB database up and running, you can check
out the [TimescaleDB][tsdb-docs] section in our documentation, and find out what
you can do with it.

If you want to work through some tutorials to help you get up and running with
TimescaleDB and time-series data, check out our [tutorials][tutorials] section.

You can always [contact us][contact] if you need help working something out, or
if you want to have a chat.


[aws-signup]: https://portal.aws.amazon.com/billing/signup
[aws-dashboard]: https://console.aws.amazon.com/ec2/
[aws-instance-config]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-optimized.html
[aws-connect]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html
[contact]: https://www.timescale.com/contact
[install-psql]: /how-to-guides/connecting/psql/
[tsdb-docs]: timescaledb/:currentVersion:/index/
[tutorials]: /timescaledb/:currentVersion:/tutorials/
[config]: /timescaledb/:currentVersion:/how-to-guides/configuration/
