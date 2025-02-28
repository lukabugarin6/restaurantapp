import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientService } from './ingredient.service';
import { IngredientController } from './ingredient.controller';
import { Ingredient } from './entities/ingredient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ingredient]),
  ],
  controllers: [IngredientController],
  providers: [IngredientService],
  exports: [TypeOrmModule] // Export TypeOrmModule for other modules
})
export class IngredientModule {}