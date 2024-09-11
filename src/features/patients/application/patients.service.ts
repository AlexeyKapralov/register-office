import { BadRequestException, Injectable } from '@nestjs/common';
import {
    InterlayerNotice,
    InterlayerStatuses,
} from '../../../base/models/interlayer';
import { DoctorsService } from '../../doctors/application/doctors.service';
import { DoctorsViewDto } from '../../doctors/api/dto/output/doctors-view-dto';
import { AppointmentsService } from '../../appointments/application/appointments.service';
import { AppointmentPatientViewDto } from '../api/dto/output/appointment-patient-view.dto';
import { PatientViewDto } from '../api/dto/output/patient-view.dto';
import { PatientsRepository } from '../infrastructure/patients.repository';
import { patientViewMapper } from '../../../base/mappers/patient-view.mapper';
import dayjs from 'dayjs';

@Injectable()
export class PatientsService {
    constructor(
        private doctorsService: DoctorsService,
        private appointmentService: AppointmentsService,
        private patientsRepository: PatientsRepository,
    ) {}

    async createAppointment(
        datetimeOfAdmission: Date,
        doctorId: string,
        userId: string,
    ): Promise<InterlayerNotice<AppointmentPatientViewDto | null>> {
        const notice = new InterlayerNotice<AppointmentPatientViewDto | null>();
        const basicMinutesToAppointment = [30, 0];

        //корректное ли время
        const minutesDatetimeOfAdmission = dayjs(datetimeOfAdmission).minute();
        const secondsDatetimeOfAdmission = dayjs(datetimeOfAdmission).second();
        const millisecondsDatetimeOfAdmission =
            dayjs(datetimeOfAdmission).millisecond();

        if (
            !basicMinutesToAppointment.includes(minutesDatetimeOfAdmission) ||
            secondsDatetimeOfAdmission !== 0 ||
            millisecondsDatetimeOfAdmission !== 0
        ) {
            throw new BadRequestException({
                message: `you must choose only ${basicMinutesToAppointment} minutes of hour, 0 seconds and 0 milliseconds`,
                field: 'datetimeOfAdmission',
            });
        }

        //есть ли такой доктор
        const doctorInterlayer: InterlayerNotice<DoctorsViewDto> =
            await this.doctorsService.getDoctorById(doctorId);
        if (doctorInterlayer.hasError()) {
            notice.addError(
                'doctor was not found',
                'doctor',
                InterlayerStatuses.NOT_FOUND,
            );
            return notice;
        }

        //работает ли доктор в этот день
        const dayScheduleInterlayer =
            await this.doctorsService.getScheduleForDay(
                doctorId,
                datetimeOfAdmission,
            );
        if (dayScheduleInterlayer.hasError() || !dayScheduleInterlayer.data) {
            notice.addError(
                'schedule was not found',
                'schedule',
                InterlayerStatuses.NOT_FOUND,
            );
            return notice;
        }

        //нет ли на это время уже записи
        const appointmentInterlayer =
            await this.appointmentService.getAppointmentByDateAndDoctorId(
                doctorId,
                datetimeOfAdmission,
            );
        if (!appointmentInterlayer.hasError() || appointmentInterlayer.data) {
            notice.addError(
                'your date is already taken',
                'date',
                InterlayerStatuses.NOT_FOUND,
            );
            return notice;
        }

        const patient =
            await this.patientsRepository.getPatientByUserId(userId);
        if (!patient) {
            notice.addError(
                'patient was not found',
                'patient',
                InterlayerStatuses.NOT_FOUND,
            );
            return notice;
        }

        //записать
        const makeAppointmentInterlayer: InterlayerNotice<AppointmentPatientViewDto | null> =
            await this.appointmentService.makeAppointment(
                datetimeOfAdmission,
                doctorId,
                patient.id,
            );
        if (
            makeAppointmentInterlayer.hasError() ||
            makeAppointmentInterlayer.data === null
        ) {
            notice.addError('appointment was not found');
            return notice;
        }

        notice.addData(makeAppointmentInterlayer.data);
        return notice;
    }

