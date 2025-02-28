import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Normative } from '../../normative/entities/normative.entity';

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  quantity: number;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null;

  @OneToMany(() => Normative, (normative) => normative.ingredient)
  normatives: Normative[];
}