
| Flag                      | Default           | Description                                                                 |
|---------------------------|-------------------|-----------------------------------------------------------------------------|
| `analytics`               | `true`            | Enable or disable usage analytics                                   |
| `color`                   | `true`            | Enable or disable colored output                                    |
| `debug`                   | `false`           | Enable or disable debug logging                                                        |
| `docs_mcp`                | `true`            | Enable or disable the $COMPANY documentation MCP proxy                      |
| `output`                  | `table`           | Set the output format to `json`, `yaml`, or `table`                         |
| `password_storage`        | `keyring`         | Set the password storage method. Options are `keyring`, `pgpass`, or `none` |
| `service_id`              | -                 | Set the default $SERVICE_SHORT to manage                                             |
| `version_check_interval`  | `24h`             | Set how often the $CLI_SHORT checks for a new version. Set to `0` to disable                       |

You can also set these configuration options as environment variables. Environment variables:
* Take precedence over configuration parameters values.  
* Are in upper case and use the `TIGER_` prefix. For example, `TIGER_ANALYTICS`