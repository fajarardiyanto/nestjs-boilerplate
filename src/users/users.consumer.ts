import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from 'src/config/kafka/consumer/consumer.service';

@Injectable()
export class UserConsumer implements OnModuleInit {
  constructor(private readonly consumer: ConsumerService) {}

  async onModuleInit() {
    this.consumer.consume(
      process.env.KAFKA_GROUP_ID,
      { topics: [process.env.KAFKA_TOPIC] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            source: 'create-user',
            message: message.value.toString(),
            partition: partition.toString(),
            topic: topic.toString(),
          });
        },
      },
    );
  }
}
