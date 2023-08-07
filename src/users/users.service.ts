import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UsersEntity } from './users.entity';
import { UsersDTO } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
  ) {}

  async findAll() {
    return await this.userRepository.find();
  }

  async create(data: UsersDTO) {
    const user = this.userRepository.create(data);
    await this.userRepository.save(user);
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
