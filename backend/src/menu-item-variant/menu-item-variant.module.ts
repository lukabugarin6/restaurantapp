import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItemVariantService } from './menu-item-variant.service';
import { MenuItemVariantController } from './menu-item-variant.controller';
import { MenuItemVariant } from './entities/menu-item-variant.entity';
import { Normative } from '../normative/entities/normative.entity';
import { Ingredient } from '../ingredient/entities/ingredient.entity';
import { MenuItemModule } from '../menu-item/menu-item.module'; // Import MenuItemModule

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MenuItemVariant,
      Normative,
      Ingredient
    ]),
    MenuItemModule, // Import MenuItemModule to access MenuItemRepository
  ],
  controllers: [MenuItemVariantController],
  providers: [MenuItemVariantService],
  exports: [TypeOrmModule] // Export TypeOrmModule for other modules
})
export class MenuItemVariantModule {}