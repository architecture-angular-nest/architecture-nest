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
    return this.exemploService.findWithPaginator(+page, +limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exemploService.findOneEntity(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExemploDto: UpdateExemploDto) {
    return this.exemploService.updateEntity(+id, updateExemploDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exemploService.removeEntity(+id);
  }
}
