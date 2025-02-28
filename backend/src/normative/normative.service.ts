import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Normative } from './entities/normative.entity';
import { CreateNormativeDto } from './dto/create-normative.dto';
import { UpdateNormativeDto } from './dto/update-normative.dto';
import { Ingredient } from '../ingredient/entities/ingredient.entity';

@Injectable()
export class NormativeService {
  constructor(
    @InjectRepository(Normative)
    private normativeRepository: Repository<Normative>,
    
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
  ) {}

  async create(createNormativeDto: CreateNormativeDto): Promise<Normative> {
    const normative = this.normativeRepository.create(createNormativeDto);
    const foundIngredient = await this.ingredientRepository.findOne({ where: { id: createNormativeDto.ingredientId }});

    if (foundIngredient) {
      normative.ingredient = foundIngredient;
    }
    
    if (!normative.ingredient) {
      throw new NotFoundException(`Ingredient with ID ${createNormativeDto.ingredientId} not found`);
    }

    return this.normativeRepository.save(normative);
  }

  async findAll(): Promise<Normative[]> {
    return this.normativeRepository.find({ relations: ['ingredient'] });
  }

  async findOne(id: number): Promise<Normative> {
    const normative = await this.normativeRepository.findOne({ where: { id }, relations: ['ingredient'] });
    if (!normative) {
      throw new NotFoundException(`Normative with ID ${id} not found`);
    }
    return normative;
  }

  async update(id: number, updateNormativeDto: UpdateNormativeDto): Promise<Normative> {
    const normative = await this.normativeRepository.findOne({ where: { id }, relations: ['ingredient'] });
    if (!normative) {
      throw new NotFoundException(`Normative with ID ${id} not found`);
    }

    // Update the normative properties
    if (updateNormativeDto.quantity) {
      normative.quantity = updateNormativeDto.quantity;
    }

    const foundIngredient = await this.ingredientRepository.findOne({ where: { id: updateNormativeDto.ingredientId }});
    if (foundIngredient) {
      normative.ingredient = foundIngredient;
    }
    
    if (!normative.ingredient) {
      throw new NotFoundException(`Ingredient with ID ${updateNormativeDto.ingredientId} not found`);
    }

    return this.normativeRepository.save(normative);
  }

  async remove(id: number): Promise<void> {
    const result = await this.normativeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Normative with ID ${id} not found`);
    }
  }
}
