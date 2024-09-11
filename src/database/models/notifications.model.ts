import { BaseModel } from './base.model';
import { Model } from 'objection';
import { UsersModel } from './users.model';

export class NotificationsModel extends BaseModel {
    static tableName = 'notifications';

    userId: string;
    description: string;
    createdAt: Date;
    deletedAt: Date;

    users: UsersModel[];

    static relationMappings = {
        users: {
            modelClass: `${__dirname}/users.model`,
            relation: Model.HasManyRelation,
            join: {
                from: 'notifications.userId',
                to: 'users.id',
            },
        },
    };
}
