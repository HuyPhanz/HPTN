import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Store } from './Store';
import { Product } from './Product';

@Entity({ name: 'category' })
export class Category {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Store, (store) => store.category)
  stores: Store[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
