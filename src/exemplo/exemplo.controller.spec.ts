import { Test, TestingModule } from '@nestjs/testing';
import { ExemploController } from './exemplo.controller';
import { ExemploService } from './exemplo.service';

describe('ExemploController', () => {
  let controller: ExemploController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExemploController],
      providers: [ExemploService],
    }).compile();

    controller = module.get<ExemploController>(ExemploController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
