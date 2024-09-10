import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { UsersModel } from '../../../database/models/users.model';
import { DoctorsModel } from '../../../database/models/doctors.model';
import { UsersService } from '../../users/application/users.service';
import { DoctorsService } from '../../doctors/application/doctors.service';
import { Knex } from 'knex';
import { Role } from '../../../base/models/role.enum';
import { DoctorInputDto } from '../../doctors/api/dto/input/doctor-input.dto';
import { DoctorsViewDto } from '../../doctors/api/dto/output/doctors-view-dto';
import { DoctorInputOptionalDto } from '../../doctors/api/dto/input/doctor-input-optional.dto';
import { Logger } from 'nestjs-pino';

@Injectable()
export class AdministratorsRepository {
    constructor(
        @Inject('UsersModel') private usersModel: ModelClass<UsersModel>,
        @Inject('DoctorsModel') private doctorsModel: ModelClass<DoctorsModel>,
        private readonly usersService: UsersService,
        private readonly doctorsService: DoctorsService,
        @Inject('KnexConnection') private readonly knex: Knex,
        private readonly logger: Logger,
    ) {}

    async removeDoctor(userId: string, doctorId: string): Promise<boolean> {
        const trx = await this.knex.transaction();
        try {
            const isDoctorDeleteInterlayer =
                await this.doctorsService.deleteDoctor(doctorId, trx);
            if (isDoctorDeleteInterlayer.hasError()) {
                trx.rollback();
                return false;
            }

            const isUserDeleteInterlayer = await this.usersService.deleteUser(
                userId,
                trx,
            );
            if (isUserDeleteInterlayer.hasError()) {
                trx.rollback();
                return false;
            }

            await trx.commit();
            return true;
        } catch (error) {
            await trx.rollback();
            return false;
        }
    }

    async createDoctor(
        doctorInputDto: DoctorInputDto,
        passwordHash: string,
    ): Promise<DoctorsViewDto | null> {
        const trx = await this.knex.transaction();
        try {
            const userInterlayer = await this.usersService.createUser(
                passwordHash,
                doctorInputDto.login,
                doctorInputDto.email,
                Role.Doctor,
                trx,
            );
            if (userInterlayer.hasError()) {
                trx.rollback();
                return null;
            }

            const doctorInterlayer = await this.doctorsService.createDoctor(
                doctorInputDto,
                userInterlayer.data.id,
                trx,
            );
            if (doctorInterlayer.hasError()) {
                trx.rollback();
                return null;
            }

            await trx.commit();
            return doctorInterlayer.data;
        } catch (error) {
            await trx.rollback();
            return null;
        }
    }

    async updateDoctor(
        doctorInputUpdateDto: DoctorInputOptionalDto,
        passwordHash: string,
        userId: string,
        doctorId: string,
    ): Promise<boolean> {
        const trx = await this.knex.transaction();
        try {
            const updateUserInterlayer = await this.usersService.updateUser(
                userId,
                doctorInputUpdateDto.login,
                doctorInputUpdateDto.email,
                passwordHash,
                trx,
            );
            this.logger.log('updateDoctorInterlayer', {
                updateDoctorInterlayer: updateUserInterlayer,
            });
            if (updateUserInterlayer.hasError()) {
                trx.rollback();
                return false;
            }
            const updateDoctorInterlayer =
                await this.doctorsService.updateDoctor(
                    doctorId,
                    doctorInputUpdateDto.firstName,
                    doctorInputUpdateDto.lastName,
                    doctorInputUpdateDto.region,
                    doctorInputUpdateDto.city,
                    doctorInputUpdateDto.phoneNumber,
                    doctorInputUpdateDto.specialization,
                    doctorInputUpdateDto.dob,
                    trx,
                );
            this.logger.log('updateDoctorInterlayer', {
                updateDoctorInterlayer: updateDoctorInterlayer,
            });
            if (updateDoctorInterlayer.hasError()) {
                trx.rollback();
                return false;
            }

            await trx.commit();
            return true;
        } catch (error) {
            await trx.rollback();
            return false;
        }
    }
}
