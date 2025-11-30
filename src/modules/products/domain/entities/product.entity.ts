import { CustomBaseEntity } from '@database/orm/entities';
import { Column, Entity } from 'typeorm';

@Entity('products')
export class ProductEntity extends CustomBaseEntity {
  @Column({ unique: true })
  sku: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  brand?: string;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  color: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  currency: string;

  @Column('int')
  stock: number;
}