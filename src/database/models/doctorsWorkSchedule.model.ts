import { BaseModel } from './base.model';
import { UsersModel } from './users.model';
import { Model } from 'objection';
import { DoctorsModel } from './doctors.model';

export class DoctorsWorkScheduleModel extends BaseModel {
    static tableName = 'doctorsWorkSchedule';

    doctorId: string;
    workDate: Date;
    startWorkTime: Date;
    endWorkTime: Date;
    deletedAt: Date;

    doctors: DoctorsModel[];

    static relationMappings = {
        doctors: {
            modelClass: `${__dirname}/doctors.model`,
            relation: Model.HasManyRelation,
            join: {
                from: 'doctorsWorkSchedule.doctorId',
                to: 'doctors.id',
            },
        },
    };
}
