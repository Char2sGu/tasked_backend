import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    return await this.userRepository.save(this.userRepository.create(dto));
  }

  async findMany(after?: number, limit = 20) {
    return await this.userRepository.find({
      where: after ? { id: MoreThan(after) } : undefined,
      take: limit,
    });
  }

  async findOne(username: string) {
    return await this.userRepository.findOne({ username });
  }

  async update(username: string, dto: UpdateUserDto) {
    const entity = await this.userRepository.findOne({ username });
    if (!entity) return;
    Object.assign(entity, dto);
    return await this.userRepository.save(entity);
  }

  async remove(username: string) {
    const entity = await this.userRepository.findOne({ username });
    if (!entity) return;
    return await this.userRepository.remove(entity);
  }

  async count() {
    return await this.userRepository.count();
  }
}
