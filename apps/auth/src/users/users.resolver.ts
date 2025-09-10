import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserModel } from './models/user.model';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { GqlAuthGuard } from '../authentication/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from './decorators/current-user.decorator';

@Resolver(() => UserModel)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @Mutation(() => UserModel)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.createUser(createUserInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [UserModel], { name: 'users' })
  async getUsers(@CurrentUser() userId: number) {
    console.log('Current User ID:', userId);
    return this.usersService.getUsers();
  }
}
