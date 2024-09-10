import { Inject, Injectable } from '@nestjs/common';
import { DoctorsModel } from '../../../database/models/doctors.model';
import { ModelClass, transaction } from 'objection';
import { DoctorInputDto } from '../api/dto/input/doctor-input.dto';
import knex, { Knex } from 'knex';
import { DoctorsWorkScheduleModel } from '../../../database/models/doctorsWorkSchedule.model';
import dayjs from 'dayjs';
import { FreeSlotsDoctorQueryDto } from '../api/dto/input/free-slots-doctor-query.dto';
import { AppointmentsModel } from '../../../database/models/appointments.model';
import { AppointmentsStatusEnum } from '../../../base/models/appointments-status.enum';

@Injectable()
export class DoctorsRepository {
    constructor(
        @Inject('DoctorsModel') private doctorsModel: ModelClass<DoctorsModel>,
        @Inject('DoctorsWorkScheduleModel')
        private doctorsWorkScheduleModel: ModelClass<DoctorsWorkScheduleModel>,
        @Inject('AppointmentsModel')
        private appointmentsModel: ModelClass<AppointmentsModel>,
        @Inject('KnexConnection') private readonly knex: Knex,
    ) {}

    async getDoctorById(doctorId: string): Promise<DoctorsModel | null> {
        const doctors = await this.doctorsModel
            .query()
            .findOne({ id: doctorId, deleted_at: null });
        return doctors;
    }
    async getDoctorByUserId(userId: string): Promise<DoctorsModel | null> {
        const doctor = await this.doctorsModel
            .query()
            .findOne({ userId: userId, deleted_at: null });
        return doctor;
    }

    async getDoctorWithUser(doctorId: string): Promise<DoctorsModel | null> {
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

    async checkWorkDayDoctor(
        doctorId: string,
        workDate: Date,
    ): Promise<boolean> {
        const doctorsWorkSchedule = await this.doctorsWorkScheduleModel
            .query()
            .findOne({
                doctorId: doctorId,
                workDate: dayjs(workDate).startOf('day').format('YYYY-MM-DD'),
                deletedAt: null,
            });

        return !!doctorsWorkSchedule;
    }

    async createWorkSchedule(
        doctorId: string,
        workDate: Date,
        startDate: Date,
        finishDate: Date,
        trx: Knex.Transaction = null,
    ): Promise<boolean> {
        let workingTrx = null;
        if (!trx) {
            workingTrx = await this.knex.transaction(); // Создаем новую транзакцию
        } else {
            workingTrx = trx;
        }

        try {
            const user = await this.doctorsWorkScheduleModel
                .query(workingTrx)
                .insert({
                    doctorId: doctorId,
                    workDate: workDate,
                    startWorkTime: startDate,
                    endWorkTime: finishDate,
                });

            if (!trx) {
                await workingTrx.commit(); // Коммитим, если это была создана новая транзакция
            }

            return true;
        } catch (e) {
            if (!trx) {
                await workingTrx.rollback(); // Откат, если была создана новая транзакция
            }
            return false;
        }
    }

    async updateWorkSchedule(
        doctorId: string,
        workDate: Date,
        startDate: Date,
        finishDate: Date,
        trx: Knex.Transaction = null,
    ): Promise<boolean> {
        let workingTrx = null;
        if (!trx) {
            workingTrx = await this.knex.transaction(); // Создаем новую транзакцию
        } else {
            workingTrx = trx;
        }

        try {
            const user = await this.doctorsWorkScheduleModel
                .query(workingTrx)
                .where({
                    doctorId: doctorId,
                    workDate: dayjs(workDate)
                        .startOf('day')
                        .format('YYYY-MM-DD'),
                    deletedAt: null,
                })
                .update({
                    workDate: workDate,
                    startWorkTime: startDate,
                    endWorkTime: finishDate,
                });

            if (!trx) {
                await workingTrx.commit(); // Коммитим, если это была создана новая транзакция
            }
            return user === 1;
        } catch {
            if (!trx) {
                await workingTrx.rollback(); // Откат, если была создана новая транзакция
            }
            return false;
        }
    }

    async deleteWorkSchedule(
        doctorId: string,
        workDate: Date,
        trx: Knex.Transaction = null,
    ): Promise<boolean> {
        let workingTrx = null;
        if (!trx) {
            workingTrx = await this.knex.transaction(); // Создаем новую транзакцию
        } else {
            workingTrx = trx;
        }

        try {
            const user = await this.doctorsWorkScheduleModel
                .query(workingTrx)
                .where({
                    doctorId: doctorId,
                    workDate: dayjs(workDate)
                        .startOf('day')
                        .format('YYYY-MM-DD'),
                    deletedAt: null,
                })
                .update({
                    deletedAt: new Date(),
                });

            if (!trx) {
                await workingTrx.commit(); // Коммитим, если это была создана новая транзакция
            }
            return user === 1;
        } catch {
            if (!trx) {
                await workingTrx.rollback(); // Откат, если была создана новая транзакция
            }
            return false;
        }
    }

    async getScheduleByPeriod(
        doctorId: string,
        startPeriod: Date,
        endPeriod: Date,
    ): Promise<
        | Pick<
              DoctorsWorkScheduleModel,
              'startWorkTime' | 'endWorkTime' | 'workDate'
          >[]
        | null
    > {
        const schedule: Pick<
            DoctorsWorkScheduleModel,
            'startWorkTime' | 'endWorkTime' | 'workDate'
        >[] = await this.doctorsWorkScheduleModel
            .query()
            .where('doctorId', doctorId)
            .andWhere('deletedAt', null)
            .andWhere('startWorkTime', '>=', startPeriod)
            .andWhere('endWorkTime', '<=', endPeriod)
            .select('startWorkTime', 'endWorkTime', 'workDate');

        if (schedule.length === 0) {
            return null;
        }
        return schedule;
    }

    async getAppointments(
        doctorId: string,
        startPeriod: Date,
        endPeriod: Date,
    ): Promise<AppointmentsModel[] | null> {
        const appointmentsa = this.appointmentsModel
            .query()
            .where('doctorId', doctorId)
            .andWhere('deletedAt', null)
            .andWhere('status', AppointmentsStatusEnum.Open)
            .andWhere('datetimeOfAdmission', '>=', startPeriod)
            .andWhere('datetimeOfAdmission', '<=', endPeriod)
            .select('datetimeOfAdmission');

        const appointments: AppointmentsModel[] = await this.appointmentsModel
            .query()
            .where('doctorId', doctorId)
            .andWhere('deletedAt', null)
            .andWhere('status', AppointmentsStatusEnum.Open)
            .andWhere('datetimeOfAdmission', '>=', startPeriod)
            .andWhere('datetimeOfAdmission', '<=', endPeriod)
            .select('datetimeOfAdmission');

        if (appointments.length === 0) {
            return null;
        }
        return appointments;
    }
}
