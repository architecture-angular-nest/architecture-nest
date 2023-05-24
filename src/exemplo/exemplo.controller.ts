import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExemploService } from './exemplo.service';
import { CreateExemploDto } from './dto/create-exemplo.dto';
import { UpdateExemploDto } from './dto/update-exemplo.dto';

@Controller('exemplo')
export class ExemploController {
  constructor(private readonly exemploService: ExemploService) {}

  @Post()
  create(@Body() createExemploDto: CreateExemploDto) {
    return this.exemploService.createExemplo(createExemploDto);
  }

  @Get()
  findAll() {
    return this.exemploService.findAllExemplo();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exemploService.findOneExemplo(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExemploDto: UpdateExemploDto) {
    return this.exemploService.updateExemplo(+id, updateExemploDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exemploService.removeExemplo(+id);
  }
}
