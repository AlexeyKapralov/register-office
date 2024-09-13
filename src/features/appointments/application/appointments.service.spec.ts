import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { DoctorsViewDto } from '../../doctors/api/dto/output/doctors-view-dto';
import { InterlayerNotice } from '../../../base/models/interlayer';
import { AppointmentsService } from './appointments.service';
import { AppointmentsRepository } from '../repository/appointments.repository';
import { PatientViewDto } from '../../patients/api/dto/output/patient-view.dto';
import { AppointmentPatientDoctorViewDto } from '../../../common/dto/appointment-patient-view.dto';
import { AppointmentsModel } from '../../../database/models/appointments.model';
import { DoctorsModel } from '../../../database/models/doctors.model';
import { PatientsModel } from '../../../database/models/patients.model';
import * as appointmentPatientDoctorViewMapper from '../../../base/mappers/appointment-patient-doctors-view.mapper';
import * as appointmentPatientViewMapper from '../../../base/mappers/appointment-patient-view.mapper';
import { AppointmentPatientViewDto } from '../../patients/api/dto/output/appointment-patient-view.dto';

describe('AppointmentsService unit tests', () => {
    let appointmentsService: AppointmentsService;
    let appointmentsRepository: AppointmentsRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AppointmentsService,
                {
                    provide: AppointmentsRepository,
                    useValue: createMock<AppointmentsRepository>(),
                },
            ],
        }).compile();

        appointmentsService =
            module.get<AppointmentsService>(AppointmentsService);
        appointmentsRepository = module.get<AppointmentsRepository>(
            AppointmentsRepository,
        );
    });

    it(`shouldn't get appointment with unfounded appointment`, async () => {
        expect(appointmentsService).toBeDefined();

        const doctorId = 'doctorId';
        const date = new Date();
        const appointmentsModel = null;
        jest.spyOn(
            appointmentsRepository,
            'getAppointmentByDateAndDoctorId',
        ).mockResolvedValue(appointmentsModel);
        const result =
            await appointmentsService.getAppointmentByDateAndDoctorId(
                doctorId,
                date,
            );
        expect(result.hasError()).toBeTruthy();
    });

    it('should get appointment', async () => {
        expect(appointmentsService).toBeDefined();

        const doctorId = 'doctorId';
        const date = new Date();
        const appointmentsModel = {
            id: 'str',
            datetimeOfAdmission: date,
            doctorId: doctorId,
            doctors: {} as DoctorsModel[],
            patients: {} as PatientsModel[],
            patientId: 'string',
            createdAt: date,
        } as AppointmentsModel;
        const appointmentPatientDoctorViewDto: AppointmentPatientDoctorViewDto =
            {
                appointmentId: 'string',
                datetimeOfAdmission: date,
                patient: {} as PatientViewDto,
                doctor: {} as DoctorsViewDto,
                createdAt: date,
            };
        const appointmentInterlayer = new InterlayerNotice(appointmentsService);

        jest.spyOn(
            appointmentsRepository,
            'getAppointmentByDateAndDoctorId',
        ).mockResolvedValue(appointmentsModel);

        jest.spyOn(
            appointmentPatientDoctorViewMapper,
            'appointmentPatientDoctorViewMapper',
        ).mockReturnValue(appointmentPatientDoctorViewDto);

        const result =
            await appointmentsService.getAppointmentByDateAndDoctorId(
                doctorId,
                date,
            );
        expect(result.data).toEqual(appointmentPatientDoctorViewDto);
        expect(
            appointmentsRepository.getAppointmentByDateAndDoctorId,
        ).toHaveBeenCalledWith(doctorId, date);
        expect(
            appointmentsRepository.getAppointmentByDateAndDoctorId,
        ).toHaveBeenCalledTimes(1);
    });

    it('should get appointment by id', async () => {
        expect(appointmentsService).toBeDefined();

        const appointmentId = 'appointmentId';

        const doctorId = 'doctorId';
        const date = new Date();
        const appointmentsModel = {
            id: 'str',
            datetimeOfAdmission: date,
            doctorId: doctorId,
            doctors: {} as DoctorsModel[],
            patients: {} as PatientsModel[],
            patientId: 'string',
            createdAt: date,
        } as AppointmentsModel;
        const appointmentPatientDoctorViewDto: AppointmentPatientDoctorViewDto =
            {
                appointmentId: 'string',
                datetimeOfAdmission: date,
                patient: {} as PatientViewDto,
                doctor: {} as DoctorsViewDto,
                createdAt: date,
            };
        // const appointmentInterlayer = new InterlayerNotice(appointmentsService);
        //
        jest.spyOn(
            appointmentsRepository,
            'getAppointmentById',
        ).mockResolvedValue(appointmentsModel);

        jest.spyOn(
            appointmentPatientDoctorViewMapper,
            'appointmentPatientDoctorViewMapper',
        ).mockReturnValue(appointmentPatientDoctorViewDto);

        const result = await appointmentsService.getAppointmentById(doctorId);
        expect(result.data).toEqual(appointmentPatientDoctorViewDto);
        expect(appointmentsRepository.getAppointmentById).toHaveBeenCalledWith(
            doctorId,
        );
        expect(appointmentsRepository.getAppointmentById).toHaveBeenCalledTimes(
            1,
        );
    });

    it('should get appointment by id and patient', async () => {
        expect(appointmentsService).toBeDefined();

        const appointmentId = 'appointmentId';
        const patientId = 'patientId';

        const doctorId = 'doctorId';
        const date = new Date();
        const appointmentsModel = {
            id: 'str',
            datetimeOfAdmission: date,
            doctorId: doctorId,
            doctors: {} as DoctorsModel[],
            patients: {} as PatientsModel[],
            patientId: 'string',
            createdAt: date,
        } as AppointmentsModel;
        const appointmentPatientViewDto: AppointmentPatientViewDto = {
            appointmentId: 'string',
            datetimeOfAdmission: date,
            doctor: {} as DoctorsViewDto,
            createdAt: date,
        };
        jest.spyOn(
            appointmentsRepository,
            'getAppointmentByIdAndPatientId',
        ).mockResolvedValue(appointmentsModel);

        jest.spyOn(
            appointmentPatientViewMapper,
            'appointmentPatientViewMapper',
        ).mockReturnValue(appointmentPatientViewDto);

        const result = await appointmentsService.getAppointmentByIdAndPatient(
            appointmentId,
            patientId,
        );
        expect(result.data).toEqual(appointmentPatientViewDto);
        expect(
            appointmentsRepository.getAppointmentByIdAndPatientId,
        ).toHaveBeenCalledWith(appointmentId, patientId);
        expect(
            appointmentsRepository.getAppointmentByIdAndPatientId,
        ).toHaveBeenCalledTimes(1);
    });

    it('should make appointment', async () => {
        const datetimeOfAdmission = new Date();
        const doctorId = 'doctorId';
        const patientId = 'patientId';
        const appointmentPatientDoctorViewDto =
            {} as AppointmentPatientDoctorViewDto;
        const appointmentInterlayer = new InterlayerNotice(
            appointmentPatientDoctorViewDto,
        );
        const appointmentId = 'appointmentId';
        const date = new Date();
        const appointmentsModel = {} as AppointmentsModel;

        jest.spyOn(appointmentsRepository, 'makeAppointment').mockResolvedValue(
            appointmentsModel,
        );

        jest.spyOn(
            appointmentPatientDoctorViewMapper,
            'appointmentPatientDoctorViewMapper',
        ).mockReturnValue(appointmentPatientDoctorViewDto);

        const result = await appointmentsService.makeAppointment(
            datetimeOfAdmission,
            doctorId,
            patientId,
        );
        expect(result.data).toEqual(appointmentInterlayer.data);
        expect(appointmentsRepository.makeAppointment).toHaveBeenCalledWith(
            datetimeOfAdmission,
            doctorId,
            patientId,
        );
    });

    it('should update appointment', async () => {
        const appointmentId = 'appointmentId';
        const patientId = 'patientId';
        const datetimeOfAdmission = new Date();
        const doctorId = 'doctorId';
        const interlayer = new InterlayerNotice();
        // const date = new Date();
        const appointmentsModel = {
            doctorId: 'doctorId',
            patientId: 'patientId',
        } as AppointmentsModel;
        const updateAppointmentResult = Promise.resolve(true);
        const isExistsAppointment = null;

        jest.spyOn(
            appointmentsRepository,
            'getAppointmentById',
        ).mockResolvedValue(appointmentsModel);

        jest.spyOn(
            appointmentsRepository,
            'getAppointmentByDateAndDoctorId',
        ).mockResolvedValue(isExistsAppointment);

        jest.spyOn(
            appointmentsRepository,
            'updateAppointment',
        ).mockResolvedValue(updateAppointmentResult);

        const result = await appointmentsService.updateAppointment(
            appointmentId,
            patientId,
            datetimeOfAdmission,
            doctorId,
        );
        console.log(result);
        expect(result.hasError()).toBeFalsy();
    });

    it('should delete appointment', async () => {
        const appointmentId = 'appointmentId';
        const interlayer = new InterlayerNotice();
        const deleteAppointmentResult = Promise.resolve(true);

        jest.spyOn(
            appointmentsRepository,
            'deleteAppointment',
        ).mockResolvedValue(deleteAppointmentResult);

        const result =
            await appointmentsService.deleteAppointment(appointmentId);
        expect(result.hasError()).toBeFalsy();
    });

    it('should delete appointment by date and doctor', async () => {
        const doctorId = 'doctorId';
        const date = new Date();
        const interlayer = new InterlayerNotice();
        const deleteAppointmentResult = Promise.resolve(true);

        jest.spyOn(
            appointmentsRepository,
            'deleteAppointmentsByDayAndDoctorId',
        ).mockResolvedValue(deleteAppointmentResult);

        const result =
            await appointmentsService.deleteAppointmentsByDateAndDoctor(
                doctorId,
                date,
            );
        expect(result.hasError()).toBeFalsy();
    });

    it('should get appointments for patients', async () => {
        const startPeriod = new Date();
        const endPeriod = new Date();
        const patientId = 'patientId';
        const interlayer = new InterlayerNotice();
        const appointmentPatientViewDtoArray =
            [] as AppointmentPatientViewDto[];
        const appointmentPatientViewDto = {} as AppointmentPatientViewDto;
        const appointmentsModel = [] as AppointmentsModel[];

        jest.spyOn(
            appointmentsRepository,
            'getAppointmentByPeriodAndPatientId',
        ).mockResolvedValue(appointmentsModel);

        jest.spyOn(
            appointmentPatientViewMapper,
            'appointmentPatientViewMapper',
        ).mockReturnValue(appointmentPatientViewDto);

        const result = await appointmentsService.getAppointmentsForPatients(
            startPeriod,
            endPeriod,
            patientId,
        );
        expect(result.hasError()).toBeFalsy();
    });

    it('should get appointments for patients', async () => {
        const startPeriod = new Date();
        const endPeriod = new Date();
        const patientId = 'patientId';
        const interlayer = new InterlayerNotice();
        const appointmentPatientViewDtoArray =
            [] as AppointmentPatientViewDto[];
        const appointmentPatientViewDto = {} as AppointmentPatientViewDto;
        const appointmentsModel = [] as AppointmentsModel[];

        jest.spyOn(
            appointmentsRepository,
            'getAppointmentByPeriodAndPatientId',
        ).mockResolvedValue(appointmentsModel);

        jest.spyOn(
            appointmentPatientViewMapper,
            'appointmentPatientViewMapper',
        ).mockReturnValue(appointmentPatientViewDto);

        const result = await appointmentsService.getAppointmentsForPatients(
            startPeriod,
            endPeriod,
            patientId,
        );
        expect(result.hasError()).toBeFalsy();
    });
});
