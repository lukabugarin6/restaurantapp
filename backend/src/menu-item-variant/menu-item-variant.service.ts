import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItemVariant } from './entities/menu-item-variant.entity';
import { CreateMenuItemVariantDto } from './dto/create-menu-item-variant.dto';
import { UpdateMenuItemVariantDto } from './dto/update-menu-item-variant.dto';
import { Normative } from '../normative/entities/normative.entity';
import { Ingredient } from '../ingredient/entities/ingredient.entity';
import { MenuItem } from 'src/menu-item/entities/menu-item.entity';

@Injectable()
export class MenuItemVariantService {
  constructor(
    @InjectRepository(MenuItemVariant)
    private variantRepository: Repository<MenuItemVariant>,
    
    @InjectRepository(Normative)
    private normativeRepository: Repository<Normative>,
    
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
    
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
  ) {}

  async createVariant(menuItemId: number, createDto: CreateMenuItemVariantDto): Promise<MenuItemVariant> {
    try {
      const menuItem = await this.menuItemRepository.findOneBy({ id: menuItemId });
      if (!menuItem) {
        throw new NotFoundException(`Menu item with ID ${menuItemId} not found`);
      }

      const variant = this.variantRepository.create({
        ...createDto,
        menuItem
      });

      if (createDto.normatives) {
        variant.normatives = await Promise.all(
          createDto.normatives.map(async (n) => {
            // First find the ingredient
            const ingredient = await this.ingredientRepository.findOneBy({ 
              id: n.ingredientId 
            });
            
            if (!ingredient) {
              throw new NotFoundException(`Ingredient with ID ${n.ingredientId} not found`);
            }

            // Then create normative with validated ingredient
            return this.normativeRepository.create({
              ...n,
              ingredient
            });
          })
        );
      }

      return await this.variantRepository.save(variant);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create variant: ' + error.message);
    }
  }

  async updateVariant(variantId: number, updateDto: UpdateMenuItemVariantDto): Promise<MenuItemVariant> {
    try {
      const variant = await this.variantRepository.findOne({
        where: { id: variantId },
        relations: ['normatives']
      });

      if (!variant) {
        throw new NotFoundException(`Variant with ID ${variantId} not found`);
      }

      Object.assign(variant, updateDto);

      if (updateDto.normatives) {
        const existingNormatives = variant.normatives || [];
        const existingNormativeMap = new Map(existingNormatives.map(n => [n.id, n]));

        const updatedNormatives = await Promise.all(
          updateDto.normatives.map(async (nDto) => {
            // Handle existing or new normative
            if (nDto.id) {
              const existingNormative = existingNormativeMap.get(nDto.id);
              if (!existingNormative) {
                throw new NotFoundException(`Normative with ID ${nDto.id} not found`);
              }
              Object.assign(existingNormative, nDto);
              existingNormativeMap.delete(nDto.id);

              // Validate and assign ingredient
              const ingredient = await this.ingredientRepository.findOneBy({ 
                id: nDto.ingredientId 
              });
              if (!ingredient) {
                throw new NotFoundException(`Ingredient with ID ${nDto.ingredientId} not found`);
              }
              existingNormative.ingredient = ingredient;

              return existingNormative;
            } else {
              // Create new normative
              const ingredient = await this.ingredientRepository.findOneBy({ 
                id: nDto.ingredientId 
              });
              if (!ingredient) {
                throw new NotFoundException(`Ingredient with ID ${nDto.ingredientId} not found`);
              }
              
              return this.normativeRepository.create({
                ...nDto,
                variant,
                ingredient
              });
            }
          })
        );

        // Remove deleted normatives
        const toRemove = Array.from(existingNormativeMap.values());
        if (toRemove.length > 0) {
          await this.normativeRepository.remove(toRemove);
        }

        variant.normatives = await this.normativeRepository.save(updatedNormatives);
      }

      return await this.variantRepository.save(variant);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update variant: ' + error.message);
    }
  }

  async deleteVariant(variantId: number): Promise<void> {
    try {
      const variant = await this.variantRepository.findOneBy({ id: variantId });
      if (!variant) {
        throw new NotFoundException(`Variant with ID ${variantId} not found`);
      }
      await this.variantRepository.remove(variant);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete variant: ' + error.message);
    }
  }

  async getVariantWithNormatives(variantId: number): Promise<MenuItemVariant> {
    const variant = await this.variantRepository.findOne({
      where: { id: variantId },
      relations: ['normatives', 'normatives.ingredient']
    });

    if (!variant) {
      throw new NotFoundException(`Variant with ID ${variantId} not found`);
    }
    return variant;
  }

  async getVariantsByMenuItem(menuItemId: number): Promise<MenuItemVariant[]> {
    return this.variantRepository.find({
      where: { menuItem: { id: menuItemId } },
      relations: ['menuItem','normatives', 'normatives.ingredient']
    });
  }
}