import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from '../../appointments/application/appointments.service';
import { createMock } from '@golevelup/ts-jest';
import { DoctorsService } from './doctors.service';
import { DoctorsRepository } from '../infrastructure/doctors.repository';
import { InterlayerNotice } from '../../../base/models/interlayer';
import { DoctorsViewDto } from '../api/dto/output/doctors-view-dto';
import { DoctorsModel } from '../../../database/models/doctors.model';
import * as doctorViewMapper from '../../../base/mappers/doctor-view.mapper';
import { DoctorInputDto } from '../api/dto/input/doctor-input.dto';
import { AppointmentDoctorsViewDto } from '../api/dto/output/appointment-doctors-view.dto';
import { DoctorsFreeSlotsViewDto } from '../api/dto/output/doctors-free-slots-view.dto';
import { DoctorsWorkScheduleModel } from '../../../database/models/doctorsWorkSchedule.model';
import { AppointmentsModel } from '../../../database/models/appointments.model';
import { FreeSlotsDoctorQueryDto } from '../api/dto/input/free-slots-doctor-query.dto';
import { ApiProperty } from '@nestjs/swagger';
import { SlotsInfoViewDto } from '../../patients/api/dto/output/slots-info-view.dto';
import { SchedulePeriodInputDto } from '../api/dto/input/schedule-period-input.dto';
import { ScheduleViewDto } from '../api/dto/output/shedule-view.dto';
import dayjs from 'dayjs';

