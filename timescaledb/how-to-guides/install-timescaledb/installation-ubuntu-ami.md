## Installing from an Amazon AMI (Ubuntu) [](installation-ubuntu-ami)

TimescaleDB is currently available as an Ubuntu 18.04 Amazon EBS-backed AMI. AMIs are
distributed by region, and our AMI is currently available in US and EU
regions. Note that this image is built to use an EBS attached volume
rather than the default disk that comes with EC2 instances.

See below for the image id corresponding to each region for the most recent TimescaleDB version:

Region | Image ID
--- | ---
us-east-1 (North Virginia) | ami-0f8c92d3ad3d207d4
us-east-2 (Ohio) | ami-0f0b59bcc81056e7f
us-west-1 (North California) | ami-09c607d20fbde8c67
us-west-2 (Oregon) | ami-07eb27c82f65f2eb5
eu-central-1 (Germany) | ami-0189878c4c9f6f19b
eu-north-1 (Sweden) | ami-02b6c43d01423b7d4
eu-west-1 (Ireland) | ami-0344fcb86804fef40
eu-west-2 (England) | ami-07be508bbdd7f0864
eu-west-3 (France) | ami-0eface5e67d2d7e56

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

[setup]: /how-to-guides/install-timescaledb/post-install-setup/
[postgres instructions]: https://www.postgresql.org/docs/current/sql-createrole.html
[pg_hba]: https://www.postgresql.org/docs/current/static/auth-pg-hba-conf.html
