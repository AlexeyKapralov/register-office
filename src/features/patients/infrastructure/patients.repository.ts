import { Inject, Injectable } from '@nestjs/common';
import { PatientsModel } from '../../../database/models/patients.model';
import { ModelClass } from 'objection';

@Injectable()
export class PatientsRepository {
    constructor(
        @Inject('PatientsModel')
        private patientsModel: ModelClass<PatientsModel>,
    ) {}

    async getPatientByUserId(userId: string): Promise<PatientsModel | null> {
        return await this.patientsModel.query().findOne({
            userId: userId,
            deletedAt: null,
        });
    }
}
