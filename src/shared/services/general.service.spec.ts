import {
  mockedAuditEntityList,
  mockedGeneralEntityList,
} from './../../mock/data-mock';
import { Repository } from 'typeorm';
import { AuditEntity } from '../entities/audit-entity.entity';
import { GeneralEntity } from '../entities/general-entity.entity';
import { GeneralService } from './general.service';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ActionAuditEnum } from '../enums/action-audit.enum';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('GeneralService', () => {
  let generalService: GeneralService<GeneralEntity, AuditEntity>;
  let entityRepository: Repository<GeneralEntity>;
  let auditRepository: Repository<AuditEntity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GeneralService,
        {
          provide: getRepositoryToken(GeneralEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockedGeneralEntityList[0]),
            create: jest.fn().mockReturnValue(mockedGeneralEntityList[0]),
            preload: jest.fn().mockResolvedValue(mockedGeneralEntityList[0]),
            save: jest.fn().mockResolvedValue(mockedGeneralEntityList[0]),
            find: jest.fn().mockResolvedValue(mockedGeneralEntityList),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: getRepositoryToken(AuditEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(mockedAuditEntityList[0]),
            find: jest.fn().mockResolvedValue(mockedAuditEntityList),
          },
        },
      ],
    }).compile();

    generalService =
      moduleRef.get<GeneralService<GeneralEntity, AuditEntity>>(GeneralService);
    entityRepository = moduleRef.get<Repository<GeneralEntity>>(
      getRepositoryToken(GeneralEntity),
    );
    auditRepository = moduleRef.get<Repository<AuditEntity>>(
      getRepositoryToken(AuditEntity),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('generalService, entityRepository and auditRepository should be defined', () => {
    expect(generalService).toBeDefined();
    expect(entityRepository).toBeDefined();
    expect(auditRepository).toBeDefined();
  });

  describe('create', () => {
    it(`Should call entityRepository.create(), entityRepository.save() and generalService.logChange() once and create
        and return a new GeneralEntity`, async () => {
      jest.spyOn(generalService, 'logChange').mockResolvedValueOnce();

      const result = await generalService.create({
        ...mockedGeneralEntityList[0],
      });

      expect(entityRepository.create).toHaveBeenCalled();
      expect(entityRepository.create).toHaveBeenCalledTimes(1);
      expect(entityRepository.create).toBeCalledWith(
        mockedGeneralEntityList[0],
      );
      expect(entityRepository.save).toHaveBeenCalled();
      expect(entityRepository.save).toHaveBeenCalledTimes(1);
      expect(entityRepository.save).toBeCalledWith(mockedGeneralEntityList[0]);
      expect(generalService.logChange).toHaveBeenCalled();
      expect(generalService.logChange).toHaveBeenCalledTimes(1);
      expect(generalService.logChange).toBeCalledWith(
        ActionAuditEnum.CREATE,
        1,
        mockedGeneralEntityList[0].id,
        null,
        mockedGeneralEntityList[0],
      );
      expect(result).toEqual(mockedGeneralEntityList[0]);
    });

    it(`Should call generalService.delete() once and throw an 500 exception if the generalService.logChange() throw 
        an error`, async () => {
      jest
        .spyOn(generalService, 'logChange')
        .mockRejectedValueOnce(new Error());
      jest.spyOn(generalService, 'delete').mockResolvedValueOnce();

      await expect(
        generalService.create({
          ...mockedGeneralEntityList[0],
        }),
      ).rejects.toThrow(
        new HttpException(
          'Ação não realizada erro ao cadastrar log',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
      expect(generalService.softDelete).toHaveBeenCalled();
      expect(generalService.softDelete).toHaveBeenCalledTimes(1);
      expect(generalService.softDelete).toBeCalledWith(
        {
          where: {
            id: mockedGeneralEntityList[0].id,
          },
        },
        'Entity registration error',
      );
    });
  });

  describe('findOne', () => {
    it(`Should call entityRepository.findOne() once and return a GeneralEntity`, async () => {
      mockedGeneralEntityList[0];

      jest
        .spyOn(entityRepository, 'findOne')
        .mockResolvedValue(mockedGeneralEntityList[0]);

      const result = await generalService.findOne({
        ...mockedGeneralEntityList[0],
      });

      expect(entityRepository.findOne).toHaveBeenCalled();
      expect(entityRepository.findOne).toHaveBeenCalledTimes(1);
      expect(entityRepository.findOne).toBeCalledWith({
        ...mockedGeneralEntityList[0],
      });
      expect(result).toEqual(mockedGeneralEntityList[0]);
    });

    it('Should throw an exeption', async () => {
      jest
        .spyOn(entityRepository, 'findOne')
        .mockRejectedValueOnce(new Error());

      await expect(
        generalService.findOne({
          ...mockedGeneralEntityList[0],
        }),
      ).rejects.toThrowError();
    });
  });

  describe('find', () => {
    it(`Should call entityRepository.find() once and return a list of GeneralEntity`, async () => {
      jest
        .spyOn(entityRepository, 'find')
        .mockResolvedValue(mockedGeneralEntityList);

      const result = await generalService.find({
        ...mockedGeneralEntityList,
      });

      expect(entityRepository.find).toHaveBeenCalled();
      expect(entityRepository.find).toHaveBeenCalledTimes(1);
      expect(entityRepository.find).toBeCalledWith({
        ...mockedGeneralEntityList,
      });
      expect(result).toEqual(mockedGeneralEntityList);
    });

    it('Should throw an exeption', async () => {
      jest.spyOn(entityRepository, 'find').mockRejectedValueOnce(new Error());

      await expect(
        generalService.find({
          ...mockedGeneralEntityList,
        }),
      ).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it(`Should call entityRepository.preload(), entityRepository.save(), generalService.findAuditEntities() and 
        generalService.logChange() once and update and return an updated GeneralEntity`, async () => {
      jest
        .spyOn(entityRepository, 'preload')
        .mockResolvedValueOnce(mockedGeneralEntityList[0]);
      jest
        .spyOn(entityRepository, 'save')
        .mockResolvedValueOnce(mockedGeneralEntityList[0]);
      jest.spyOn(generalService, 'findAuditEntities').mockResolvedValueOnce([]);
      jest.spyOn(generalService, 'logChange').mockResolvedValueOnce();

      const result = await generalService.update({
        ...mockedGeneralEntityList[0],
      });

      expect(entityRepository.preload).toHaveBeenCalled();
      expect(entityRepository.preload).toHaveBeenCalledTimes(1);
      expect(entityRepository.preload).toBeCalledWith(
        mockedGeneralEntityList[0],
      );
      expect(entityRepository.save).toHaveBeenCalled();
      expect(entityRepository.save).toHaveBeenCalledTimes(1);
      expect(entityRepository.save).toBeCalledWith(mockedGeneralEntityList[0]);
      expect(generalService.findAuditEntities).toHaveBeenCalled();
      expect(generalService.findAuditEntities).toHaveBeenCalledTimes(1);
      expect(generalService.findAuditEntities).toBeCalledWith({
        order: {
          timestamp: 'DESC',
        },
        where: {
          entityId: mockedGeneralEntityList[0].id,
        },
        take: 5,
      });
      expect(generalService.logChange).toHaveBeenCalled();
      expect(generalService.logChange).toHaveBeenCalledTimes(1);
      expect(generalService.logChange).toBeCalledWith(
        ActionAuditEnum.UPDATE,
        1,
        mockedGeneralEntityList[0].id,
        null,
        mockedGeneralEntityList[0],
        undefined,
      );
      expect(result).toEqual(mockedGeneralEntityList[0]);
    });

    it(`Should call entityRepository.preload() once and throw an 404 exception if there is no Entity with the passed 
        attributes`, async () => {
      jest.spyOn(entityRepository, 'preload').mockResolvedValueOnce(null);

      await expect(
        generalService.update({
          ...mockedGeneralEntityList[0],
        }),
      ).rejects.toThrow(
        new HttpException(`Registro não encontrado`, HttpStatus.NOT_FOUND),
      );
      expect(entityRepository.preload).toHaveBeenCalled();
      expect(entityRepository.preload).toHaveBeenCalledTimes(1);
      expect(entityRepository.preload).toBeCalledWith(
        mockedGeneralEntityList[0],
      );
    });

    it(`Should call entityRepository.preload() and generalService.findAuditEntities() once 
        and throw a 500 exception if there is a problem in generalService.findAuditEntities()`, async () => {
      jest
        .spyOn(entityRepository, 'preload')
        .mockResolvedValueOnce(mockedGeneralEntityList[0]);
      jest
        .spyOn(generalService, 'findAuditEntities')
        .mockRejectedValueOnce(new Error());

      await expect(
        generalService.update({
          ...mockedGeneralEntityList[0],
        }),
      ).rejects.toThrowError();
      expect(entityRepository.preload).toHaveBeenCalled();
      expect(entityRepository.preload).toHaveBeenCalledTimes(1);
      expect(entityRepository.preload).toBeCalledWith(
        mockedGeneralEntityList[0],
      );
      expect(generalService.findAuditEntities).toHaveBeenCalled();
      expect(generalService.findAuditEntities).toHaveBeenCalledTimes(1);
      expect(generalService.findAuditEntities).toBeCalledWith({
        order: {
          timestamp: 'DESC',
        },
        where: {
          entityId: mockedGeneralEntityList[0].id,
        },
        take: 5,
      });
    });

    it(`Should call entityRepository.preload(), generalService.logChange() and generalService.findAuditEntities() once 
        and throw an 500 exception if there is a problem in generalService.logChange()`, async () => {
      jest
        .spyOn(entityRepository, 'preload')
        .mockResolvedValueOnce(mockedGeneralEntityList[0]);
      jest.spyOn(generalService, 'findAuditEntities').mockResolvedValueOnce([]);
      jest
        .spyOn(generalService, 'logChange')
        .mockRejectedValueOnce(new Error());

      await expect(
        generalService.update({
          ...mockedGeneralEntityList[0],
        }),
      ).rejects.toThrow(
        new HttpException(
          'Ação não realizada erro ao cadastrar log',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
      expect(entityRepository.preload).toHaveBeenCalled();
      expect(entityRepository.preload).toHaveBeenCalledTimes(1);
      expect(entityRepository.preload).toBeCalledWith(
        mockedGeneralEntityList[0],
      );
      expect(generalService.findAuditEntities).toHaveBeenCalled();
      expect(generalService.findAuditEntities).toHaveBeenCalledTimes(1);
      expect(generalService.findAuditEntities).toBeCalledWith({
        order: {
          timestamp: 'DESC',
        },
        where: {
          entityId: mockedGeneralEntityList[0].id,
        },
        take: 5,
      });
      expect(generalService.logChange).toHaveBeenCalled();
      expect(generalService.logChange).toHaveBeenCalledTimes(1);
      expect(generalService.logChange).toBeCalledWith(
        ActionAuditEnum.UPDATE,
        1,
        mockedGeneralEntityList[0].id,
        null,
        mockedGeneralEntityList[0],
        undefined,
      );
    });
  });

  describe('delete', () => {
    it(`Should call entityRepository.findOne(), entityRepository.save(), generalService.findAuditEntities() and 
        generalService.logChange() once and delete a GeneralEntity`, async () => {
      jest
        .spyOn(entityRepository, 'findOne')
        .mockResolvedValueOnce(mockedGeneralEntityList[0]);
      jest
        .spyOn(entityRepository, 'save')
        .mockResolvedValueOnce(mockedGeneralEntityList[0]);
      jest.spyOn(generalService, 'findAuditEntities').mockResolvedValueOnce([]);
      jest.spyOn(generalService, 'logChange').mockResolvedValueOnce();

      const result = await generalService.softDelete({
        ...mockedGeneralEntityList[0],
      });

      expect(entityRepository.findOne).toHaveBeenCalled();
      expect(entityRepository.findOne).toHaveBeenCalledTimes(1);
      expect(entityRepository.findOne).toBeCalledWith({
        ...mockedGeneralEntityList[0],
        deleted_at: new Date('10-10-3000'),
        status: '',
      });
      expect(entityRepository.save).toHaveBeenCalled();
      expect(entityRepository.save).toHaveBeenCalledTimes(1);
      expect(entityRepository.save).toBeCalledWith(mockedGeneralEntityList[0]);
      expect(generalService.findAuditEntities).toHaveBeenCalled();
      expect(generalService.findAuditEntities).toHaveBeenCalledTimes(1);
      expect(generalService.findAuditEntities).toBeCalledWith({
        order: {
          timestamp: 'DESC',
        },
        where: {
          entityId: mockedGeneralEntityList[0].id,
        },
        take: 5,
      });
      expect(generalService.logChange).toHaveBeenCalled();
      expect(generalService.logChange).toHaveBeenCalledTimes(1);
      expect(generalService.logChange).toBeCalledWith(
        ActionAuditEnum.DELETE,
        1,
        mockedGeneralEntityList[0].id,
        null,
        mockedGeneralEntityList[0],
        undefined,
      );
      expect(result).toEqual(undefined);
    });

    it(`Should call entityRepository.findOne() once and throw an 404 exception if there is no Entity with the passed 
        attributes`, async () => {
      jest.spyOn(entityRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        generalService.softDelete({
          ...mockedGeneralEntityList[0],
        }),
      ).rejects.toThrow(
        new HttpException(`Registro não encontrado`, HttpStatus.NOT_FOUND),
      );
      expect(entityRepository.findOne).toHaveBeenCalled();
      expect(entityRepository.findOne).toHaveBeenCalledTimes(1);
      expect(entityRepository.findOne).toBeCalledWith({
        ...mockedGeneralEntityList[0],
        status: 'DELETED',
      });
    });

    it(`Should call entityRepository.findOne(), generalService.logChange() and generalService.findAuditEntities() once 
        and throw an 500 exception if there is a problem in generalService.logChange()`, async () => {
      jest
        .spyOn(entityRepository, 'findOne')
        .mockResolvedValueOnce(mockedGeneralEntityList[0]);
      jest.spyOn(generalService, 'findAuditEntities').mockResolvedValueOnce([]);
      jest
        .spyOn(generalService, 'logChange')
        .mockRejectedValueOnce(new Error());

      await expect(
        generalService.softDelete({
          ...mockedGeneralEntityList[0],
        }),
      ).rejects.toThrow(
        new HttpException(
          'Ação não realizada erro ao cadastrar log',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
      expect(entityRepository.findOne).toHaveBeenCalled();
      expect(entityRepository.findOne).toHaveBeenCalledTimes(1);
      expect(entityRepository.findOne).toBeCalledWith({
        ...mockedGeneralEntityList[0],
        status: 'DELETED',
      });
      expect(generalService.findAuditEntities).toHaveBeenCalled();
      expect(generalService.findAuditEntities).toHaveBeenCalledTimes(1);
      expect(generalService.findAuditEntities).toBeCalledWith({
        order: {
          timestamp: 'DESC',
        },
        where: {
          entityId: mockedGeneralEntityList[0].id,
        },
        take: 5,
      });
      expect(generalService.logChange).toHaveBeenCalled();
      expect(generalService.logChange).toHaveBeenCalledTimes(1);
      expect(generalService.logChange).toBeCalledWith(
        ActionAuditEnum.DELETE,
        1,
        mockedGeneralEntityList[0].id,
        null,
        mockedGeneralEntityList[0],
        undefined,
      );
    });
  });

  describe('logChange', () => {
    it(`Should call auditRepository.save() once and return a AuditEntity`, async () => {
      mockedAuditEntityList[0];

      jest
        .spyOn(auditRepository, 'save')
        .mockResolvedValueOnce(mockedAuditEntityList[0]);

      await generalService.logChange(
        ActionAuditEnum.UPDATE,
        1,
        mockedGeneralEntityList[0].id,
        null,
        mockedGeneralEntityList[0],
      );

      expect(auditRepository.save).toHaveBeenCalled();
      expect(auditRepository.save).toHaveBeenCalledTimes(1);
    });

    it('Should throw an exeption', async () => {
      jest.spyOn(auditRepository, 'save').mockRejectedValueOnce(new Error());

      await expect(
        generalService.logChange(
          ActionAuditEnum.UPDATE,
          1,
          mockedGeneralEntityList[0].id,
          mockedGeneralEntityList[0],
          null,
        ),
      ).rejects.toThrowError();
    });
  });

  describe('findAuditEntities', () => {
    it(`Should call auditRepository.find() once and return a list of AuditEntity`, async () => {
      jest
        .spyOn(auditRepository, 'find')
        .mockResolvedValue(mockedAuditEntityList);

      const result = await generalService.findAuditEntities({
        ...mockedAuditEntityList,
      });

      expect(auditRepository.find).toHaveBeenCalled();
      expect(auditRepository.find).toHaveBeenCalledTimes(1);
      expect(auditRepository.find).toBeCalledWith({
        ...mockedAuditEntityList,
      });
      expect(result).toEqual(mockedAuditEntityList);
    });

    it('Should throw an exeption', async () => {
      jest.spyOn(auditRepository, 'find').mockRejectedValueOnce(new Error());

      await expect(
        generalService.findAuditEntities({
          ...mockedAuditEntityList,
        }),
      ).rejects.toThrowError();
    });
  });
});
