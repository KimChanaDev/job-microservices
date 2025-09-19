import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UserModel } from '../models/user.model';
import { LoginInput } from '../dtos/login.input';
import type { GqlContext } from '@app/graphql';
import { AuthenticationService } from '../services/authentication.service';

@Resolver()
export class AuthenticationResolver {

    constructor(private readonly authService: AuthenticationService) { }

    @Mutation(() => UserModel)
    async login(
        @Args('loginInput') loginInput: LoginInput,
        @Context() context: GqlContext
    ) {
        return this.authService.login(loginInput, context.res);
    }
}
