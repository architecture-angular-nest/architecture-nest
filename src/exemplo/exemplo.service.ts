import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  FindOneOptions,
  FindOptionsSelect,
  FindOptionsSelectByString,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Exemplo } from './entities/exemplo.entity';
import { CreateExemploDto } from './dto/create-exemplo.dto';
import { ExemploAudit } from './entities/exemplo-audit.entity';
import { GeneralService } from '..//core/architecture/services/general.service';
import { ActionAuditEnum } from './../core/architecture/enums/action-audit.enum';
import { PaginatedList } from './../core/architecture/interfaces/paginated-list';
@Injectable()
export class ExemploService extends GeneralService<
  Exemplo,
  ExemploAudit,
  EntityId,
  CreateExemploDto
> {
  constructor(
    @InjectRepository(Exemplo)
    private readonly exemploRepository: Repository<Exemplo>,
    @InjectRepository(ExemploAudit)
    private readonly exemploAuditRepository: Repository<ExemploAudit>,
  ) {
    super(exemploRepository, exemploAuditRepository);
  }

  public createEntity(
    createEntityDto: CreateExemploDto,
    actionDoneBy?: Express.User,
  ): Promise<Exemplo> {
    return this.create(createEntityDto, actionDoneBy['id']);
  }

  public findAllEntity(): Promise<Exemplo[]> {
    return this.find();
  }

  public async findWithPaginator(
    page: number,
    limit: number,
  ): Promise<PaginatedList<Exemplo>> {
    const [data, total] = await this.entityRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data, total };
  }

  public findOneEntity(
    id?: number,
    options?: FindOneOptions<Exemplo>,
  ): Promise<Exemplo> {
    const optionsQuery = (
      !!id
        ? {
            where: { id },
          }
        : options
    ) as FindOneOptions<Exemplo>;

    return this.findOne(optionsQuery);
  }

  public updateEntity(
    id: number,
    updateEntityDto: Partial<CreateExemploDto>,
    actionDoneBy?: Express.User,
    actionDescription?: string,
  ): Promise<Exemplo> {
    return this.update(
      { id: +id, ...updateEntityDto } as Partial<CreateExemploDto>,
      actionDoneBy['id'],
      actionDescription,
    );
  }

  public removeEntity(id: number): Promise<void> {
    return this.softDelete({
      where: { id },
    });
  }

  // public async findOneEntityLogsWithPaginator(
  //   entityId: number,
  //   page: number,
  //   limit: number,
  // ): Promise<PaginatedList<ExemploAudit>> {
  //   const [data, total] = await this.exemploAuditRepository.findAndCount({
  //     select: {
  //       id: true,
  //       action: true,
  //       actionDescription: true,
  //       actionDoneBy: true,
  //       entityId: true,
  //       timestamp: true,
  //     } as
  //       | FindOptionsSelect<ExemploAudit>
  //       | FindOptionsSelectByString<ExemploAudit>,
  //     take: limit,
  //     skip: (page - 1) * limit,
  //     where: { entityId: entityId } as
  //       | FindOptionsWhere<ExemploAudit>
  //       | FindOptionsWhere<ExemploAudit>[],
  //   });

  //   return { data, total };
  // }

  // public async findOneEntityLogs(entityId: number): Promise<ExemploAudit[]> {
  //   return this.exemploAuditRepository.find({
  //     select: {
  //       id: true,
  //       action: true,
  //       actionDescription: true,
  //       actionDoneBy: true,
  //       entityId: true,
  //       timestamp: true,
  //     } as
  //       | FindOptionsSelect<ExemploAudit>
  //       | FindOptionsSelectByString<ExemploAudit>,
  //     where: { entityId: entityId } as
  //       | FindOptionsWhere<ExemploAudit>
  //       | FindOptionsWhere<ExemploAudit>[],
  //   });
  // }

  // public async findEntityLogsWithPaginator(
  //   page: number,
  //   limit: number,
  // ): Promise<PaginatedList<ExemploAudit>> {
  //   const [data, total] = await this.exemploAuditRepository.findAndCount({
  //     select: {
  //       id: true,
  //       action: true,
  //       actionDescription: true,
  //       actionDoneBy: true,
  //       entityId: true,
  //       timestamp: true,
  //     } as
  //       | FindOptionsSelect<ExemploAudit>
  //       | FindOptionsSelectByString<ExemploAudit>,
  //     take: limit,
  //     skip: (page - 1) * limit,
  //   });

  //   return { data, total };
  // }

  // public async findEntityLogs(argument?: object): Promise<ExemploAudit[]> {
  //   return this.exemploAuditRepository.find({
  //     ...argument,
  //     select: {
  //       id: true,
  //       action: true,
  //       actionDescription: true,
  //       actionDoneBy: true,
  //       entityId: true,
  //       timestamp: true,
  //     } as
  //       | FindOptionsSelect<ExemploAudit>
  //       | FindOptionsSelectByString<ExemploAudit>,
  //   });
  // }

  // public async undoLastChange(
  //   entityId: number,
  //   actionDoneBy?: number,
  // ): Promise<void | Exemplo> {
  //   const lastChange: ExemploAudit[] = await this.findAuditEntities({
  //     order: {
  //       timestamp: 'DESC',
  //     },
  //     where: {
  //       entityId: entityId,
  //     },
  //     take: 5,
  //   });

  //   const entityThatWasDeleted: boolean =
  //     lastChange[0].action === ActionAuditEnum.DELETE;

  //   if (entityThatWasDeleted)
  //     throw new HttpException(
  //       `Entidade deletada difinivamente, não há recuperação.`,
  //       HttpStatus.NOT_FOUND,
  //     );

  //   const entityThatWasSoftDeleted: boolean =
  //     lastChange[0].action === ActionAuditEnum.SOFTDELETE;

  //   if (entityThatWasSoftDeleted)
  //     return this.restoreEntity(
  //       {
  //         where: {
  //           id: lastChange[0].oldValue['id'],
  //         },
  //       },
  //       actionDoneBy,
  //     );

  //   return this.update(
  //     { ...lastChange[0].oldValue },
  //     actionDoneBy,
  //     'last change undone',
  //   );
  // }

  // private async restoreEntity(argument: object, actionDoneBy?: number) {
  //   return this.restore(argument, actionDoneBy, 'Restore Entity');
  // }
}
