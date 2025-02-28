import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemVariantService } from './menu-item-variant.service';

describe('MenuItemVariantService', () => {
  let service: MenuItemVariantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MenuItemVariantService],
    }).compile();

    service = module.get<MenuItemVariantService>(MenuItemVariantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