    async deleteAppointment(
        appointmentId: string,
        doctorId: string,
        userId: string,
    ): Promise<InterlayerNotice> {
        const notice = new InterlayerNotice();

        //есть ли такой пациент
        const patient =
            await this.patientsRepository.getPatientByUserId(userId);
        if (!patient) {
            notice.addError('patient was not found');
            return notice;
        }

        //есть ли такая запись
        const appointmentInterlayer =
            await this.appointmentService.getAppointmentById(appointmentId);
        if (appointmentInterlayer.hasError()) {
            notice.addError(
                'appointment was not found',
                'userId',
                InterlayerStatuses.NOT_FOUND,
            );
            return notice;
        }

        //есть ли такая запись у пациента
        const appointmentByIdAndPatientInterlayer =
            await this.appointmentService.getAppointmentByIdAndPatient(
                appointmentId,
                patient.id,
            );
        if (appointmentByIdAndPatientInterlayer.hasError()) {
            notice.addError(
                'user did not create this appointment',
                'appointmentId',
                InterlayerStatuses.FORBIDDEN,
            );
            return notice;
        }

        //удалить запись
        const deleteAppointmentInterlayer: InterlayerNotice =
            await this.appointmentService.deleteAppointment(appointmentId);
        if (deleteAppointmentInterlayer.hasError()) {
            notice.addError(
                'appointment was not deleted',
                'appointment',
                InterlayerStatuses.BAD_REQUEST,
            );
            return notice;
        }

        return notice;
    }

    async updateAppointment(
        appointmentId: string,
        userId: string,
        datetimeOfAdmission: Date = null,
        doctorId: string = null,
    ): Promise<InterlayerNotice> {
        const notice = new InterlayerNotice();

        //есть ли такой пациент
        const patient =
            await this.patientsRepository.getPatientByUserId(userId);
        if (!patient) {
            notice.addError(
                'patient was not found',
                'patientId',
                InterlayerStatuses.NOT_FOUND,
            );
            return notice;
        }

        if (doctorId && datetimeOfAdmission) {
            //есть ли расписание у доктора в день, который в datetimeOfAdmission
            const scheduleInterlayer =
                await this.doctorsService.getScheduleForDay(
                    doctorId,
                    datetimeOfAdmission,
                );
            if (scheduleInterlayer.hasError()) {
                notice.addError(
                    'doctor does not work in this day',
                    'doctorId',
                    InterlayerStatuses.FORBIDDEN,
                );
                return notice;
            }
        }

        //обновить запись
        const updateAppointmentInterlayer: InterlayerNotice =
            await this.appointmentService.updateAppointment(
                appointmentId,
                patient.id,
                datetimeOfAdmission,
                doctorId,
            );
        if (updateAppointmentInterlayer.hasError()) {
            const { message, key, code } =
                updateAppointmentInterlayer.extensions[0];
            notice.addError(message, key, code);
            return notice;
        }

        return notice;
    }

    async getPatientByUserId(
        userId: string,
    ): Promise<InterlayerNotice<PatientViewDto | null>> {
        const notice = new InterlayerNotice<PatientViewDto | null>();

        const patient =
            await this.patientsRepository.getPatientByUserId(userId);
        if (!patient) {
            notice.addError('patient was not found');
            return notice;
        }

        notice.addData(patientViewMapper(patient));
        return notice;
    }

    async getAppointments(
        startPeriod: Date,
        endPeriod: Date,
        userId: string,
    ): Promise<InterlayerNotice<AppointmentPatientViewDto[]>> {
        const notice = new InterlayerNotice<AppointmentPatientViewDto[]>();

        const date1 = dayjs(startPeriod);
        const date2 = dayjs(endPeriod);
        const countDaysBetweenDates = date2
            .startOf('day')
            .diff(date1.startOf('day'), 'day');
        if (countDaysBetweenDates > 30) {
            notice.addError(
                'It is more than 30 days in current period',
                '',
                InterlayerStatuses.BAD_REQUEST,
            );
            return notice;
        }

        const patient =
            await this.patientsRepository.getPatientByUserId(userId);
        if (!patient) {
            notice.addError('patient was not found');
            return notice;
        }

        const appointmentsInterlayer =
            await this.appointmentService.getAppointmentsForPatients(
                startPeriod,
                endPeriod,
                patient.id,
            );
        if (appointmentsInterlayer.hasError()) {
            const { message, key, code } = appointmentsInterlayer.extensions[0];
            notice.addError(message, key, code);
            return notice;
        }

        notice.addData(appointmentsInterlayer.data);
        return notice;
    }
}
