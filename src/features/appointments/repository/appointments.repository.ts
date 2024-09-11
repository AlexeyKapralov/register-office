import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { AppointmentsModel } from '../../../database/models/appointments.model';
import { AppointmentsStatusEnum } from '../../../base/models/appointments-status.enum';
import { Knex } from 'knex';

@Injectable()
export class AppointmentsRepository {
    constructor(
        @Inject('AppointmentsModel')
        private appointmentsModel: ModelClass<AppointmentsModel>,
        @Inject('KnexConnection') private readonly knex: Knex,
    ) {}

    async getAppointmentByDateAndDoctorId(
        doctorId: string,
        date: Date,
    ): Promise<AppointmentsModel | null> {
        const appointments = await this.appointmentsModel
            .query()
            .where('doctorId', doctorId)
            .andWhere('deletedAt', null)
            .andWhere('status', AppointmentsStatusEnum.Open)
            .andWhere('datetimeOfAdmission', '=', date)
            .withGraphFetched('doctors');
        if (appointments.length === 0) {
            return null;
        }
        return appointments[0];
    }

    async getAppointmentById(
        appointmentId: string,
    ): Promise<AppointmentsModel | null> {
        const appointment = await this.appointmentsModel
            .query()
            .findOne({
                id: appointmentId,
                deletedAt: null,
                status: AppointmentsStatusEnum.Open,
            })
            .withGraphFetched('doctors');
        if (!appointment) {
            return null;
        }
        return appointment;
    }

    async getAppointmentByIdAndPatientId(
        appointmentId: string,
        patientId: string,
    ): Promise<AppointmentsModel | null> {
        const appointment = await this.appointmentsModel
            .query()
            .findOne({
                id: appointmentId,
                deletedAt: null,
                status: AppointmentsStatusEnum.Open,
                patientId: patientId,
            })
            .withGraphFetched('doctors');
        if (!appointment) {
            return null;
        }
        return appointment;
    }

    async getAppointmentByPeriodAndPatientId(
        startPeriod: Date,
        endPeriod: Date,
        patientId: string,
    ): Promise<AppointmentsModel[] | null> {
        const appointments = await this.appointmentsModel
            .query()
            .where('deletedAt', null)
            .andWhere('status', AppointmentsStatusEnum.Open)
            .andWhere('patientId', patientId)
            .andWhere('datetimeOfAdmission', '>=', startPeriod)
            .andWhere('datetimeOfAdmission', '<=', endPeriod)
            .withGraphFetched('doctors');
        if (!appointments) {
            return null;
        }
        return appointments;
    }

    async getAppointmentByPeriodAndDoctorId(
        startPeriod: Date,
        endPeriod: Date,
        doctorId: string,
    ): Promise<AppointmentsModel[] | null> {
        const appointments = await this.appointmentsModel
            .query()
            .where('deletedAt', null)
            .andWhere('status', AppointmentsStatusEnum.Open)
            .andWhere('doctorId', doctorId)
            .andWhere('datetimeOfAdmission', '>=', startPeriod)
            .andWhere('datetimeOfAdmission', '<=', endPeriod)
            .withGraphFetched('patients');
        if (!appointments) {
            return null;
        }
        return appointments;
    }

    async makeAppointment(
        datetimeOfAdmission: Date,
        doctorId: string,
        patientId: string,
    ): Promise<AppointmentsModel | null> {
        const trx = await this.knex.transaction();
        let appointment: AppointmentsModel;
        try {
            appointment = await this.appointmentsModel
                .query(trx)
                .insert({
                    datetimeOfAdmission: datetimeOfAdmission,
                    doctorId: doctorId,
                    patientId: patientId,
                    status: AppointmentsStatusEnum.Open,
                    createdAt: new Date(),
                    deletedAt: null,
                })
                .withGraphFetched('[doctors, patients]');

            await trx.commit();
        } catch (error) {
            await trx.rollback();
            return null;
        }
        return appointment;
    }

    async deleteAppointment(appointmentId: string): Promise<boolean> {
        const trx = await this.knex.transaction();
        try {
            const appointment = await this.appointmentsModel
                .query(trx)
                .where({
                    id: appointmentId,
                    deletedAt: null,
                })
                .update({
                    deletedAt: new Date(),
                });
            if (appointment === 0) {
                await trx.rollback();
                return false;
            }
            await trx.commit();
        } catch (error) {
            await trx.rollback();
            return false;
        }
        return true;
    }

    async updateAppointment(
        appointmentId: string,
        datetimeOfAdmission: Date = null,
        doctorId: string = null,
    ): Promise<boolean> {
        const updateData: { [key: string]: any } = {};

        if (datetimeOfAdmission) {
            updateData.datetimeOfAdmission = datetimeOfAdmission;
        }
        if (doctorId) {
            updateData.doctorId = doctorId;
        }
        const trx = await this.knex.transaction();
        try {
            const appointmentUpdateCount = await this.appointmentsModel
                .query(trx)
                .where({
                    id: appointmentId,
                    deletedAt: null,
                })
                .forUpdate()
                .update(updateData);
            if (appointmentUpdateCount === 0) {
                await trx.rollback();
                return false;
            }
            await trx.commit();
        } catch (error) {
            await trx.rollback();
            return false;
        }
        return true;
    }
}
