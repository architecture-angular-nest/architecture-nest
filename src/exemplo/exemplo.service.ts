import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { UtilityService } from './../shared/services/utility.service';
import { CreateExemploDto } from './dto/create-exemplo.dto';
import { UpdateExemploDto } from './dto/update-exemplo.dto';
import { Exemplo } from './entities/exemplo.entity';
import { ExemploAudit } from './entities/exemplo-audit.entity';
import { GeneralService } from './../shared/services/general.service';

@Injectable()
export class ExemploService extends GeneralService<Exemplo, ExemploAudit> {
  constructor(
    @InjectRepository(Exemplo)
    private readonly exemploRepository: Repository<Exemplo>,
    @InjectRepository(ExemploAudit)
    private readonly exemploAuditRepository: Repository<ExemploAudit>,
    protected readonly utilityService: UtilityService,
  ) {
    super(exemploRepository, exemploAuditRepository, utilityService);
  }

  public createExemplo(createExemploDto: CreateExemploDto): Promise<Exemplo> {
    return this.create(createExemploDto);
  }

  public findAllExemplo(): Promise<Exemplo[]> {
    return this.find();
  }

  public findOneExemplo(id: number): Promise<Exemplo> {
    return this.findOne({
      where: { id },
    });
  }

  public updateExemplo(
    id: number,
    updateExemploDto: UpdateExemploDto,
  ): Promise<Exemplo> {
    return this.update({ id, ...updateExemploDto });
  }

  public removeExemplo(id: number): Promise<void> {
    return this.delete({ id });
  }
}
