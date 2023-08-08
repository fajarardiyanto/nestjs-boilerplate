import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UsersEntity } from './users.entity';
import { UsersDTO } from './dto/user.dto';
import { RedisService } from 'src/config/redis/redis.service';
import { RedisKeys } from 'src/enums/redis-keys.enum';
import { ProducerService } from 'src/config/kafka/producer/producer.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    private redisService: RedisService,
    private kafkaService: ProducerService,
  ) {}

  async findAll() {
    const res = await this.userRepository.find();
    await this.redisService.setCache(RedisKeys.RedisExample, res);
    return res;
  }

  async create(data: UsersDTO) {
    const user = this.userRepository.create(data);
    await this.userRepository.save(user);
    this.kafkaService.produce({
      topic: process.env.KAFKA_TOPIC,
      messages: [
        {
          value: JSON.stringify(user),
        },
      ],
    });
    return user;
  }

  async findByEmail(email: string): Promise<UsersDTO> {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async findById(id: number): Promise<UsersDTO> {
    return await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async update(id: number, data: Partial<UsersDTO>) {
    await this.userRepository.update({ id }, data);
    return await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async delete(id: number) {
    await this.userRepository.delete({ id });
    return { deleted: true };
  }
}
