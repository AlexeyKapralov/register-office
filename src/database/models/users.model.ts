import { BaseModel } from './base.model';

export class UsersModel extends BaseModel {
    static tableName = 'users';

    login: string;
    email: string;
    password: string;
    roleId: string;
    createdAt: Date;
}
