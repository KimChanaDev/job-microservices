import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {

    constructor(private readonly prismaService: PrismaService) {}

    async getUsers() {
        return this.prismaService.user.findMany();
    }

}
