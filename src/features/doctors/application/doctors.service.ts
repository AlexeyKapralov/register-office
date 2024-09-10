import { Injectable } from '@nestjs/common';
import { DoctorsRepository } from '../infrastructure/doctors.repository';
import {
    InterlayerNotice,
    InterlayerStatuses,
} from '../../../base/models/interlayer';
import { DoctorsViewDto } from '../api/dto/output/doctors-view-dto';
import { doctorViewMapper } from '../../../base/mappers/doctor-view.mapper';
import { DoctorInputDto } from '../api/dto/input/doctor-input.dto';
import { Knex } from 'knex';
import dayjs from 'dayjs';
import { FreeSlotsDoctorQueryDto } from '../api/dto/input/free-slots-doctor-query.dto';
import {
    DoctorsFreeSlotsViewDto,
    PeriodEnum,
} from '../api/dto/output/doctors-free-slots-view.dto';
import { DoctorsWorkScheduleModel } from '../../../database/models/doctorsWorkSchedule.model';
import { freeSlots } from '../../patients/api/dto/output/slots-info-view.dto';
import { AppointmentsModel } from '../../../database/models/appointments.model';
import utc from 'dayjs/plugin/utc';
import { SchedulePeriodInputDto } from '../api/dto/input/schedule-period-input.dto';
import { ScheduleViewDto } from '../api/dto/output/shedule-view.dto';
import { ApiProperty } from '@nestjs/swagger';

dayjs.extend(utc);

@Injectable()
export class DoctorsService {
    constructor(private doctorsRepository: DoctorsRepository) {}

    async getDoctorById(
        doctorId: string,
    ): Promise<InterlayerNotice<DoctorsViewDto>> {
        const notice = new InterlayerNotice<DoctorsViewDto>();
        const doctor = await this.doctorsRepository.getDoctorById(doctorId);
        if (!doctor) {
            notice.addError('doctor was not found');
            return notice;
        }
        notice.addData(doctorViewMapper(doctor));
        return notice;
    }

    async createDoctor(
        doctorInputDto: DoctorInputDto,
        userId: string,
        trx: Knex.Transaction,
    ): Promise<InterlayerNotice<DoctorsViewDto>> {
        const notice = new InterlayerNotice<DoctorsViewDto>();
        const doctor = await this.doctorsRepository.createDoctor(
            doctorInputDto,
            userId,
            trx,
        );
        if (!doctor) {
            notice.addError('doctor was not found');
            return notice;
        }
        notice.addData(doctorViewMapper(doctor));
        return notice;
    }

    async deleteDoctor(
        doctorId: string,
        trx: Knex.Transaction,
    ): Promise<InterlayerNotice> {
        const notice = new InterlayerNotice();

        const doctor = await this.doctorsRepository.getDoctorById(doctorId);
        if (!doctor) {
            notice.addError('doctor was not found');
        }

        const isDoctorDeleted = await this.doctorsRepository.deleteDoctor(
            doctorId,
            trx,
        );
        if (!isDoctorDeleted) {
            notice.addError('doctor was not deleted');
            return notice;
        }
        return notice;
    }

    async getUserIdByDoctorId(
        doctorId: string,
    ): Promise<InterlayerNotice<string>> {
        const notice = new InterlayerNotice<string>();
        const doctorWithUser =
            await this.doctorsRepository.getDoctorWithUser(doctorId);
        if (!doctorWithUser) {
            notice.addError('doctor was not found');
            return notice;
        }
        notice.addData(doctorWithUser.user.id);
        return notice;
    }

    async getDoctorByUserId(
        userId: string,
    ): Promise<InterlayerNotice<DoctorsViewDto | null>> {
        const notice = new InterlayerNotice<DoctorsViewDto | null>();
        const doctor = await this.doctorsRepository.getDoctorByUserId(userId);
        if (!doctor) {
            notice.addError('doctor was not found');
            return notice;
        }
        notice.addData(doctorViewMapper(doctor));
        return notice;
    }

