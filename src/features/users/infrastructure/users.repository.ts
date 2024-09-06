import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { UsersModel } from '../../../database/models/users.model';
import { Role } from '../../../base/models/role.enum';
import { RolesModel } from '../../../database/models/roles.model';
import { DoctorsModel } from '../../../database/models/doctors.model';

@Injectable()
export class UsersRepository {
    constructor(
        @Inject('UsersModel')
        private readonly usersModel: ModelClass<UsersModel>,
        @Inject('RolesModel')
        private readonly rolesModel: ModelClass<RolesModel>,
    ) {}

    async createUser(
        passwordHash: string,
        login: string,
        email: string,
        roleTitle: Role,
    ): Promise<UsersModel | null> {
        const role = await this.rolesModel
            .query()
            .findOne({
                role_title: roleTitle,
            })
            .select('id');
        if (!role) {
            return null;
        }

        const user = await this.usersModel.query().insert({
            createdAt: new Date(),
            password: passwordHash,
            login: login,
            email: email,
            roleId: role.id,
        });
        return user;
    }

    async findUserByLogin(login: string): Promise<UsersModel | null> {
        const user: UsersModel = await this.usersModel.query().findOne({
            login: login,
            deletedAt: null,
        });

        return user;
    }

    async findUserByEmail(email: string): Promise<UsersModel | null> {
        const user: UsersModel = await this.usersModel.query().findOne({
            email: email,
            deletedAt: null,
        });

        return user;
    }
}
