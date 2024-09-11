import { Injectable } from '@nestjs/common';
import { AppointmentsRepository } from '../repository/appointments.repository';
import {
    InterlayerNotice,
    InterlayerStatuses,
} from '../../../base/models/interlayer';
import { AppointmentPatientViewDto } from '../../patients/api/dto/output/appointment-patient-view.dto';
import { DoctorsService } from '../../doctors/application/doctors.service';
import { appointmentDoctorViewMapper } from '../../../base/mappers/appointment-doctor-view.mapper';
import { appointmentPatientViewMapper } from '../../../base/mappers/appointment-patient-view.mapper';
import { AppointmentDoctorsViewDto } from '../../doctors/api/dto/output/appointment-doctors-view.dto';
import { AppointmentPatientDoctorViewDto } from '../../../common/dto/appointment-patient-view.dto';
import { appointmentPatientDoctorViewMapper } from '../../../base/mappers/appointment-patient-doctors-view.mapper';

@Injectable()
export class AppointmentsService {
    constructor(
        private readonly appointmentsRepository: AppointmentsRepository,
    ) {}

    async getAppointmentByDateAndDoctorId(
        doctorId: string,
        date: Date,
    ): Promise<InterlayerNotice<AppointmentPatientDoctorViewDto | null>> {
        const notice =
            new InterlayerNotice<AppointmentPatientDoctorViewDto | null>();

        const appointment =
            await this.appointmentsRepository.getAppointmentByDateAndDoctorId(
                doctorId,
                date,
            );
        if (!appointment) {
            notice.addError('appointment was not found');
            return notice;
        }

        notice.addData(appointmentPatientDoctorViewMapper(appointment));
        return notice;
    }

    async getAppointmentById(
        appointmentId: string,
    ): Promise<InterlayerNotice<AppointmentPatientDoctorViewDto | null>> {
        const notice =
            new InterlayerNotice<AppointmentPatientDoctorViewDto | null>();

        const appointment =
            await this.appointmentsRepository.getAppointmentById(appointmentId);
        if (!appointment) {
            notice.addError('appointment was not found');
            return notice;
        }

        notice.addData(appointmentPatientDoctorViewMapper(appointment));
        return notice;
    }

    async getAppointmentByIdAndPatient(
        appointmentId: string,
        patientId: string,
    ): Promise<InterlayerNotice<AppointmentPatientViewDto | null>> {
        const notice = new InterlayerNotice<AppointmentPatientViewDto | null>();

        const appointment =
            await this.appointmentsRepository.getAppointmentByIdAndPatientId(
                appointmentId,
                patientId,
            );
        if (!appointment) {
            notice.addError('appointment was not found');
            return notice;
        }

        notice.addData(appointmentPatientViewMapper(appointment));
        return notice;
    }

    async makeAppointment(
        datetimeOfAdmission: Date,
        doctorId: string,
        patientId: string,
    ): Promise<InterlayerNotice<AppointmentPatientDoctorViewDto | null>> {
        const notice =
            new InterlayerNotice<AppointmentPatientDoctorViewDto | null>();

        const appointment = await this.appointmentsRepository.makeAppointment(
            datetimeOfAdmission,
            doctorId,
            patientId,
        );
        if (!appointment) {
            notice.addError('appointment was not created');
            return notice;
        }

        notice.addData(appointmentPatientDoctorViewMapper(appointment));
        return notice;
    }

    async updateAppointment(
        appointmentId: string,
        patientId: string,
        datetimeOfAdmission: Date = null,
        doctorId: string = null,
    ): Promise<InterlayerNotice> {
        const notice = new InterlayerNotice();

        //проверить наличие appointment
        const appointment =
            await this.appointmentsRepository.getAppointmentById(appointmentId);
        if (!appointment) {
            notice.addError(
                'appointment was not found',
                'appointmentId',
                InterlayerStatuses.NOT_FOUND,
            );
            return notice;
        }
        //это запись этого пациента
        if (appointment.patientId !== patientId) {
            notice.addError(
                'appointment is not exist to patient',
                'patientId',
                InterlayerStatuses.FORBIDDEN,
            );
            return notice;
        }

        const currentDoctorId = doctorId ? doctorId : appointment.doctorId;

        if (datetimeOfAdmission) {
            //не занято ли у него это время
            const existAppointment =
                await this.appointmentsRepository.getAppointmentByDateAndDoctorId(
                    currentDoctorId,
                    datetimeOfAdmission,
                );
            if (existAppointment) {
                notice.addError(
                    'the appointment for this time already exists',
                    'doctorId',
                    InterlayerStatuses.FORBIDDEN,
                );
                return notice;
            }
        }

        const isUpdatedAppointment =
            await this.appointmentsRepository.updateAppointment(
                appointmentId,
                datetimeOfAdmission,
                currentDoctorId,
            );
        if (!isUpdatedAppointment) {
            notice.addError(
                'appointment was not updated',
                'appointment',
                InterlayerStatuses.BAD_REQUEST,
            );
        }

        return notice;
    }

    async deleteAppointment(appointmentId: string): Promise<InterlayerNotice> {
        const notice = new InterlayerNotice();

        const isAppointmentDeleted =
            await this.appointmentsRepository.deleteAppointment(appointmentId);
        if (!isAppointmentDeleted) {
            notice.addError('appointment was not deleted');
            return notice;
        }

        return notice;
    }

    async getAppointmentsForPatients(
        startPeriod: Date,
        endPeriod: Date,
        patientId: string,
    ): Promise<InterlayerNotice<AppointmentPatientViewDto[]>> {
        const notice = new InterlayerNotice<AppointmentPatientViewDto[]>();

        const appointments =
            await this.appointmentsRepository.getAppointmentByPeriodAndPatientId(
                startPeriod,
                endPeriod,
                patientId,
            );
        if (appointments.length === 0) {
            notice.addError('appointment was not found');
            return notice;
        }

        const mappedAppointments = appointments.map(
            appointmentPatientViewMapper,
        );

        notice.addData(mappedAppointments);
        return notice;
    }

    async getAppointmentsForDoctors(
        startPeriod: Date,
        endPeriod: Date,
        doctorId: string,
    ): Promise<InterlayerNotice<AppointmentDoctorsViewDto[]>> {
        const notice = new InterlayerNotice<AppointmentDoctorsViewDto[]>();

        const appointments =
            await this.appointmentsRepository.getAppointmentByPeriodAndDoctorId(
                startPeriod,
                endPeriod,
                doctorId,
            );
        if (appointments.length === 0) {
            notice.addError('appointment was not found');
            return notice;
        }

        const mappedAppointments = appointments.map(
            appointmentDoctorViewMapper,
        );

        notice.addData(mappedAppointments);
        return notice;
    }
}
