import { AppointmentsModel } from '../../database/models/appointments.model';
import { AppointmentPatientViewDto } from '../../features/patients/api/dto/output/appointment-patient-view.dto';
import { ApiProperty } from '@nestjs/swagger';

export const appointmentPatientViewMapper = (
    appointment: AppointmentsModel,
): AppointmentPatientViewDto => {
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
    };
};