    async getFreeSlotsByPeriod(
        doctorId: string,
        query: FreeSlotsDoctorQueryDto,
    ): Promise<InterlayerNotice<DoctorsFreeSlotsViewDto | null>> {
        const notice = new InterlayerNotice<DoctorsFreeSlotsViewDto | null>();

        const doctor = await this.doctorsRepository.getDoctorById(doctorId);
        if (!doctor) {
            notice.addError('Doctor was not found');
            return notice;
        }

        let numberToAdd: number;
        switch (query.period) {
            case PeriodEnum.Day:
                numberToAdd = 1;
                break;
            case PeriodEnum.Week:
                numberToAdd = 7;
                break;
            case PeriodEnum.Month:
                numberToAdd = 30;
                break;
        }
        const periodStart: Date = dayjs().utc().toDate();
        const periodEnd = dayjs(periodStart)
            .startOf('day')
            .add(numberToAdd, 'day')
            .toDate();
        const schedule: Pick<
            DoctorsWorkScheduleModel,
            'startWorkTime' | 'endWorkTime' | 'workDate'
        >[] = await this.doctorsRepository.getScheduleByPeriod(
            doctorId,
            periodStart,
            periodEnd,
        );

        const appointments: AppointmentsModel[] | null =
            await this.doctorsRepository.getAppointments(
                doctorId,
                periodStart,
                periodEnd,
            );

        if (!schedule) {
            notice.addError('schedule was not found');
            return notice;
        }

        const appointmentsMap = {};
        if (appointments) {
            appointments.forEach((item, index) => {
                let i = item.datetimeOfAdmission.toISOString();
                appointmentsMap[i] = i;
            });
        }

        const mappedSchedule: freeSlots[] = [];

        schedule.map((i) => {
            const slots: string[] = [];
            let time = dayjs(i.startWorkTime);

            while (time < dayjs(i.endWorkTime)) {
                if (!appointmentsMap[time.toISOString()]) {
                    slots.push(time.toISOString());
                }
                time = dayjs(time).add(30, 'm');
            }

            mappedSchedule.push({
                date: i.workDate,
                slots: slots,
            });
        });

        let countSlots: number = 0;
        mappedSchedule.map((i) => {
            countSlots += i.slots.length;
        });

        const result: DoctorsFreeSlotsViewDto = {
            doctorId: doctor.id,
            name: `${doctor.firstname} ${doctor.lastname}`,
            region: doctor.region,
            city: doctor.city,
            phoneNumber: doctor.phoneNumber,
            specialization: doctor.specialization,
            slotsInfo: {
                periodType: query.period,
                periodStart: periodStart.toISOString(),
                periodEnd: periodEnd.toISOString(),
                countSlots: countSlots,
                freeSlots: mappedSchedule,
            },
        };

        notice.addData(result);
        return notice;
    }

    async getScheduleForDoctor(
        doctorId: string,
        schedulePeriodInputDto: SchedulePeriodInputDto,
    ): Promise<InterlayerNotice<ScheduleViewDto[] | null>> {
        const notice = new InterlayerNotice<ScheduleViewDto[] | null>();
        const doctor = await this.doctorsRepository.getDoctorById(doctorId);
        if (!doctor) {
            notice.addError('doctor was not found');
            return notice;
        }

        const doctorSchedule = await this.doctorsRepository.getScheduleByPeriod(
            doctorId,
            schedulePeriodInputDto.startDate,
            schedulePeriodInputDto.finishDate,
        );
        if (!doctorSchedule) {
            return notice;
        }

        const schedule: ScheduleViewDto[] = [];
        doctorSchedule.map((i) => {
            schedule.push({
                date: new Date(i.workDate).toISOString(),
                startWorkTime: i.startWorkTime.toISOString(),
                endWorkTime: i.endWorkTime.toISOString(),
            });
        });

        notice.addData(schedule);
        return notice;
    }

    async updateDoctor(
        doctorId: string,
        firstname: string = null,
        lastname: string = null,
        region: string = null,
        city: string = null,
        phoneNumber: string = null,
        specialization: string = null,
        dob: Date = null,
        trx: Knex.Transaction,
    ) {
        const notice = new InterlayerNotice();

        const isDoctorUpdated = await this.doctorsRepository.updateDoctor(
            doctorId,
            firstname,
            lastname,
            region,
            city,
            phoneNumber,
            specialization,
            dob,
            trx,
        );
        if (!isDoctorUpdated) {
            notice.addError('doctor was not updated');
            return notice;
        }

        return notice;
    }

    // async checkDoctorFreeSlots(
    //     doctorId: string,
    //     datetimeOfAdmission: Date,
    // ): Promise<InterlayerNotice> {
    //     const notice = new InterlayerNotice();
    //
    //     dayjs().format();
    //     // const isDoctorWork = await this.doctorsRepository.() {}
    //     // const isDoctorFree() {}
    //
    //     return notice;
    // }

    async createScheduleForDay(
        doctorId: string,
        workDate: Date,
        startDate: Date,
        finishDate: Date,
        trx: Knex.Transaction = null,
    ): Promise<InterlayerNotice> {
        const notice = new InterlayerNotice();

        //проверка корректности данных, чтобы одинаковые дни слали
        const allDates = [workDate, startDate, finishDate];
        const allEqual = allDates.every(
            (num) =>
                dayjs(num).startOf('day').format('YYYY-MM-DD') ===
                dayjs(allDates[0]).startOf('day').format('YYYY-MM-DD'),
        );
        if (!allEqual) {
            notice.addError(
                'It is forbidden to create a schedule that includes different days',
            );
            return notice;
        }

        const doctor = await this.doctorsRepository.getDoctorById(doctorId);
        if (!doctor) {
            notice.addError('Doctor was not found');
            return notice;
        }

        const isItWorkDayDoctor =
            await this.doctorsRepository.checkWorkDayDoctor(
                doctor.id,
                workDate,
            );
        if (isItWorkDayDoctor) {
            notice.addError('This day is already a work day');
            return notice;
        }

        const isCreatedWorkSchedule =
            await this.doctorsRepository.createWorkSchedule(
                doctor.id,
                workDate,
                startDate,
                finishDate,
                trx,
            );
        if (!isCreatedWorkSchedule) {
            notice.addError('Work schedule was not created');
            return notice;
        }

        return notice;
    }

    async updateScheduleForDay(
        doctorId: string,
        workDate: Date,
        startDate: Date,
        finishDate: Date,
        trx: Knex.Transaction = null,
    ): Promise<InterlayerNotice> {
        const notice = new InterlayerNotice();

        //проверка корректности данных, чтобы одинаковые дни слали
        const allDates = [workDate, startDate, finishDate];
        const allEqual = allDates.every(
            (num) =>
                dayjs(num).startOf('day').format('YYYY-MM-DD') ===
                dayjs(allDates[0]).startOf('day').format('YYYY-MM-DD'),
        );
        if (!allEqual) {
            notice.addError(
                'It is forbidden to update a schedule that includes different days',
            );
            return notice;
        }

        const doctor = await this.doctorsRepository.getDoctorById(doctorId);
        if (!doctor) {
            notice.addError('Doctor was not found');
            return notice;
        }

        const isItWorkDayDoctor =
            await this.doctorsRepository.checkWorkDayDoctor(
                doctor.id,
                workDate,
            );
        if (!isItWorkDayDoctor) {
            notice.addError('This day is not a work day');
            return notice;
        }

        const isUpdatedWorkSchedule =
            await this.doctorsRepository.updateWorkSchedule(
                doctor.id,
                workDate,
                startDate,
                finishDate,
                trx,
            );
        if (!isUpdatedWorkSchedule) {
            notice.addError('Work schedule was not updated');
            return notice;
        }

        return notice;
    }

    async deleteScheduleForDay(
        doctorId: string,
        workDate: Date,
        trx: Knex.Transaction = null,
    ): Promise<InterlayerNotice> {
        const notice = new InterlayerNotice();

        const doctor = await this.doctorsRepository.getDoctorById(doctorId);
        if (!doctor) {
            notice.addError(
                'Doctor was not found',
                'doctor',
                InterlayerStatuses.NOT_FOUND,
            );
            return notice;
        }

        const isItWorkDayDoctor =
            await this.doctorsRepository.checkWorkDayDoctor(
                doctor.id,
                workDate,
            );
        if (!isItWorkDayDoctor) {
            notice.addError(
                'This day is not a work day',
                'doctor',
                InterlayerStatuses.NOT_FOUND,
            );
            return notice;
        }

        const isUpdatedWorkSchedule =
            await this.doctorsRepository.deleteWorkSchedule(
                doctor.id,
                workDate,
                trx,
            );
        if (!isUpdatedWorkSchedule) {
            notice.addError(
                'Work schedule was not deleted',
                'doctor',
                InterlayerStatuses.FORBIDDEN,
            );
            return notice;
        }

        return notice;
    }
}
