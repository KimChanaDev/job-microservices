import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client/auth/index.js';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {

    constructor(private readonly prismaService: PrismaService) { }

    async createUser(userData: Prisma.UserCreateInput) {
        const user = await this.prismaService.user.create({
            data: {
                ...userData,
                password: await hash(userData.password, 10),
            },
        });
        return user;
    }

    async getUsers() {
        return this.prismaService.user.findMany();
    }

    async getUser(args: Prisma.UserWhereUniqueInput) {
        return this.prismaService.user.findUniqueOrThrow({
            where: args,
        });
    }
}
