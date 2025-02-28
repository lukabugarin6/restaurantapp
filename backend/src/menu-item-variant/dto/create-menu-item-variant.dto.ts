// create-menu-item-variant.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDecimal, IsArray, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateNormativeDto } from '../../normative/dto/create-normative.dto';

export class CreateMenuItemVariantDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  size: string;

  @ApiProperty()
  @IsDecimal()
  price: number;

  @ApiProperty({ type: [CreateNormativeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateNormativeDto)
  normatives: CreateNormativeDto[];
}