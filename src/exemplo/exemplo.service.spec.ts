import { Test, TestingModule } from '@nestjs/testing';
import { ExemploService } from './exemplo.service';

describe('ExemploService', () => {
  let service: ExemploService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExemploService],
    }).compile();

    service = module.get<ExemploService>(ExemploService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
