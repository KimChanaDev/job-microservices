import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserModel } from './models/user.model';
import { UsersService } from './users.service';

@Resolver(() => UserModel)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserModel], { name: 'users' })
  async getUsers() {
    return this.usersService.getUser();
  }
}
