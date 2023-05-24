import { Test, TestingModule } from '@nestjs/testing';
import { UtilityService } from './utility.service';

describe('UtilityService', () => {
  let utilityService: UtilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtilityService],
    }).compile();

    utilityService = module.get<UtilityService>(UtilityService);
  });

  it('utilityService should be defined', () => {
    expect(utilityService).toBeDefined();
  });

  describe('changeObjectNullValuesToUndefined', () => {
    it('Should return an object where only null values become undefined values', () => {
      const result = utilityService.changeObjectNullValuesToUndefined({
        a: null,
        b: 2,
        c: NaN,
        d: 0,
        e: false,
        f: 'false',
      });

      expect(result).toEqual({
        a: undefined,
        b: 2,
        c: NaN,
        d: 0,
        e: false,
        f: 'false',
      });
    });
  });
});
