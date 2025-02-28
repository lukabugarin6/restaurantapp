import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItemService } from './menu-item.service';
import { MenuItemController } from './menu-item.controller';
import { MenuItem } from './entities/menu-item.entity';
import { MenuItemVariant } from '../menu-item-variant/entities/menu-item-variant.entity';
import { Normative } from '../normative/entities/normative.entity';
import { Ingredient } from '../ingredient/entities/ingredient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MenuItem,
      MenuItemVariant,
      Normative,
      Ingredient
    ]),
  ],
  controllers: [MenuItemController],
  providers: [MenuItemService],
  exports: [TypeOrmModule]
})
export class MenuItemModule {}