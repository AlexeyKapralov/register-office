import { Inject, Injectable } from '@nestjs/common';
import { DoctorsModel } from '../../../database/models/doctors.model';
import { ModelClass } from 'objection';
import { DoctorInputDto } from '../api/dto/input/doctor-input.dto';
import { Knex } from 'knex';

@Injectable()
export class DoctorsRepository {
    constructor(
        @Inject('DoctorsModel') private doctorsModel: ModelClass<DoctorsModel>,
    ) {}

    async findDoctorById(doctorId: string): Promise<DoctorsModel | null> {
        const doctors = await this.doctorsModel
            .query()
            .findOne({ id: doctorId, deleted_at: null });
        return doctors;
    }

    async findDoctorWithUser(doctorId: string): Promise<DoctorsModel | null> {
        const doctors = await this.doctorsModel
            .query()
            .findOne({ id: doctorId, deleted_at: null })
            .withGraphFetched('user');
        return doctors;
    }

    async deleteDoctor(
        doctorId: string,
        trx: Knex.Transaction,
    ): Promise<boolean> {
        const deletedDate = new Date();
        const doctorDeletedCount = await this.doctorsModel
            .query(trx)
            .where({ id: doctorId, deleted_at: null })
            .update({
                deletedAt: deletedDate,
            });
        return doctorDeletedCount === 1;
    }

    async createDoctor(
        doctorInputDto: DoctorInputDto,
        userId: string,
        trx: Knex.Transaction,
    ): Promise<DoctorsModel> {
        const doctor = await this.doctorsModel.query(trx).insert({
            userId: userId,
            city: doctorInputDto.city,
            dob: doctorInputDto.dob,
            region: doctorInputDto.region,
            specialization: doctorInputDto.specialization,
            firstname: doctorInputDto.firstName,
            lastname: doctorInputDto.lastName,
            phoneNumber: doctorInputDto.phoneNumber,
        });

        return doctor;
    }

    async updateDoctor(
        doctorId: string,
        firstname: string = null,
        lastname: string = null,
        region: string = null,
        city: string = null,
        phoneNumber: string = null,
        specialization: string = null,
        dob: Date = null,
        trx: Knex.Transaction,
    ): Promise<boolean> {
        const updateData: { [key: string]: any } = {};

        if (firstname) {
            updateData.firstname = firstname;
        }
        if (lastname) {
            updateData.lastname = lastname;
        }
        if (region) {
            updateData.region = region;
        }
        if (city) {
            updateData.city = city;
        }
        if (phoneNumber) {
            updateData.phoneNumber = phoneNumber;
        }
        if (specialization) {
            updateData.specialization = specialization;
        }
        if (dob) {
            updateData.dob = dob;
        }

        const user = await this.doctorsModel
            .query(trx)
            .where({ id: doctorId, deletedAt: null })
            .update(updateData);
        return user === 1;
    }
}
