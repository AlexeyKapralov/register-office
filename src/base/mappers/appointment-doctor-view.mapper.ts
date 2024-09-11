import { AppointmentsModel } from '../../database/models/appointments.model';
import { AppointmentDoctorsViewDto } from '../../features/doctors/api/dto/output/appointment-doctors-view.dto';

export const appointmentDoctorViewMapper = (
    appointment: AppointmentsModel,
): AppointmentDoctorsViewDto => {
    return {
        appointmentId: appointment.id,
        createdAt: appointment.createdAt.toISOString(),
        datetimeOfAdmission: appointment.datetimeOfAdmission.toISOString(),
        patient: {
            name: `${appointment.patients[0].firstname} ${appointment.patients[0].lastname}`,
            dob: appointment.patients[0].dob.toISOString(),
            city: appointment.patients[0].city,
            medicalPolicy: appointment.patients[0].medicalPolicy,
            passport: appointment.patients[0].passportNumber,
        },
    };
};
