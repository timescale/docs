
| Flag                      | Default           | Description                                                                 |
|---------------------------|-------------------|-----------------------------------------------------------------------------|
| `analytics`               | `true`            | Set to `false` to disable usage analytics                                   |
| `color `                  | `true`            | Set to `false` to disable colored output                                    |
| `debug`                   | No debugging      | Enable debug logging                                                        |
| `docs_mcp`                | `true`            | Enable or disable the $COMPANY documentation MCP proxy                      |
| `output`                  | `table`     | Set the output format to `json`, `yaml`, or `table`                         |
| `password-storage` string | `keyring`         | Set the password storage method. Options are `keyring`, `pgpass`, or `none` | 
| `service-id` string       | -                 | Set the $SERVICE_LONG to manage                                             |
| `version_check_interval`  | `24h`              | Set how often the $CLI_SHORT checks for a new version                       |

You can also set these configuration options as environment variables. Environment variables:
* Take precedence over configuration parameters values.  
* Are in upper case and use the `TIGER_` prefix. For example, `TIGER_ANALYTICS`