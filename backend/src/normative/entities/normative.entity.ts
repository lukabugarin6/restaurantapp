// normative.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Ingredient } from '../../ingredient/entities/ingredient.entity';
import { MenuItemVariant } from 'src/menu-item-variant/entities/menu-item-variant.entity';

@Entity()
export class Normative {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => MenuItemVariant, (variant) => variant.normatives, {
    onDelete: 'CASCADE', // Cascade deletion from MenuItemVariant to Normative
  })
  variant: MenuItemVariant;

  @ManyToOne(() => Ingredient)
  ingredient: Ingredient;
}