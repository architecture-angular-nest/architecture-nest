import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
} from '@nestjs/common';

import { ExemploService } from './exemplo.service';
import { CreateExemploDto } from './dto/create-exemplo.dto';
import { UpdateExemploDto } from './dto/update-exemplo.dto';

@Controller('exemplo')
export class ExemploController {
  constructor(private readonly exemploService: ExemploService) { }

  @Get('paged-logs-of-one-entity/:id')
  findOneEntityLogsWithPaginator(
    @Param('id') id: string,
    @Query('page') page: number,
    @Query('limit') limit: number
  ) {
    return this.exemploService
      .findOneEntityLogsWithPaginator(Number(id), Number(page), Number(limit));
  }

  @Get('logs-of-one-entity/:id')
  findOneEntityLogs(
    @Param('id') id: string,
  ) {
    return this.exemploService
      .findOneEntityLogs(Number(id));
  }

  @Get('paged-logs-of-entity')
  findEntityLogsWithPaginator(
    @Query('page') page: number,
    @Query('limit') limit: number
  ) {
    return this.exemploService
      .findEntityLogsWithPaginator(Number(page), Number(limit));
  }

  @Get('logs-of-entity')
  findEntityLogs() {
    return this.exemploService
      .findEntityLogs();
  }

  @Get('undo-last-change/:id')
  undoLastChange(
    @Param('id') id: string,
  ) {
    return this.exemploService
      .undoLastChange(Number(id));
  }

  @Post()
  create(@Body() createExemploDto: CreateExemploDto) {
    return this.exemploService.createEntity(createExemploDto);
  }

  @Get()
  findAll() {
    return this.exemploService.findAllEntity();
  }

  @Get('findAll')
  findWithPaginator(
    @Query('page') page: number, @Query('limit') limit: number
  ) {
    return this.exemploService.findWithPaginator(Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exemploService.findOneEntity(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExemploDto: UpdateExemploDto
  ) {
    return this.exemploService.updateEntity(Number(id), updateExemploDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exemploService.removeEntity(Number(id));
  }
}
