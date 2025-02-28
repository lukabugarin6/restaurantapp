import { Test, TestingModule } from '@nestjs/testing';
import { NormativeService } from './normative.service';

describe('NormativeService', () => {
  let service: NormativeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NormativeService],
    }).compile();

    service = module.get<NormativeService>(NormativeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