describe('Doctors service unit tests', () => {
    let doctorsService: DoctorsService;
    let doctorsRepository: DoctorsRepository;
    let appointmentsService: AppointmentsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DoctorsService,
                {
                    provide: DoctorsRepository,
                    useValue: createMock<DoctorsRepository>(),
                },
                {
                    provide: AppointmentsService,
                    useValue: createMock<AppointmentsService>(),
                },
            ],
        }).compile();

        doctorsService = module.get<DoctorsService>(DoctorsService);
        doctorsRepository = module.get<DoctorsRepository>(DoctorsRepository);
        appointmentsService =
            module.get<AppointmentsService>(AppointmentsService);
    });

    it('should get doctor by id', async () => {
        const doctorId = 'doctorId';
        const interlayer = new InterlayerNotice();
        const doctorsViewDto = {} as DoctorsViewDto;
        const doctorsModel = {} as DoctorsModel;

        jest.spyOn(doctorsRepository, 'getDoctorById').mockResolvedValue(
            doctorsModel,
        );

        jest.spyOn(doctorViewMapper, 'doctorViewMapper').mockReturnValue(
            doctorsViewDto,
        );

        const result = await doctorsService.getDoctorById(doctorId);
        expect(result.hasError()).toBeFalsy();
        expect(result.data).toEqual(doctorsViewDto);
    });

    it('should create doctor', async () => {
        const doctorInputDto = {} as DoctorInputDto;
        const userId = 'userId';
        const notice = new InterlayerNotice<DoctorsViewDto>();
        const doctorsViewDto = {} as DoctorsViewDto;
        const doctorsModel = {} as DoctorsModel;

        jest.spyOn(doctorsRepository, 'createDoctor').mockResolvedValue(
            doctorsModel,
        );

        jest.spyOn(doctorViewMapper, 'doctorViewMapper').mockReturnValue(
            doctorsViewDto,
        );

        const result = await doctorsService.createDoctor(
            doctorInputDto,
            userId,
            null,
        );
        expect(result.hasError()).toBeFalsy();
        expect(result.data).toEqual(doctorsViewDto);
    });

    it('should delete doctor', async () => {
        const doctorId = 'doctorId';
        const notice = new InterlayerNotice();
        const doctorsViewDto = {} as DoctorsViewDto;
        const doctorsModel = {} as DoctorsModel;
        const deleteResult = Promise.resolve(true);

        jest.spyOn(doctorsRepository, 'getDoctorById').mockResolvedValue(
            doctorsModel,
        );

        jest.spyOn(doctorsRepository, 'deleteDoctor').mockResolvedValue(
            deleteResult,
        );

        const result = await doctorsService.deleteDoctor(doctorId, null);
        expect(result.hasError()).toBeFalsy();
    });

    it('should get user by doctor id', async () => {
        const doctorId = 'doctorId';
        const notice = new InterlayerNotice<string>();
        const doctorsModel = { user: { id: 'id' } } as DoctorsModel;
        const userId = 'userId';

        jest.spyOn(doctorsRepository, 'getDoctorWithUser').mockResolvedValue(
            doctorsModel,
        );

        const result = await doctorsService.getUserIdByDoctorId(doctorId);
        expect(result.hasError()).toBeFalsy();
        expect(result.data).toEqual(doctorsModel.user.id);
    });

    it('should get doctor by user id', async () => {
        const userId = 'userId';
        const notice = new InterlayerNotice<DoctorsViewDto | null>();
        const doctorsModel = {} as DoctorsModel;
        const doctorsViewDto = {} as DoctorsViewDto;

        jest.spyOn(doctorsRepository, 'getDoctorByUserId').mockResolvedValue(
            doctorsModel,
        );

        jest.spyOn(doctorViewMapper, 'doctorViewMapper').mockReturnValue(
            doctorsViewDto,
        );

        const result = await doctorsService.getDoctorByUserId(userId);
        expect(result.hasError()).toBeFalsy();
        expect(result.data).toEqual(doctorsViewDto);
    });

    it('should get appointments', async () => {
        const startPeriod = new Date();
        const endPeriod = new Date();
        const userId = 'userId';
        const appointmentsViewDto = {} as AppointmentDoctorsViewDto[];
        const notice = new InterlayerNotice(appointmentsViewDto);
        const doctorsModel = {} as DoctorsModel;

        jest.spyOn(doctorsRepository, 'getDoctorByUserId').mockResolvedValue(
            doctorsModel,
        );

        jest.spyOn(
            appointmentsService,
            'getAppointmentsForDoctors',
        ).mockResolvedValue(notice);

        const result = await doctorsService.getAppointments(
            startPeriod,
            endPeriod,
            userId,
        );
        expect(result.hasError()).toBeFalsy();
        expect(result.data).toEqual(appointmentsViewDto);
    });

    it('should get free slots by period', async () => {
        const doctorId = 'doctorId';
        const query = { period: 'day' } as FreeSlotsDoctorQueryDto;
        const doctorsFreeSlotsViewDto = {} as DoctorsFreeSlotsViewDto;
        const appointments = [] as AppointmentsModel[];
        const notice = new InterlayerNotice<DoctorsFreeSlotsViewDto>(
            doctorsFreeSlotsViewDto,
        );
        const doctorsModel = {} as DoctorsModel;
        const schedule = [] as
            | Pick<
                  DoctorsWorkScheduleModel,
                  'startWorkTime' | 'endWorkTime' | 'workDate'
              >[]
            | null;

        jest.spyOn(doctorsRepository, 'getDoctorById').mockResolvedValue(
            doctorsModel,
        );
        jest.spyOn(doctorsRepository, 'getScheduleByPeriod').mockResolvedValue(
            schedule,
        );
        jest.spyOn(doctorsRepository, 'getAppointments').mockResolvedValue(
            appointments,
        );

        const result = await doctorsService.getFreeSlotsByPeriod(
            doctorId,
            query,
        );
        expect(result.hasError()).toBeFalsy();
    });

    it('should get schedule for doctor', async () => {
        const doctorId = 'doctorId';
        const schedulePeriodInputDto = {} as SchedulePeriodInputDto;
        const scheduleViewDto: ScheduleViewDto[] = [
            {
                date: new Date().toISOString(),
                startWorkTime: new Date().toISOString(),
                endWorkTime: new Date().toISOString(),
            },
        ];
        const notice = new InterlayerNotice<ScheduleViewDto[] | null>(
            scheduleViewDto,
        );

        const schedule = [
            {
                workDate: new Date(scheduleViewDto[0].date),
                endWorkTime: new Date(scheduleViewDto[0].endWorkTime),
                startWorkTime: new Date(scheduleViewDto[0].startWorkTime),
            },
        ] as
            | Pick<
                  DoctorsWorkScheduleModel,
                  'startWorkTime' | 'endWorkTime' | 'workDate'
              >[]
            | null;

        jest.spyOn(doctorsRepository, 'getScheduleByPeriod').mockResolvedValue(
            schedule,
        );

        const result = await doctorsService.getScheduleForDoctor(
            doctorId,
            schedulePeriodInputDto,
        );
        expect(result.hasError()).toBeFalsy();
        expect(result.data).toEqual(scheduleViewDto);
    });

    it('should get schedule for day', async () => {
        const doctorId = 'doctorId';
        const date = new Date();
        const scheduleViewDto: ScheduleViewDto = {
            date: new Date().toISOString(),
            startWorkTime: new Date().toISOString(),
            endWorkTime: new Date().toISOString(),
        };
        const notice = new InterlayerNotice<ScheduleViewDto>(scheduleViewDto);

        const schedule = [
            {
                workDate: new Date(scheduleViewDto.date),
                endWorkTime: new Date(scheduleViewDto.endWorkTime),
                startWorkTime: new Date(scheduleViewDto.startWorkTime),
            },
        ] as
            | Pick<
                  DoctorsWorkScheduleModel,
                  'startWorkTime' | 'endWorkTime' | 'workDate'
              >[]
            | null;

        jest.spyOn(doctorsRepository, 'getScheduleByPeriod').mockResolvedValue(
            schedule,
        );

        const result = await doctorsService.getScheduleForDay(doctorId, date);
        expect(result.hasError()).toBeFalsy();
        expect(result.data).toEqual(scheduleViewDto);
    });

    it('should update doctor', async () => {
        const doctorId = 'string';
        const firstname = 'firstname';
        const lastname = 'lastname';
        const region = 'region';
        const city = 'city';
        const phoneNumber = 'phoneNumber';
        const specialization = 'specialization';
        const dob = new Date();
        const notice = new InterlayerNotice();
        const updateResult = Promise.resolve(true);

        jest.spyOn(doctorsRepository, 'updateDoctor').mockResolvedValue(
            updateResult,
        );

        const result = await doctorsService.updateDoctor(
            doctorId,
            firstname,
            lastname,
            region,
            city,
            phoneNumber,
            specialization,
            dob,
            null,
        );
        expect(result.hasError()).toBeFalsy();
    });

    it('should create schedule for day', async () => {
        const doctorId = 'doctorId';
        const workDate = dayjs().toDate();
        const startDate = dayjs().toDate();
        const finishDate = dayjs().add(2, 'hour').toDate();

        const notice = new InterlayerNotice();
        const createResult = Promise.resolve(true);
        const isWorkDay = Promise.resolve(false);
        const doctorModel = {} as DoctorsModel;

        jest.spyOn(doctorsRepository, 'getDoctorById').mockResolvedValue(
            doctorModel,
        );
        jest.spyOn(doctorsRepository, 'checkWorkDayDoctor').mockResolvedValue(
            isWorkDay,
        );
        jest.spyOn(doctorsRepository, 'createWorkSchedule').mockResolvedValue(
            createResult,
        );

        const result = await doctorsService.createScheduleForDay(
            doctorId,
            workDate,
            startDate,
            finishDate,
            null,
        );
        console.log(result);
        expect(result.hasError()).toBeFalsy();
    });

    it('should update schedule for day', async () => {
        const doctorId = 'doctorId';
        const workDate = dayjs().toDate();
        const startDate = dayjs().toDate();
        const finishDate = dayjs().add(2, 'hour').toDate();

        const notice = new InterlayerNotice();
        const updateResult = Promise.resolve(true);
        const doctorModel = {} as DoctorsModel;

        jest.spyOn(doctorsRepository, 'getDoctorById').mockResolvedValue(
            doctorModel,
        );
        jest.spyOn(doctorsRepository, 'checkWorkDayDoctor').mockResolvedValue(
            updateResult,
        );
        jest.spyOn(doctorsRepository, 'updateWorkSchedule').mockResolvedValue(
            updateResult,
        );

        const result = await doctorsService.updateScheduleForDay(
            doctorId,
            workDate,
            startDate,
            finishDate,
            null,
        );
        expect(result.hasError()).toBeFalsy();
    });

    it('should delete schedule for day', async () => {
        const doctorId = 'doctorId';
        const workDate = dayjs().toDate();

        const notice = new InterlayerNotice();
        const updateResult = Promise.resolve(true);
        const doctorModel = {} as DoctorsModel;

        jest.spyOn(doctorsRepository, 'getDoctorById').mockResolvedValue(
            doctorModel,
        );
        jest.spyOn(doctorsRepository, 'checkWorkDayDoctor').mockResolvedValue(
            updateResult,
        );
        jest.spyOn(doctorsRepository, 'deleteWorkSchedule').mockResolvedValue(
            updateResult,
        );

        const result = await doctorsService.deleteScheduleForDay(
            doctorId,
            workDate,
            null,
        );
        expect(result.hasError()).toBeFalsy();
    });
});
