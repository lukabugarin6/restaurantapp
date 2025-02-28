import { Test, TestingModule } from '@nestjs/testing';
import { NormativeController } from './normative.controller';
import { NormativeService } from './normative.service';

describe('NormativeController', () => {
  let controller: NormativeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NormativeController],
      providers: [NormativeService],
    }).compile();

    controller = module.get<NormativeController>(NormativeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
