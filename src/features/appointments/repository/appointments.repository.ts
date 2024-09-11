import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { AppointmentsModel } from '../../../database/models/appointments.model';
import { AppointmentsStatusEnum } from '../../../base/models/appointments-status.enum';
import { Knex } from 'knex';
import dayjs from 'dayjs';
import { NotificationsModel } from '../../../database/models/notifications.model';

@Injectable()
export class AppointmentsRepository {
    constructor(
        @Inject('AppointmentsModel')
        private appointmentsModel: ModelClass<AppointmentsModel>,
        @Inject('NotificationsModel')
        private notificationsModel: ModelClass<NotificationsModel>,
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
            .withGraphFetched('[doctors, patients]');
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
            .withGraphFetched('[doctors, patients]');
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
            .withGraphFetched('[doctors, patients]');
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
            .withGraphFetched('[doctors, patients]');
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
            .withGraphFetched('[doctors, patients]');
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
                .withGraphFetched('[doctors, patients]')
                .returning('*');

            const notificationForPatient = await this.notificationsModel
                .query(trx)
                .insert({
                    userId: appointment[0].patients[0].userId,
                    createdAt: new Date(),
                    description: `Appointment on ${dayjs(appointment[0].datetimeOfAdmission).format('YYYY-MM-DD HH:mm:ss')} was created`,
                });
            const notificationForDoctor = await this.notificationsModel
                .query(trx)
                .insert({
                    userId: appointment[0].doctors[0].userId,
                    createdAt: new Date(),
                    description: `Appointment on ${dayjs(appointment[0].datetimeOfAdmission).format('YYYY-MM-DD HH:mm:ss')} was created`,
                });

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
                })
                .withGraphFetched('[doctors, patients]')
                .returning('*');
            if (appointment.length === 0) {
                await trx.rollback();
                return false;
            }
            const notificationForPatient = await this.notificationsModel
                .query(trx)
                .insert({
                    userId: appointment[0].patients[0].userId,
                    createdAt: new Date(),
                    description: `Appointment on ${dayjs(appointment[0].datetimeOfAdmission).format('YYYY-MM-DD HH:mm:ss')} was deleted`,
                });
            const notificationForDoctor = await this.notificationsModel
                .query(trx)
                .insert({
                    userId: appointment[0].doctors[0].userId,
                    createdAt: new Date(),
                    description: `Appointment on ${dayjs(appointment[0].datetimeOfAdmission).format('YYYY-MM-DD HH:mm:ss')} was deleted`,
                });
            await trx.commit();
        } catch (error) {
            await trx.rollback();
            return false;
        }
        return true;
    }

    async deleteAppointmentsByDayAndDoctorId(
        doctorId: string,
        date: Date,
        trx: Knex.Transaction = null,
    ): Promise<boolean> {
        try {
            const appointmentsCountDeleted = await this.appointmentsModel
                .query(trx)
                .where('doctorId', doctorId)
                .andWhere('deletedAt', null)
                .andWhere('status', AppointmentsStatusEnum.Open)
                .andWhere(
                    'datetimeOfAdmission',
                    '>=',
                    dayjs(date).startOf('day').toDate(),
                )
                .andWhere(
                    'datetimeOfAdmission',
                    '<=',
                    dayjs(date).endOf('day').toDate(),
                )
                .update({
                    deletedAt: new Date(),
                })
                .withGraphFetched('[doctors, patients]')
                .returning('*');

            const notificationForPatient = await this.notificationsModel
                .query(trx)
                .insert({
                    userId: appointmentsCountDeleted[0].patients[0].userId,
                    createdAt: new Date(),
                    description: `Appointment on ${dayjs(appointmentsCountDeleted[0].datetimeOfAdmission).format('YYYY-MM-DD')} was deleted`,
                });
            const notificationForDoctor = await this.notificationsModel
                .query(trx)
                .insert({
                    userId: appointmentsCountDeleted[0].doctors[0].userId,
                    createdAt: new Date(),
                    description: `Appointment on ${dayjs(appointmentsCountDeleted[0].datetimeOfAdmission).format('YYYY-MM-DD')} was deleted`,
                });

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
                .update(updateData)
                .returning('*')
                .withGraphFetched('[doctors, patients]');

            if (appointmentUpdateCount.length === 0) {
                await trx.rollback();
                return false;
            }

            const notificationForPatient = await this.notificationsModel
                .query(trx)
                .insert({
                    userId: appointmentUpdateCount[0].patients[0].userId,
                    createdAt: new Date(),
                    description: `Appointment on ${dayjs(appointmentUpdateCount[0].datetimeOfAdmission).format('YYYY-MM-DD HH:mm:ss')} was updated`,
                });
            const notificationForDoctor = await this.notificationsModel
                .query(trx)
                .insert({
                    userId: appointmentUpdateCount[0].doctors[0].userId,
                    createdAt: new Date(),
                    description: `Appointment on ${dayjs(appointmentUpdateCount[0].datetimeOfAdmission).format('YYYY-MM-DD HH:mm:ss')} was updated`,
                });

            await trx.commit();
        } catch (error) {
            await trx.rollback();
            return false;
        }
        return true;
    }
}
