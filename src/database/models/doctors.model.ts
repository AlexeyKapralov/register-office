import { BaseModel } from './base.model';
import { UsersModel } from './users.model';
import { Model } from 'objection';

export class DoctorsModel extends BaseModel {
    static tableName = 'doctors';

    userId: string;
    firstname: string;
    lastname: string;
    region: string;
    city: string;
    phoneNumber: string;
    specialization: string;
    dob: Date;
    deletedAt: Date;

    user: UsersModel;

    static relationMappings = {
        user: {
            modelClass: `${__dirname}/users.model`,
            relation: Model.BelongsToOneRelation,
            join: {
                from: 'doctors.userId',
                to: 'users.id',
            },
        },
    };
}
