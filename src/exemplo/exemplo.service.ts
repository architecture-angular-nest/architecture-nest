import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOneOptions, Repository } from 'typeorm';
import { Exemplo } from './entities/exemplo.entity';
import { CreateExemploDto } from './dto/create-exemplo.dto';
import { UpdateExemploDto } from './dto/update-exemplo.dto';
import { ExemploAudit } from './entities/exemplo-audit.entity';
import { GeneralService } from '..//core/architecture/services/general.service';
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
    updateEntityDto: UpdateExemploDto,
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
}
