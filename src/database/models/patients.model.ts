import { BaseModel } from './base.model';
import { UsersModel } from './users.model';
import { Model } from 'objection';

export class PatientsModel extends BaseModel {
    static tableName = 'patients';

    userId: string;
    firstname: string;
    lastname: string;
    dob: Date;
    city: string;
    medicalPolicy: string;
    seriesOfPassport: string;
    passportNumber: string;
    deletedAt: Date;

    user: UsersModel[];

    static relationMappings = {
        user: {
            modelClass: `${__dirname}/users.model`,
            relation: Model.BelongsToOneRelation,
            join: {
                from: 'patients.userId',
                to: 'users.id',
            },
        },
    };
}
