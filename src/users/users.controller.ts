import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ROOT_PREFIX } from 'src/app.controller';
import { Paginated } from 'src/paginated.interface';
import { TransformedInterceptor } from 'src/transformed.interceptor';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

export const PREFIX = `${ROOT_PREFIX}/users`;

@UseInterceptors(new TransformedInterceptor(2))
@Controller(PREFIX)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findMany(
    @Query('after', ParseIntPipe) after: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<Paginated<User>> {
    return {
      count: await this.usersService.count(),
      results: await this.usersService.findMany(after, limit),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  async findOne(@Param('username') username: string) {
    const entity = await this.usersService.findOne(username);
    if (!entity) throw new NotFoundException();
    return entity;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':username')
  async update(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const entity = await this.usersService.update(username, updateUserDto);
    if (!entity) throw new NotFoundException();
    return entity;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(':username')
  async remove(@Param('username') username: string) {
    const entity = await this.usersService.remove(username);
    if (!entity) throw new NotFoundException();
    return entity;
  }
}
