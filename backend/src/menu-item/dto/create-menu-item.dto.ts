import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateMenuItemVariantDto } from 'src/menu-item-variant/dto/create-menu-item-variant.dto';

export class CreateMenuItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ required: false })
  @IsString()
  description?: string;

  @ApiProperty({ type: [CreateMenuItemVariantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMenuItemVariantDto)
  variants: CreateMenuItemVariantDto[];
}