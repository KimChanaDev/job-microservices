import { PrismaService } from './prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client/auth/index.js';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {

    constructor(private readonly prismaService: PrismaService) { }

    async createUser(userData: Prisma.usersCreateInput) {
        const user = await this.prismaService.users.create({
            data: {
                ...userData,
                password: await hash(userData.password, 10),
            },
        });
        return user;
    }

    async getUsers() {
        return this.prismaService.users.findMany();
    }

    async getUser(args: Prisma.usersWhereUniqueInput) {
        return this.prismaService.users.findUniqueOrThrow({
            where: args,
        });
    }
}
