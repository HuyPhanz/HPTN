import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Store } from './Store';
import { Category } from './Category';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  description: string;

  // @OneToMany(() => EventProduct, (event_product) => event_product.product)
  // events: EventProduct[];

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @ManyToMany(() => Store, (store) => store.products)
  store: Store[];
}
