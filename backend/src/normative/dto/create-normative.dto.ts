import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateNormativeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number; // Quantity of the ingredient

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  ingredientId: number; // ID of the associated ingredient
}
