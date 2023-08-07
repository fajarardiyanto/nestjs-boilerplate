import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDTO } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  async FindAll() {
    const users = await this.userService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'User fetched successfully',
      users,
    };
  }

  @Post()
  async createUser(@Body() data: UsersDTO) {
    const user = await this.userService.create(data);
    return {
      statusCode: HttpStatus.OK,
      message: 'User createad successfully',
      user,
    };
  }

  @Patch(':id')
  async updateUser(@Param('id') id: number, @Body() data: Partial<UsersDTO>) {
    await this.userService.update(id, data);
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
    };
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    await this.userService.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully',
    };
  }
}
