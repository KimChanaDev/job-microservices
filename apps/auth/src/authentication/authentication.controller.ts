import { Controller, UseGuards } from '@nestjs/common';
import {
    AuthenticationRequest, AuthenticationResponse,
    AuthServiceController, AuthServiceControllerMethods
} from '@app/grpc';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TokenPayload } from '@app/common';
import { Observable } from 'rxjs';


@Controller()
@AuthServiceControllerMethods()
export class AuthenticationController implements AuthServiceController {
    constructor(private readonly userService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    authenticate(
        request: AuthenticationRequest & { user: TokenPayload }
    ):
        | Promise<AuthenticationResponse>
        | Observable<AuthenticationResponse>
        | AuthenticationResponse {
        return this.userService.getUser({ id: request.user.userId });
    }

}
