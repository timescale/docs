1. **Extract the Kafka binaries to a local folder**

    ```bash
    curl https://dlcdn.apache.org/kafka/3.9.0/kafka_2.13-3.9.0.tgz | tar -xzf - 
    cd kafka_2.13-3.9.0
    ```
   From now on, the folder where you extracted the Kafka binaries is called `<KAFKA_HOME>`.

1. **Configure and run Apache Kafka**

   ```bash
   KAFKA_CLUSTER_ID="$(bin/kafka-storage.sh random-uuid)"
   ./bin/kafka-storage.sh format --standalone -t $KAFKA_CLUSTER_ID -c config/kraft/reconfig-server.properties
   ./bin/kafka-server-start.sh config/kraft/reconfig-server.properties
   ```
   Use the `-daemon` flag to run this process in the background.

1. **Create Kafka topics**

   In another Terminal window, navigate to <KAFKA_HOME>, then call `kafka-topics.sh` and create the following topics:
   - `accounts`: publishes JSON messages that are consumed by the timescale-sink connector and inserted into your $SERVICE_LONG.
   - `deadletter`: stores messages that cause errors and that Kafka Connect workers cannot process.

   ```bash
   ./bin/kafka-topics.sh \
        --create \
        --topic accounts \
        --bootstrap-server localhost:9092 \
        --partitions 10
        
   ./bin/kafka-topics.sh \
        --create \
        --topic deadletter \
        --bootstrap-server localhost:9092 \
        --partitions 10
   ```

1. **Test that your topics are working correctly**
   1. Run `kafka-console-producer` to send messages to the `accounts` topic:
      ```bash
      bin/kafka-console-producer.sh --topic accounts --bootstrap-server localhost:9092
      ```
   1. Send some events. For example, type the following:
      ```bash
      >Tiger Cloud
      >How Cool
      ```
   1. In another Terminal window, navigate to <KAFKA_HOME>, then run `kafka-console-consumer` to consume the events you just sent:
      ```bash
      bin/kafka-console-consumer.sh --topic accounts --from-beginning --bootstrap-server localhost:9092
      ```
      You see
      ```bash
      Tiger Cloud
      How Cool
     ```
   

