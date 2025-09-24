import { Module } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UsersResolver } from '../resolvers/users.resolver';
import { AuthPrismaModule } from '@app/prisma';

@Module({
  imports: [AuthPrismaModule],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule { }
