## Installing from an Amazon AMI (Ubuntu) [](installation-ubuntu-ami)
TimescaleDB is currently available as an Ubuntu 20.04 Amazon EBS-backed AMI. AMIs are
distributed by region, and our AMI is currently available in US and EU
regions. Note that this image is built to use an EBS attached volume
rather than the default disk that comes with EC2 instances.

See below for the image id corresponding to each region for the most recent TimescaleDB version:

<!-- vale Google.Units = NO -->

Region | Image ID
--- | ---
us-east-1 (North Virginia) | ami-049af5874b750603f
us-east-2 (Ohio) | ami-053d33490ee344c15
us-west-1 (North California) | ami-0d3db44acf6b09d78
us-west-2 (Oregon) | ami-0e177f82b1414440d
eu-central-1 (Germany) | ami-0fad6033a40098d26
eu-north-1 (Sweden) | ami-0d1b4497e3de9c999
eu-west-1 (Ireland) | ami-016bd50ec09475098
eu-west-2 (England) | ami-0983a20d47b9427c3
eu-west-3 (France) | ami-00be4bb77bf15fe6a

<!-- vale Google.Units = YES -->

To launch the AMI, go to the `AMIs` section of your AWS EC2 Dashboard run the following steps:

* Select `Public Images` under the dropdown menu.
* Filter the image id by the image id for your region and select the image.
* Click the `Launch` button.

You can also use the image id to build an instance using Cloudformation, Terraform,
the AWS CLI, or any other AWS deployment tool that supports building from public AMIs.

TimescaleDB is installed on the AMI, but you still need to follow the steps for
initializing a database with the TimescaleDB extension. See our [setup][] section for details.
Depending on your user/permission needs, you also need to set up a postgres superuser for your
database by following these [postgres instructions][]. Another possibility is using the operating
system's `ubuntu` user and modifying the [pg_hba][].

<highlight type="warning">
 AMIs do not know what instance type you are using beforehand. Therefore
the PostgreSQL configuration (postgresql.conf) that comes with our AMI uses the default
settings, which are not optimal for most systems. Our AMI is packaged with `timescaledb-tune`,
which you can use to tune postgresql.conf based on the underlying system resources of your instance.
See our [configuration](https://docs.timescale.com/timescaledb/latest/how-to-guides/configuration/) section for details.
</highlight>

<highlight type="tip">
These AMIs are made for EBS attached volumes. This allows for snapshots, protection of
data if the EC2 instance goes down, and dynamic IOPS configuration. You should choose an
EC2 instance type that is optimized for EBS attached volumes. For information on
choosing the right EBS optimized EC2 instance type, see the AWS [instance configuration page](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-optimized.html).
</highlight>

[setup]: /install/latest/
[postgres instructions]: https://www.postgresql.org/docs/current/sql-createrole.html
[pg_hba]: https://www.postgresql.org/docs/current/static/auth-pg-hba-conf.html
