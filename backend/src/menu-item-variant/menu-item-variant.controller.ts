import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, SerializeOptions } from '@nestjs/common';
import { MenuItemVariantService } from './menu-item-variant.service';
import { CreateMenuItemVariantDto } from './dto/create-menu-item-variant.dto';
import { UpdateMenuItemVariantDto } from './dto/update-menu-item-variant.dto';

@Controller('menu-items/:menuItemId/variants')
export class MenuItemVariantController {
  constructor(private readonly variantService: MenuItemVariantService) {}

  @Post()
  createVariant(
    @Param('menuItemId', ParseIntPipe) menuItemId: number,
    @Body() createDto: CreateMenuItemVariantDto
  ) {
    return this.variantService.createVariant(menuItemId, createDto);
  }

  @Get()
  @SerializeOptions({ groups: ['include-menu'] })
  getVariantsByMenuItem(@Param('menuItemId', ParseIntPipe) menuItemId: number) {
    return this.variantService.getVariantsByMenuItem(menuItemId);
  }

  @Get(':variantId')
  getVariant(
    @Param('variantId', ParseIntPipe) variantId: number
  ) {
    return this.variantService.getVariantWithNormatives(variantId);
  }

  @Patch(':variantId')
  updateVariant(
    @Param('variantId', ParseIntPipe) variantId: number,
    @Body() updateDto: UpdateMenuItemVariantDto
  ) {
    return this.variantService.updateVariant(variantId, updateDto);
  }

  @Delete(':variantId')
  deleteVariant(
    @Param('variantId', ParseIntPipe) variantId: number
  ) {
    return this.variantService.deleteVariant(variantId);
  }
}