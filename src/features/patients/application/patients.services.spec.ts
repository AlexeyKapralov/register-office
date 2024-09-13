import { PatientsService } from './patients.service';
import { DoctorsService } from '../../doctors/application/doctors.service';
import { AppointmentsService } from '../../appointments/application/appointments.service';
import { PatientsRepository } from '../infrastructure/patients.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { InterlayerNotice } from '../../../base/models/interlayer';
import { DoctorsViewDto } from '../../doctors/api/dto/output/doctors-view-dto';
import { AppointmentPatientViewDto } from '../api/dto/output/appointment-patient-view.dto';
import { ScheduleViewDto } from '../../doctors/api/dto/output/shedule-view.dto';
import { AppointmentPatientDoctorViewDto } from '../../../common/dto/appointment-patient-view.dto';
import { PatientsModel } from '../../../database/models/patients.model';
import dayjs from 'dayjs';

describe('Patients services unit tests', () => {
    let patientsService: PatientsService;
    let doctorsService: DoctorsService;
    let appointmentsService: AppointmentsService;
    let patientsRepository: PatientsRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PatientsService,
                {
                    provide: DoctorsService,
                    useValue: createMock<DoctorsService>(),
                },
                {
                    provide: AppointmentsService,
                    useValue: createMock<AppointmentsService>(),
                },
                {
                    provide: PatientsRepository,
                    useValue: createMock<PatientsRepository>(),
                },
            ],
        }).compile();

        patientsService = module.get<PatientsService>(PatientsService);
        doctorsService = module.get<DoctorsService>(DoctorsService);
        appointmentsService =
            module.get<AppointmentsService>(AppointmentsService);
        patientsRepository = module.get<PatientsRepository>(PatientsRepository);
    });

    it('should create appointment', async () => {
        const datetimeOfAdmission = new Date();
        const doctorId = 'doctorId';
        const userId = 'userId';

        const appointmentPatientViewDto = {} as AppointmentPatientViewDto;
        const notice = new InterlayerNotice<AppointmentPatientViewDto>(
            appointmentPatientViewDto,
        );

        const patient: PatientsModel = {
            id: 'patientId',
            firstname: 'firsname',
            lastname: 'lastname',
            userId: 'userId',
            medicalPolicy: 'medicalPolicy',
            passportNumber: 'passportNumber',
            dob: new Date(),
            city: 'city',
        } as PatientsModel;

        const doctorsViewDto: DoctorsViewDto = {
            doctorId: doctorId,
            name: 'name',
            region: 'region',
            city: 'city',
            phoneNumber: 'phoneNumber',
            specialization: 'specialization',
            dob: new Date(),
        };
        const doctorInterlayer = new InterlayerNotice<DoctorsViewDto>(
            doctorsViewDto,
        );

        const existAppointmentPatientDoctorViewDto: AppointmentPatientDoctorViewDto =
            null;
        const newAppointmentPatientDoctorViewDto: AppointmentPatientDoctorViewDto =
            {
                appointmentId: 'appointmentId',
                patient: {
                    medicalPolicy: patient.medicalPolicy,
                    dob: patient.dob.toISOString(),
                    city: patient.city,
                    name: patient.lastname,
                    passport: patient.passportNumber,
                },
                doctor: {
                    doctorId: doctorId,
                    name: doctorInterlayer.data.name,
                    dob: doctorInterlayer.data.dob,
                    city: doctorInterlayer.data.city,
                    specialization: doctorInterlayer.data.specialization,
                    phoneNumber: doctorInterlayer.data.phoneNumber,
                    region: doctorInterlayer.data.region,
                },
                datetimeOfAdmission: datetimeOfAdmission,
                createdAt: new Date(),
            };
        const existsAppointmentInterlayer =
            new InterlayerNotice<AppointmentPatientDoctorViewDto | null>(
                existAppointmentPatientDoctorViewDto,
            );
        const newAppointmentInterlayer =
            new InterlayerNotice<AppointmentPatientDoctorViewDto | null>(
                newAppointmentPatientDoctorViewDto,
            );

        const scheduleViewDto: ScheduleViewDto = {
            date: datetimeOfAdmission.toISOString(),
            startWorkTime: datetimeOfAdmission.toISOString(),
            endWorkTime: datetimeOfAdmission.toISOString(),
        };
        const scheduleInterlayer = new InterlayerNotice<ScheduleViewDto>(
            scheduleViewDto,
        );

        jest.spyOn(doctorsService, 'getDoctorById').mockResolvedValue(
            doctorInterlayer,
        );

        jest.spyOn(doctorsService, 'getScheduleForDay').mockResolvedValue(
            scheduleInterlayer,
        );
        jest.spyOn(
            appointmentsService,
            'getAppointmentByDateAndDoctorId',
        ).mockResolvedValue(existsAppointmentInterlayer);
        jest.spyOn(patientsRepository, 'getPatientByUserId').mockResolvedValue(
            patient,
        );
        jest.spyOn(appointmentsService, 'makeAppointment').mockResolvedValue(
            newAppointmentInterlayer,
        );

        const result = await patientsService.createAppointment(
            datetimeOfAdmission,
            doctorId,
            userId,
        );
        expect(result.hasError()).toBeFalsy();
        expect(result.data).toEqual(newAppointmentInterlayer);
    });

    it('should delete appointment', async () => {
        const appointmentId = 'appointmentId';
        const doctorId = 'doctorId';
        const userId = 'userId';

        const patient: PatientsModel = {
            id: 'patientId',
            firstname: 'firsname',
            lastname: 'lastname',
            userId: 'userId',
            medicalPolicy: 'medicalPolicy',
            passportNumber: 'passportNumber',
            dob: new Date(),
            city: 'city',
        } as PatientsModel;

        const doctorsViewDto: DoctorsViewDto = {
            doctorId: doctorId,
            name: 'name',
            region: 'region',
            city: 'city',
            phoneNumber: 'phoneNumber',
            specialization: 'specialization',
            dob: new Date(),
        };
        const doctorInterlayer = new InterlayerNotice<DoctorsViewDto>(
            doctorsViewDto,
        );
        const appointmentPatientDoctorViewDto =
            {} as AppointmentPatientDoctorViewDto;
        const existsAppointmentInterlayer =
            new InterlayerNotice<AppointmentPatientDoctorViewDto | null>(
                appointmentPatientDoctorViewDto,
            );
        const deleteInterlayer = new InterlayerNotice();

        jest.spyOn(patientsRepository, 'getPatientByUserId').mockResolvedValue(
            patient,
        );

        jest.spyOn(appointmentsService, 'getAppointmentById').mockResolvedValue(
            existsAppointmentInterlayer,
        );
        jest.spyOn(
            appointmentsService,
            'getAppointmentByIdAndPatient',
        ).mockResolvedValue(existsAppointmentInterlayer);
        jest.spyOn(appointmentsService, 'deleteAppointment').mockResolvedValue(
            deleteInterlayer,
        );

        const result = await patientsService.deleteAppointment(
            appointmentId,
            doctorId,
            userId,
        );
        expect(result.hasError()).toBeFalsy();
    });

    it('should update appointment', async () => {
        const appointmentId = 'appointmentId';
        const userId = 'userId';
        const datetimeOfAdmission = new Date();
        const doctorId = 'doctorId';

        const patient: PatientsModel = {
            id: 'patientId',
            firstname: 'firsname',
            lastname: 'lastname',
            userId: 'userId',
            medicalPolicy: 'medicalPolicy',
            passportNumber: 'passportNumber',
            dob: new Date(),
            city: 'city',
        } as PatientsModel;

        const scheduleViewDto = {} as ScheduleViewDto;
        const scheduleInterlayer = new InterlayerNotice<ScheduleViewDto>(
            scheduleViewDto,
        );

        const updateInterlayer = new InterlayerNotice();

        jest.spyOn(patientsRepository, 'getPatientByUserId').mockResolvedValue(
            patient,
        );

        jest.spyOn(doctorsService, 'getScheduleForDay').mockResolvedValue(
            scheduleInterlayer,
        );
        jest.spyOn(appointmentsService, 'updateAppointment').mockResolvedValue(
            updateInterlayer,
        );

        const result = await patientsService.deleteAppointment(
            appointmentId,
            doctorId,
            userId,
        );
        expect(result.hasError()).toBeFalsy();
    });

    it('should update appointment', async () => {
        const startPeriod = dayjs().toDate();
        const endPeriod = dayjs().add(20, 'days').toDate();
        const userId = 'userId';

        const appointmentPatientViewDto: AppointmentPatientViewDto[] = [
            {
                appointmentId: 'appointmentId',
                doctor: {} as DoctorsViewDto,
                createdAt: new Date(),
                datetimeOfAdmission: new Date(),
            },
        ];
        const appointmentInterlayer = new InterlayerNotice<
            AppointmentPatientViewDto[]
        >(appointmentPatientViewDto);

        const patient: PatientsModel = {
            id: 'patientId',
            firstname: 'firsname',
            lastname: 'lastname',
            userId: 'userId',
            medicalPolicy: 'medicalPolicy',
            passportNumber: 'passportNumber',
            dob: new Date(),
            city: 'city',
        } as PatientsModel;

        jest.spyOn(patientsRepository, 'getPatientByUserId').mockResolvedValue(
            patient,
        );

        const result = await patientsService.getAppointments(
            startPeriod,
            endPeriod,
            userId,
        );
        expect(result.hasError()).toBeFalsy();
        expect(result.data).toEqual(appointmentPatientViewDto);
    });
});
