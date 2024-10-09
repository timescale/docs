---
title: Access and control
excerpt: Install and manage your deployment, control user access, and integrate third party tooling.   
products: [cloud]
keywords: [ai, vector, ]
tags: [ai, vector]
---


# Access and control

Intro sentence explaining what access and control is and how the information in the section helps the end user perform 
common tasks. 

![Pricing plans in the console](https://assets.timescale.com/docs/images/tsc-vpc-architecture.svg)

The main workflows you need to accomplish for access and control in Timescale Cloud are:

- **[Control user access to Timescale Cloud projects][user-management]**:

  A user signs up for a Timescale Cloud account.
  Upon signup, the user receives access credentials (e.g., username, password, and API key if needed).

- **User Authentication**:

  The user logs in to the Timescale Cloud dashboard.
  The system authenticates the user credentials against its database.

- **Role-Based Access Control (RBAC)**:

  Once authenticated, the user's access is determined based on roles assigned (e.g., Admin, Viewer, Developer).
  RBAC ensures that only authorized users can perform specific actions (e.g., create, delete, read, or modify resources).

- **Project/Database Creation**:

  An authorized user (e.g., an Admin or Developer) creates a new database instance.
  The user configures the database by selecting options like the instance size, region, backup options, etc.

- **API Access**:

  Users or applications can interact with the Timescale Cloud using RESTful APIs or CLI tools.
  API keys are generated and controlled within the user’s dashboard.
  Access via APIs is restricted based on the user's permissions (RBAC).

- **User/Team Management**:

  The Admin manages additional users and teams.
  Team members are assigned specific roles with varying levels of access (e.g., read-only, full access).
  Admins can invite new users, remove users, and change roles for users.

- **Database Access Control**:

  Each database instance has user access controls defined (e.g., database roles like SUPERUSER, READWRITE).
  Password-based authentication or API token is required for access.
  Admins can assign different roles to database users, controlling access to data and operations within each database.

- **Monitoring and Logs**:

  Users can monitor the performance and health of database instances via the Timescale Cloud dashboard.
  Admins have access to detailed logs of system events, queries, and user activity.

- **Security and Backup**:

  Timescale Cloud automatically handles backups, and users can configure backup retention policies.
  Admins control security features, like SSL, network access, and IP whitelisting, to further restrict database access.

- **Billing and Usage Monitoring**:

  Admins access billing and usage details through the dashboard.
  Usage details help track resources consumed and manage cost.



[vector-search-indexing]: /embed-ai-in-your-data/:currentVersion:/key-vector-database-concepts-for-understanding-pgvector/#vector-search-indexing-approximate-nearest-neighbor-search
[user-management]: /access-and-control/:currentVersion:/user-management/
