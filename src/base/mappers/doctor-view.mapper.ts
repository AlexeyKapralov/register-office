import { DoctorsModel } from '../../database/models/doctors.model';
import { DoctorsViewDto } from '../../features/doctors/api/dto/output/doctors-view-dto';

export const doctorViewMapper = (doctor: DoctorsModel): DoctorsViewDto => {
    return {
        doctorId: doctor.id,
        name: `${doctor.firstname} ${doctor.lastname}`,
        region: doctor.region,
        city: doctor.city,
        phoneNumber: doctor.phoneNumber,
        specialization: doctor.specialization,
        dob: doctor.dob,
    };
};
