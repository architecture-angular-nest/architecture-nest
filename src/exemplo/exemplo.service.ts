import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Exemplo } from './entities/exemplo.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateExemploDto } from './dto/create-exemplo.dto';
import { UpdateExemploDto } from './dto/update-exemplo.dto';
import { ExemploAudit } from './entities/exemplo-audit.entity';
import { ActionAuditEnum } from './../core/architecture/enums/action-audit.enum';
import { TypeOrmWithAuditRepository } from '../core/architecture/repositories/typeorm-with-audit.repository';

@Injectable()
export class ExemploService extends TypeOrmWithAuditRepository<
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

  public findOneEntity(
    id?: number,
    options?: FindOneOptions<Exemplo>,
  ): Promise<Exemplo> {
    const optionsQuery = (
      !!id ? { where: { id } } : options
    ) as FindOneOptions<Exemplo>;

    return this.findOne(optionsQuery);
  }

  public updateEntity(
    id: number,
    updateEntityDto: UpdateExemploDto,
    actionDoneBy?: Express.User,
  ): Promise<Exemplo> {
    return this.update(
      { id: +id, ...updateEntityDto } as Partial<CreateExemploDto>,
      actionDoneBy['id'],
      ActionAuditEnum.UPDATE,
    );
  }

  public removeEntity(id: number, actionDoneBy?: Express.User): Promise<void> {
    return this.softDelete(
      {
        where: { id },
      },
      actionDoneBy['id'],
    );
  }
}
