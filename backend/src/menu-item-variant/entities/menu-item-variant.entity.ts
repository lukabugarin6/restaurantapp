// menu-item-variant.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Normative } from 'src/normative/entities/normative.entity';
import { MenuItem } from 'src/menu-item/entities/menu-item.entity';
import { Expose, Type } from 'class-transformer';

@Entity()
export class MenuItemVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  size: string;

  @Column('decimal', { precision: 10, scale: 2 }) // Use DECIMAL for price
  price: number;

  @ManyToOne(() => MenuItem, (menuItem) => menuItem.variants, {
    onDelete: 'CASCADE', // Add this line
  })
  @Expose({ groups: ['include-menu'] })
  @Type(() => MenuItem)
  menuItem: MenuItem;

  @OneToMany(() => Normative, (normative) => normative.variant, {
    cascade: true,
  })
  normatives: Normative[];
}