// menu-item.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { MenuItemVariant } from 'src/menu-item-variant/entities/menu-item-variant.entity';

@Entity()
export class MenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  type: string; // "pizza" or "drink"

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null;

  @OneToMany(() => MenuItemVariant, (variant) => variant.menuItem, {
    cascade: true,
  })
  variants: MenuItemVariant[];
}