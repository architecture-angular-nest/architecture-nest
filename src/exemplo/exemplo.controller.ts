import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';

import { Response } from 'express';
import { CreateExemploDto } from './dto/create-exemplo.dto';
import { ExemploService } from './exemplo.service';
import { CurrentUser } from 'src/core/auth/decorators/current-user.decorator';

@Controller('exemplo')
export class ExemploController {
  constructor(private readonly exemploService: ExemploService) {}

  @Post()
  public async create(
    @Body() createDto: CreateExemploDto,
    @Res() res?: Response,
    @CurrentUser() user?: Express.User,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const savedEntity = await this.exemploService.createEntity(
        createDto,
        user,
      );

      return res.status(201).send(savedEntity);
    } catch (error) {
      return res
        .status(error.status || 500)
        .send(
          error.status == 500 || !error.status
            ? { message: 'Internal Server Error' }
            : error,
        );
    }
  }

  @Get()
  public async findAll(
    @Res() res?: Response,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const allEntity = await this.exemploService.findAllEntity();

      return res.status(200).send(allEntity);
    } catch (error) {
      console.log(error);

      return res
        .status(error.status || 500)
        .send(
          error.status == 500 || !error.status
            ? { message: 'Internal Server Error' }
            : error,
        );
    }
  }

  @Get('findAll')
  public async findWithPaginator(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Res() res?: Response,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const allEntity = await this.exemploService.findWithPaginator(
        Number(page),
        Number(limit),
      );

      return res.status(200).send(allEntity);
    } catch (error) {
      return res
        .status(error.status || 500)
        .send(
          error.status == 500 || !error.status
            ? { message: 'Internal Server Error' }
            : error,
        );
    }
  }

  @Put(':id')
  public async update(
    @Param('id') id: number,
    @Body() updateDto: Partial<CreateExemploDto>,
    @Res() res?: Response,
    @CurrentUser() user?: Express.User,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const updatedEntity = await this.exemploService.updateEntity(
        id,
        updateDto,
        user,
      );

      return res.status(200).send(updatedEntity);
    } catch (error) {
      return res
        .status(error.status || 500)
        .send(
          error.status == 500 || !error.status
            ? { message: 'Internal Server Error' }
            : error,
        );
    }
  }

  @Delete(':id')
  public async remove(
    @Param('id') id: number,
    @Res() res?: Response,
    @CurrentUser() user?: Express.User,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      await this.exemploService.removeEntity(id, user);

      return res.status(204).send();
    } catch (error) {
      return res
        .status(error.status || 500)
        .send(
          error.status == 500 || !error.status
            ? { message: 'Internal Server Error' }
            : error,
        );
    }
  }

  @Get('paged-logs-of-one-entity/:id')
  public async findOneEntityLogsWithPaginator(
    @Param('id') id: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Res() res?: Response,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const anEntityLogs =
        await this.exemploService.findOneEntityLogsWithPaginator(
          id,
          Number(page),
          Number(limit),
        );

      return res.status(200).send(anEntityLogs);
    } catch (error) {
      return res
        .status(error.status || 500)
        .send(
          error.status == 500 || !error.status
            ? { message: 'Internal Server Error' }
            : error,
        );
    }
  }

  @Get('logs-of-one-entity/:id')
  public async findOneEntityLogs(
    @Param('id') id: number,
    @Res() res?: Response,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const anEntityLogs = await this.exemploService.findOneEntityLogs(id);

      return res.status(200).send(anEntityLogs);
    } catch (error) {
      return res
        .status(error.status || 500)
        .send(
          error.status == 500 || !error.status
            ? { message: 'Internal Server Error' }
            : error,
        );
    }
  }

  @Get('paged-logs-of-entity')
  public async findEntityLogsWithPaginator(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Res() res?: Response,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const entityLogs = await this.exemploService.findEntityLogsWithPaginator(
        Number(page),
        Number(limit),
      );

      return res.status(200).send(entityLogs);
    } catch (error) {
      return res
        .status(error.status || 500)
        .send(
          error.status == 500 || !error.status
            ? { message: 'Internal Server Error' }
            : error,
        );
    }
  }

  @Get('logs-of-entity')
  public async findEntityLogs(
    @Res() res?: Response,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const entityLogs = await this.exemploService.findEntityLogs();

      return res.status(200).send(entityLogs);
    } catch (error) {
      return res
        .status(error.status || 500)
        .send(
          error.status == 500 || !error.status
            ? !error.message || { message: 'Internal Server Error' }
            : error,
        );
    }
  }

  @Post('undo-last-change/:id')
  public async undoLastChange(
    @Param('id') id: number,
    @Res() res?: Response,
    @CurrentUser() user?: Express.User,
  ) {
    try {
      const undoChangeResult = await this.exemploService.undoLastChange(
        id,
        user['id'],
      );

      return res.status(200).send(undoChangeResult);
    } catch (error) {
      return res
        .status(error.status || 500)
        .send(
          error.status == 500 || !error.status
            ? { message: 'Internal Server Error' }
            : error,
        );
    }
  }

  @Get(':id')
  public async findOne(
    @Param('id') id: number,
    @Res() res?: Response,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const entity = await this.exemploService.findOneEntityById(id);

      return res.status(200).send(entity);
    } catch (error) {
      return res
        .status(error.status || 500)
        .send(
          error.status == 500 || !error.status
            ? { message: 'Internal Server Error' }
            : error,
        );
    }
  }
}
