import { Controller, Get, Put, Req, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@Req() req: Request) {
    const jwt = req.headers.authorization?.replace('Bearer ', '');
    const userId = req.query.userId as string;
    return this.usersService.getUserById(userId, jwt);
  }

  @Put('update')
  async updateProfile(@Req() req: Request, @Body() body: any) {
    const jwt = req.headers.authorization?.replace('Bearer ', '');
    const { userId, updates } = body;
    return this.usersService.updateUser(userId, jwt, updates);
  }
}
