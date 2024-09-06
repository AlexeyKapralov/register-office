import { Injectable } from '@nestjs/common';
import { DoctorsRepository } from '../infrastructure/doctors.repository';
import { InterlayerNotice } from '../../../base/models/interlayer';
import { DoctorsViewDto } from '../api/dto/output/doctors-view-dto';
import { doctorViewMapper } from '../../../base/mappers/doctor-view.mapper';
import { DoctorInputDto } from '../api/dto/input/doctor-input.dto';
import { Knex } from 'knex';

@Injectable()
export class DoctorsService {
    constructor(private doctorsRepository: DoctorsRepository) {}

    async findDoctorById(
        doctorId: string,
    ): Promise<InterlayerNotice<DoctorsViewDto>> {
        const notice = new InterlayerNotice<DoctorsViewDto>();
        const doctor = await this.doctorsRepository.findDoctorById(doctorId);
        if (!doctor) {
            notice.addError('doctor was not found');
            return notice;
        }
        notice.addData(doctorViewMapper(doctor));
        return notice;
    }

    async createDoctor(
        doctorInputDto: DoctorInputDto,
        userId: string,
        trx: Knex.Transaction,
    ): Promise<InterlayerNotice<DoctorsViewDto>> {
        const notice = new InterlayerNotice<DoctorsViewDto>();
        const doctor = await this.doctorsRepository.createDoctor(
            doctorInputDto,
            userId,
            trx,
        );
        if (!doctor) {
            notice.addError('doctor was not found');
            return notice;
        }
        notice.addData(doctorViewMapper(doctor));
        return notice;
    }

    async deleteDoctor(
        doctorId: string,
        trx: Knex.Transaction,
    ): Promise<InterlayerNotice> {
        const notice = new InterlayerNotice();

        const doctor = await this.doctorsRepository.findDoctorById(doctorId);
        if (!doctor) {
            notice.addError('doctor was not found');
        }

        const isDoctorDeleted = await this.doctorsRepository.deleteDoctor(
            doctorId,
            trx,
        );
        if (!isDoctorDeleted) {
            notice.addError('doctor was not deleted');
            return notice;
        }
        return notice;
    }

    async findUserIdByDoctorId(
        doctorId: string,
    ): Promise<InterlayerNotice<string>> {
        const notice = new InterlayerNotice<string>();
        const doctorWithUser =
            await this.doctorsRepository.findDoctorWithUser(doctorId);
        if (!doctorWithUser) {
            notice.addError('doctor was not found');
            return notice;
        }
        notice.addData(doctorWithUser.user.id);
        return notice;
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
    ) {
        const notice = new InterlayerNotice();

        const isDoctorUpdated = await this.doctorsRepository.updateDoctor(
            doctorId,
            firstname,
            lastname,
            region,
            city,
            phoneNumber,
            specialization,
            dob,
            trx,
        );
        if (!isDoctorUpdated) {
            notice.addError('doctor was not updated');
            return notice;
        }

        return notice;
    }
}
