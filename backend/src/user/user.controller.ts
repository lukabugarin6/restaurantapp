import { Controller, Get, Post, Body, Param, UseGuards, Request, SetMetadata } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { RolesGuard } from '../auth/roles-auth.guard';

@ApiTags('User') // Swagger grouping
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto }) // Tell Swagger about the request body
  @Post()
  async create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @ApiOperation({ summary: 'Find a user by email' })
  @ApiBearerAuth() // Requires authentication
  @UseGuards(JwtAuthGuard)
  // @SetMetadata('roles', ['admin', 'superuser'])
  @Get(':email')
  async findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiBearerAuth() // Requires authentication
  @UseGuards(JwtAuthGuard, RolesGuard) // Order matters: JwtAuthGuard first
  @SetMetadata('roles', ['admin', 'superuser'])
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Get logged-in user profile' })
  @ApiBearerAuth() // Requires authentication
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user; // Returns authenticated user details
  }
}
