import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { MenuItem } from './entities/menu-item.entity';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { Normative } from '../normative/entities/normative.entity';
import { Ingredient } from '../ingredient/entities/ingredient.entity';
import { MenuItemVariant } from 'src/menu-item-variant/entities/menu-item-variant.entity';
import * as fs from 'fs/promises';
import * as path from 'path';


@Injectable()
export class MenuItemService {
  constructor(
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,

    @InjectRepository(MenuItemVariant)
    private variantRepository: Repository<MenuItemVariant>,

    @InjectRepository(Normative)
    private normativeRepository: Repository<Normative>,

    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
  ) {}

  async create(createMenuItemDto: CreateMenuItemDto, imageUrl?: string | null): Promise<MenuItem> {
    try {
      // Create menu item without variants first
      const menuItem = this.menuItemRepository.create({
        name: createMenuItemDto.name,
        description: createMenuItemDto.description,
        type: createMenuItemDto.type,
        imageUrl: imageUrl || null
      });
  
      await this.menuItemRepository.save(menuItem); // Save menu item first
  
      // Now create and save variants
      const variants = await Promise.all(
        createMenuItemDto.variants.map(async variantDto => {
          const variant = this.variantRepository.create({
            size: variantDto.size,
            price: variantDto.price,
            menuItem: menuItem // Associate with menu item
          });
  
          if (variantDto.normatives) {
            variant.normatives = await Promise.all(
              variantDto.normatives.map(async normativeDto => {
                const ingredient = await this.ingredientRepository.findOneBy({
                  id: normativeDto.ingredientId
                });
  
                if (!ingredient) {
                  throw new NotFoundException(`Ingredient ${normativeDto.ingredientId} not found`);
                }
  
                return this.normativeRepository.create({
                  quantity: normativeDto.quantity,
                  ingredient
                });
              })
            );
          }
  
          return this.variantRepository.save(variant);
        })
      );
  
      // Attach variants properly
      menuItem.variants = variants;
  
      return menuItem;
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw new InternalServerErrorException('Could not create menu item');
    }
  }
  

  async findAll(): Promise<MenuItem[]> {
    return this.menuItemRepository.find({
      relations: {
        variants: {
          normatives: {
            ingredient: true
          }
        }
      }
    });
  }

  async findOne(id: number): Promise<MenuItem> {
    const menuItem = await this.menuItemRepository.findOne({
      where: { id },
      relations: {
        variants: {
          normatives: {
            ingredient: true
          }
        }
      }
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }
    return menuItem;
  }

  async update(
    id: number,
    updateMenuItemDto: UpdateMenuItemDto,
    imageUrl?: string | null
  ): Promise<MenuItem> {
    const menuItem = await this.findOne(id);

    if (imageUrl !== undefined) {
      if (imageUrl === null) {
        // Delete existing image
        if (menuItem.imageUrl) {
          await this.deleteImageFile(menuItem.imageUrl);
        }
        menuItem.imageUrl = null;
      } else if (imageUrl) {
        // Update image
        if (menuItem.imageUrl) {
          await this.deleteImageFile(menuItem.imageUrl);
        }
        menuItem.imageUrl = imageUrl;
      }
    }
    
    // Update menu item properties
    Object.assign(menuItem, updateMenuItemDto);

    // Handle variant updates
    if (updateMenuItemDto.variants) {
      const existingVariants = await this.variantRepository.find({ 
        where: { menuItem: { id } },
        relations: ['normatives']
      });

      // Update or create variants
      const updatedVariants = await Promise.all(
        updateMenuItemDto.variants.map(async variantDto => {
          let variant = variantDto.id 
            ? existingVariants.find(v => v.id === variantDto.id)
            : undefined;

          if (variant) {
            Object.assign(variant, variantDto);
          } else {
            variant = this.variantRepository.create({
              ...variantDto,
              menuItem
            });
          }

          // Handle normatives
          if (variantDto.normatives) {
            const updatedNormatives = await Promise.all(
              variantDto.normatives.map(async normativeDto => {
                let normative: Normative;

                // Check if normative exists
                if (normativeDto.id) {
                  normative = variant.normatives?.find(n => n.id === normativeDto.id) || 
                    this.normativeRepository.create(normativeDto);
                  Object.assign(normative, normativeDto);
                } else {
                  normative = this.normativeRepository.create(normativeDto);
                  normative.variant = variant;
                }

                // Validate ingredient exists
                const ingredient = await this.ingredientRepository.findOneBy({
                  id: normativeDto.ingredientId
                });
                
                if (!ingredient) {
                  throw new NotFoundException(`Ingredient ${normativeDto.ingredientId} not found`);
                }
                normative.ingredient = ingredient;

                return normative;
              })
            );

            // Remove deleted normatives
            const existingNormativeIds = variantDto.normatives
              .filter(n => n.id)
              .map(n => n.id);
              
            const normativesToRemove = variant.normatives?.filter(
              n => !existingNormativeIds.includes(n.id)
            );

            if (normativesToRemove?.length) {
              await this.normativeRepository.remove(normativesToRemove);
            }

            variant.normatives = await this.normativeRepository.save(updatedNormatives);
          }

          return await this.variantRepository.save(variant);
        })
      );

      // Remove deleted variants
      const updatedVariantIds = updatedVariants.map(v => v.id);
      const variantsToRemove = existingVariants.filter(
        v => !updatedVariantIds.includes(v.id)
      );
      
      if (variantsToRemove.length) {
        await this.variantRepository.remove(variantsToRemove);
      }

      menuItem.variants = updatedVariants;
    }

    return this.menuItemRepository.save(menuItem);
  }

  async remove(id: number): Promise<void> {
    const menuItem = await this.findOne(id);
    
    if (menuItem.imageUrl) {
      await this.deleteImageFile(menuItem.imageUrl);
    }
    
    await this.menuItemRepository.remove(menuItem);
  }

  private async deleteImageFile(imageUrl: string): Promise<void> {
    const filePath = path.join(
      process.cwd(),
      'uploads/images',
      path.basename(imageUrl)
    );
    
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Failed to delete image file:', error);
    }
  }
}