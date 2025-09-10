import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {

    async getUser() {
        return [
            {
                email: '5555',
                id: 1
            }
        ];
    }
}
