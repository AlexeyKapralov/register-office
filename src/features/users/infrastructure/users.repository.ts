import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { UsersModel } from '../../../database/models/users.model';
import { Role } from '../../../base/models/role.enum';
import { RolesModel } from '../../../database/models/roles.model';
import { Knex } from 'knex';

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
        trx: Knex.Transaction,
    ): Promise<UsersModel | null> {
        const role = await this.rolesModel
            .query(trx)
            .findOne({
                role_title: roleTitle,
            })
            .select('id');
        if (!role) {
            return null;
        }

        const user = await this.usersModel.query(trx).insert({
            createdAt: new Date(),
            password: passwordHash,
            login: login,
            email: email,
            roleId: role.id,
        });
        return user;
    }

    async updateUser(
        userId: string,
        login: string = null,
        email: string = null,
        passwordHash: string = null,
        trx: Knex.Transaction,
    ): Promise<boolean> {
        const updateData: { [key: string]: any } = {};

        if (login) {
            updateData.login = login;
        }
        if (email) {
            updateData.email = email;
        }
        if (passwordHash) {
            updateData.password = passwordHash;
        }

        const user = await this.usersModel
            .query(trx)
            .where({ id: userId, deletedAt: null })
            .update(updateData);
        return user === 1 || user === 0;
    }

    async findUserByLogin(login: string): Promise<UsersModel | null> {
        const user: UsersModel = await this.usersModel.query().findOne({
            login: login,
            deletedAt: null,
        });

        return user;
    }

    async findUserById(userId: string): Promise<UsersModel | null> {
        const user: UsersModel = await this.usersModel.query().findOne({
            id: userId,
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

    async deleteUser(userId: string, trx: Knex.Transaction): Promise<boolean> {
        const deletedDate = new Date();
        const userDeletedCount = await this.usersModel
            .query(trx)
            .where({ id: userId, deleted_at: null })
            .update({
                deletedAt: deletedDate,
            });
        return userDeletedCount === 1;
    }
}
