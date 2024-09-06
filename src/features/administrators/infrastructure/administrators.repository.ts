import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { DoctorInputDto } from '../../doctors/api/dto/input/doctor-input.dto';
import { DoctorsModel } from '../../../database/models/doctors.model';
import { RolesModel } from '../../../database/models/roles.model';

@Injectable()
export class AdministratorsRepository {
    constructor(
        @Inject('DoctorsModel')
        private readonly doctorsModel: ModelClass<DoctorsModel>,
        @Inject('RolesModel')
        private readonly rolesModel: ModelClass<RolesModel>,
    ) {}

    async createDoctor(doctorInputDto: DoctorInputDto, userId: string) {
        const doctor = await this.doctorsModel.query().insert({
            userId: userId,
            city: doctorInputDto.city,
            dob: doctorInputDto.dob,
            region: doctorInputDto.region,
            specialization: doctorInputDto.specialization,
            firstname: doctorInputDto.firstName,
            lastname: doctorInputDto.lastName,
            phone_number: doctorInputDto.phoneNumber,
        });

        return doctor;
    }
}
