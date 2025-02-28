import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemVariantController } from './menu-item-variant.controller';
import { MenuItemVariantService } from './menu-item-variant.service';

describe('MenuItemVariantController', () => {
  let controller: MenuItemVariantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuItemVariantController],
      providers: [MenuItemVariantService],
    }).compile();

    controller = module.get<MenuItemVariantController>(MenuItemVariantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
