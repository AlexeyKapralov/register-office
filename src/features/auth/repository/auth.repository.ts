import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { UsersModel } from '../../../database/models/users.model';
import { RolesModel } from '../../../database/models/roles.model';

@Injectable()
export class AuthRepository {
    constructor(
        @Inject('UsersModel')
        private readonly usersModel: ModelClass<UsersModel>,
        @Inject('RolesModel')
        private readonly rolesModel: ModelClass<RolesModel>,
    ) {}

    async getUserRole(roleId: string): Promise<string | null> {
        const role = await this.rolesModel
            .query()
            .findOne({ id: roleId })
            .select('roleTitle');
        return role.roleTitle;
    }

    async getUserByLogin(login: string): Promise<UsersModel | null> {
        const user: UsersModel = await this.usersModel.query().findOne({
            login: login,
            deletedAt: null,
        });

        return user;
    }

    async getUserById(userId: string): Promise<UsersModel | null> {
        const user: UsersModel = await this.usersModel.query().findOne({
            id: userId,
            deletedAt: null,
        });

        return user;
    }

    async getUserByEmail(email: string): Promise<UsersModel | null> {
        const user: UsersModel = await this.usersModel.query().findOne({
            email: email,
            deletedAt: null,
        });

        return user;
    }
}
