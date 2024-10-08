import { Injectable } from '@nestjs/common';
import { InterlayerNotice } from '../../../base/models/interlayer';
import { UserViewDto } from '../api/dto/output/user-view.dto';
import { UsersRepository } from '../infrastructure/users.repository';
import { Role } from '../../../base/models/role.enum';
import { userViewMapper } from '../../../base/mappers/user-view.mapper';
import { Knex } from 'knex';

@Injectable()
export class UsersService {
    constructor(private usersRepository: UsersRepository) {}

    async createUser(
        passwordHash: string,
        login: string,
        email: string,
        roleTitle: Role,
        trx: Knex.Transaction,
    ): Promise<InterlayerNotice<UserViewDto | null>> {
        const notice = new InterlayerNotice<UserViewDto | null>();

        const userByLogin = await this.usersRepository.getUserByLogin(login);
        const userByEmail = await this.usersRepository.getUserByEmail(email);
        if (userByLogin || userByEmail) {
            notice.addError('login or email already exist');
            return notice;
        }

        const user = await this.usersRepository.createUser(
            passwordHash,
            login,
            email,
            roleTitle,
            trx,
        );
        if (!user) {
            notice.addError('user was not created');
            return notice;
        }
        notice.addData(userViewMapper(user));
        return notice;
    }

    async getUserRole(roleId: string): Promise<InterlayerNotice<string>> {
        const notice = new InterlayerNotice<string | null>();

        const role = await this.usersRepository.getUserRole(roleId);

        if (!role) {
            notice.addError('role was not found');
            return notice;
        }
        notice.addData(role);
        return notice;
    }

    async getUserById(
        userId: string,
    ): Promise<InterlayerNotice<UserViewDto | null>> {
        const notice = new InterlayerNotice<UserViewDto | null>();

        const user = await this.usersRepository.getUserById(userId);
        if (user) {
            notice.addError('user was not found');
            return notice;
        }

        notice.addData(userViewMapper(user));
        return notice;
    }

    async getUserByLogin(
        login: string,
    ): Promise<InterlayerNotice<UserViewDto | null>> {
        const notice = new InterlayerNotice<UserViewDto | null>();

        const user = await this.usersRepository.getUserByLogin(login);
        if (user) {
            notice.addError('user was not found');
            return notice;
        }

        notice.addData(userViewMapper(user));
        return notice;
    }

    async getUserByEmail(
        email: string,
    ): Promise<InterlayerNotice<UserViewDto | null>> {
        const notice = new InterlayerNotice<UserViewDto | null>();

        const user = await this.usersRepository.getUserByLogin(email);
        if (user) {
            notice.addError('user was not found');
            return notice;
        }

        notice.addData(userViewMapper(user));
        return notice;
    }

    async deleteUser(
        userId: string,
        trx: Knex.Transaction,
    ): Promise<InterlayerNotice<UserViewDto | null>> {
        const notice = new InterlayerNotice();

        const user = await this.usersRepository.getUserById(userId);
        if (!user) {
            notice.addError('user was not found');
            return notice;
        }

        const isUserDeleted = await this.usersRepository.deleteUser(
            userId,
            trx,
        );
        if (!isUserDeleted) {
            notice.addError('user was not deleted');
            return notice;
        }

        return notice;
    }

    async updateUser(
        userId: string,
        login: string = null,
        email: string = null,
        passwordHash: string = null,
        trx: Knex.Transaction,
    ): Promise<InterlayerNotice> {
        const notice = new InterlayerNotice();

        const user = await this.usersRepository.getUserById(userId);
        if (!user) {
            notice.addError('user was not found');
            return notice;
        }

        const isUserUpdated = await this.usersRepository.updateUser(
            userId,
            login,
            email,
            passwordHash,
            trx,
        );
        if (!isUserUpdated) {
            notice.addError('user was not updated');
            return notice;
        }

        return notice;
    }
}
