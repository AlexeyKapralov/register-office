import { BaseModel } from './base.model';

export class RolesModel extends BaseModel {
    static tableName = 'roles';

    role_title: string;
}
