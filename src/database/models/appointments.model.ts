import { BaseModel } from './base.model';
import { UsersModel } from './users.model';
import { Model } from 'objection';
import { PatientsModel } from './patients.model';
import { DoctorsModel } from './doctors.model';

export class AppointmentsModel extends BaseModel {
    static tableName = 'appointments';

    doctorId: string;
    patientId: string;
    datetimeOfAdmission: Date;
    status: string;
    createdAt: Date;
    deletedAt: Date;

    doctors: DoctorsModel[];
    patients: PatientsModel[];

    static relationMappings = {
        doctors: {
            modelClass: `${__dirname}/doctors.model`,
            relation: Model.HasManyRelation,
            join: {
                from: 'appointments.doctorId',
                to: 'doctors.id',
            },
        },
        patients: {
            modelClass: `${__dirname}/patients.model`,
            relation: Model.HasManyRelation,
            join: {
                from: 'appointments.patientId',
                to: 'patients.id',
            },
        },
    };
}
