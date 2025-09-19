import { Module } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UsersResolver } from '../resolvers/users.resolver';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [PrismaModule],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule { }
