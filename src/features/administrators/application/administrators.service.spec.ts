import { Test, TestingModule } from '@nestjs/testing';
import { AdministratorsService } from './administrators.service';
import { createMock } from '@golevelup/ts-jest';
import { CryptoService } from '../../../base/services/crypto-service';
import { DoctorsService } from '../../doctors/application/doctors.service';
import { AdministratorsRepository } from '../infrastructure/administrators.repository';
import { DoctorsViewDto } from '../../doctors/api/dto/output/doctors-view-dto';
import { DoctorInputDto } from '../../doctors/api/dto/input/doctor-input.dto';
import { InterlayerNotice } from '../../../base/models/interlayer';

describe('AdministratorsService unit tests', () => {
    let administratorsService: AdministratorsService;
    let cryptoService: CryptoService;
    let administratorsRepository: AdministratorsRepository;
    let doctorsService: DoctorsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AdministratorsService,
                {
                    provide: CryptoService,
                    useValue: createMock<CryptoService>(),
                },
                {
                    provide: DoctorsService,
                    useValue: createMock<DoctorsService>(),
                },
                {
                    provide: AdministratorsRepository,
                    useValue: createMock<AdministratorsRepository>(),
                },
            ],
        }).compile();

        administratorsService = module.get<AdministratorsService>(
            AdministratorsService,
        );
        cryptoService = module.get<CryptoService>(CryptoService);
        administratorsRepository = module.get<AdministratorsRepository>(
            AdministratorsRepository,
        );
        doctorsService = module.get<DoctorsService>(DoctorsService);
    });

    it('should create doctor', async () => {
        expect(administratorsService).toBeDefined();

        const passwordHash = 'passwordHash';
        const doctorView: DoctorsViewDto = {
            doctorId: 'id',
            name: 'name',
            region: 'region',
            city: 'city',
            phoneNumber: 'phoneNumber',
            specialization: 'specialization',
            dob: new Date(),
        };
        const doctorInput: DoctorInputDto = {
            firstName: 'firstName',
            lastName: 'firstName',
            email: 'firstName',
            login: 'firstName',
            password: 'firstName',
            region: 'firstName',
            city: 'firstName',
            phoneNumber: 'firstName',
            specialization: 'firstName',
            dob: new Date(),
        };

        jest.spyOn(cryptoService, 'createPasswordHash').mockResolvedValue(
            passwordHash,
        );

        jest.spyOn(administratorsRepository, 'createDoctor').mockResolvedValue(
            doctorView,
        );

        const result = await administratorsService.createDoctor(doctorInput);
        expect(result.data).toEqual(doctorView);
        expect(administratorsRepository.createDoctor).toHaveBeenCalledWith(
            doctorInput,
            passwordHash,
        );
    });

    it(`shouldn't create doctor`, async () => {
        expect(administratorsService).toBeDefined();

        const passwordHash = 'passwordHash';
        const doctorView: DoctorsViewDto = {
            doctorId: 'id',
            name: 'name',
            region: 'region',
            city: 'city',
            phoneNumber: 'phoneNumber',
            specialization: 'specialization',
            dob: new Date(),
        };
        const doctorInput: DoctorInputDto = {
            firstName: 'firstName',
            lastName: 'firstName',
            email: 'firstName',
            login: 'firstName',
            password: 'firstName',
            region: 'firstName',
            city: 'firstName',
            phoneNumber: 'firstName',
            specialization: 'firstName',
            dob: new Date(),
        };

        jest.spyOn(cryptoService, 'createPasswordHash').mockResolvedValue(
            passwordHash,
        );

        jest.spyOn(administratorsRepository, 'createDoctor').mockResolvedValue(
            null,
        );

        const result = await administratorsService.createDoctor(doctorInput);
        expect(result.hasError()).toBeTruthy();
        expect(administratorsRepository.createDoctor).toHaveBeenCalledWith(
            doctorInput,
            passwordHash,
        );
    });

    it(`should remove doctor`, async () => {
        expect(administratorsService).toBeDefined();

        const userInterlayer = new InterlayerNotice<string>('userId');
        const doctorId = 'doctorId';
        const removeDoctorResult = Promise.resolve(true);

        jest.spyOn(doctorsService, 'getUserIdByDoctorId').mockResolvedValue(
            userInterlayer,
        );

        jest.spyOn(administratorsRepository, 'removeDoctor').mockResolvedValue(
            removeDoctorResult,
        );

        const result = await administratorsService.removeDoctor(doctorId);
        expect(result.hasError()).toBeFalsy();
        expect(administratorsRepository.removeDoctor).toHaveBeenCalledWith(
            userInterlayer.data,
            doctorId,
        );
    });

    it(`shouldn't remove doctor with unknown doctor`, async () => {
        expect(administratorsService).toBeDefined();

        const userInterlayer = new InterlayerNotice<string>('userId');
        userInterlayer.addError('some error');
        const doctorId = 'doctorId';
        const removeDoctorResult = Promise.resolve(true);

        jest.spyOn(doctorsService, 'getUserIdByDoctorId').mockResolvedValue(
            userInterlayer,
        );

        jest.spyOn(administratorsRepository, 'removeDoctor').mockResolvedValue(
            removeDoctorResult,
        );

        const result = await administratorsService.removeDoctor(doctorId);
        expect(result.hasError()).toBeTruthy();
        expect(doctorsService.getUserIdByDoctorId).toHaveBeenCalledTimes(1);
        expect(administratorsRepository.removeDoctor).toHaveBeenCalledTimes(0);
    });

    it(`shouldn't remove doctor because it's unavailable`, async () => {
        expect(administratorsService).toBeDefined();

        const userInterlayer = new InterlayerNotice<string>('userId');
        const doctorId = 'doctorId';
        const removeDoctorResult = Promise.resolve(false);

        jest.spyOn(doctorsService, 'getUserIdByDoctorId').mockResolvedValue(
            userInterlayer,
        );

        jest.spyOn(administratorsRepository, 'removeDoctor').mockResolvedValue(
            removeDoctorResult,
        );

        const result = await administratorsService.removeDoctor(doctorId);
        expect(result.hasError()).toBeTruthy();

        expect(doctorsService.getUserIdByDoctorId).toHaveBeenCalledWith(
            doctorId,
        );

        expect(doctorsService.getUserIdByDoctorId).toHaveBeenCalledTimes(1);
        expect(administratorsRepository.removeDoctor).toHaveBeenCalledTimes(1);
    });

    it(`shouldn't update doctor with incorrect doctorId`, async () => {
        const doctorId = 'doctorId';
        const doctorInputDto: DoctorInputDto = {
            firstName: 'firstName',
            lastName: 'firstName',
            email: 'firstName',
            login: 'firstName',
            password: 'firstName',
            region: 'firstName',
            city: 'firstName',
            phoneNumber: 'firstName',
            specialization: 'firstName',
            dob: new Date(),
        };

        const getDoctorInterlayer = new InterlayerNotice();
        getDoctorInterlayer.addError('some error');

        jest.spyOn(doctorsService, 'getDoctorById').mockResolvedValue(
            getDoctorInterlayer,
        );

        const result = await administratorsService.updateDoctor(
            doctorId,
            doctorInputDto,
        );

        expect(doctorsService.getDoctorById).toHaveBeenCalledTimes(1);
        expect(doctorsService.getUserIdByDoctorId).toHaveBeenCalledTimes(0);
        expect(cryptoService.createPasswordHash).toHaveBeenCalledTimes(0);
        expect(administratorsRepository.updateDoctor).toHaveBeenCalledTimes(0);
    });

    it(`shouldn't update doctor when it's unavailable`, async () => {
        expect(administratorsService).toBeDefined();

        const doctorId = 'doctorId';
        const updateDoctorResult = Promise.resolve(false);
        const passwordHash = Promise.resolve('passhash');
        const doctorInputDto: DoctorInputDto = {
            firstName: 'firstName',
            lastName: 'firstName',
            email: 'firstName',
            login: 'firstName',
            password: 'firstName',
            region: 'firstName',
            city: 'firstName',
            phoneNumber: 'firstName',
            specialization: 'firstName',
            dob: new Date(),
        };
        const doctorViewDto = {
            doctorId: 'string',
            name: 'string',
            region: 'string',
            city: 'string',
            phoneNumber: 'string',
            specialization: 'string',
            dob: new Date(),
        };
        const getDoctorInterlayer = new InterlayerNotice<DoctorsViewDto>(
            doctorViewDto,
        );
        const userInterlayer = new InterlayerNotice<string>('userId');

        jest.spyOn(doctorsService, 'getDoctorById').mockResolvedValue(
            getDoctorInterlayer,
        );
        jest.spyOn(doctorsService, 'getUserIdByDoctorId').mockResolvedValue(
            userInterlayer,
        );
        jest.spyOn(administratorsRepository, 'updateDoctor').mockResolvedValue(
            updateDoctorResult,
        );
        jest.spyOn(cryptoService, 'createPasswordHash').mockResolvedValue(
            'passwordHash',
        );

        const result = await administratorsService.updateDoctor(
            doctorId,
            doctorInputDto,
        );
        expect(result.hasError()).toBeTruthy();

        expect(doctorsService.getDoctorById).toHaveBeenCalledWith(doctorId);
        expect(cryptoService.createPasswordHash).toHaveBeenCalledWith(
            doctorInputDto.password,
        );

        expect(doctorsService.getDoctorById).toHaveBeenCalledTimes(1);
        expect(doctorsService.getUserIdByDoctorId).toHaveBeenCalledTimes(1);
        expect(cryptoService.createPasswordHash).toHaveBeenCalledTimes(1);
        expect(administratorsRepository.updateDoctor).toHaveBeenCalledTimes(1);
    });

    it(`should update doctor`, async () => {
        expect(administratorsService).toBeDefined();

        const doctorId = 'doctorId';
        const updateDoctorResult = Promise.resolve(true);
        const passwordHash = Promise.resolve('passhash');
        const doctorInputDto: DoctorInputDto = {
            firstName: 'firstName',
            lastName: 'firstName',
            email: 'firstName',
            login: 'firstName',
            password: 'firstName',
            region: 'firstName',
            city: 'firstName',
            phoneNumber: 'firstName',
            specialization: 'firstName',
            dob: new Date(),
        };
        const doctorViewDto = {
            doctorId: 'string',
            name: 'string',
            region: 'string',
            city: 'string',
            phoneNumber: 'string',
            specialization: 'string',
            dob: new Date(),
        };
        const getDoctorInterlayer = new InterlayerNotice<DoctorsViewDto>(
            doctorViewDto,
        );
        const userInterlayer = new InterlayerNotice<string>('userId');

        jest.spyOn(doctorsService, 'getDoctorById').mockResolvedValue(
            getDoctorInterlayer,
        );
        jest.spyOn(doctorsService, 'getUserIdByDoctorId').mockResolvedValue(
            userInterlayer,
        );
        jest.spyOn(administratorsRepository, 'updateDoctor').mockResolvedValue(
            updateDoctorResult,
        );
        jest.spyOn(cryptoService, 'createPasswordHash').mockResolvedValue(
            'passwordHash',
        );

        const result = await administratorsService.updateDoctor(
            doctorId,
            doctorInputDto,
        );
        expect(result.hasError()).toBeFalsy();

        expect(doctorsService.getDoctorById).toHaveBeenCalledWith(doctorId);

        expect(doctorsService.getDoctorById).toHaveBeenCalledTimes(1);
        expect(doctorsService.getUserIdByDoctorId).toHaveBeenCalledTimes(1);
        expect(cryptoService.createPasswordHash).toHaveBeenCalledTimes(1);
        expect(administratorsRepository.updateDoctor).toHaveBeenCalledTimes(1);
    });
});
