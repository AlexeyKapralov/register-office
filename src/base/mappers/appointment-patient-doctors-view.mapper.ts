import { AppointmentsModel } from '../../database/models/appointments.model';
import { AppointmentPatientViewDto } from '../../features/patients/api/dto/output/appointment-patient-view.dto';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentPatientDoctorViewDto } from '../../common/dto/appointment-patient-view.dto';

export const appointmentPatientDoctorViewMapper = (
    appointment: AppointmentsModel,
): AppointmentPatientDoctorViewDto => {
    return {
        appointmentId: appointment.id,
        createdAt: appointment.createdAt,
        datetimeOfAdmission: appointment.datetimeOfAdmission,
        doctor: {
            doctorId: appointment.doctors[0].id,
            name: `${appointment.doctors[0].firstname} ${appointment.doctors[0].lastname}`,
            region: appointment.doctors[0].region,
            city: appointment.doctors[0].city,
            phoneNumber: appointment.doctors[0].phoneNumber,
            specialization: appointment.doctors[0].specialization,
            dob: appointment.doctors[0].dob,
        },
        patient: {
            name: `${appointment.patients[0].firstname} ${appointment.patients[0].lastname}`,
            dob: appointment.patients[0].dob.toISOString(),
            city: appointment.patients[0].city,
            medicalPolicy: appointment.patients[0].medicalPolicy,
            passport: appointment.patients[0].passportNumber,
        },
    };
};
