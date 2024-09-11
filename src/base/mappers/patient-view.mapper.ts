import { PatientsModel } from '../../database/models/patients.model';
import { PatientViewDto } from '../../features/patients/api/dto/output/patient-view.dto';
import { ApiProperty } from '@nestjs/swagger';

export const patientViewMapper = (patient: PatientsModel): PatientViewDto => {
    return {
        name: `${patient.firstname} ${patient.lastname}`,
        dob: patient.dob.toISOString(),
        city: patient.city,
        medicalPolicy: patient.medicalPolicy,
        passport: patient.passportNumber,
    };
};
