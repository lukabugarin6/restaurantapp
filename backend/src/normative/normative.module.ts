import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NormativeService } from './normative.service';
import { NormativeController } from './normative.controller';
import { Normative } from './entities/normative.entity';
import { Ingredient } from '../ingredient/entities/ingredient.entity';
import { MenuItemVariantModule } from '../menu-item-variant/menu-item-variant.module'; // Import MenuItemVariantModule

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Normative,
      Ingredient
    ]),
    MenuItemVariantModule, // Import MenuItemVariantModule to access MenuItemVariantRepository
  ],
  controllers: [NormativeController],
  providers: [NormativeService],
  exports: [TypeOrmModule] // Export TypeOrmModule for other modules
})
export class NormativeModule {}