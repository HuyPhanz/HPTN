import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './Category';
import { Product } from './Product';
import { User } from './User';
import { Events } from './Event';

@Entity({ name: 'store' })
export class Store {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  description: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Category, (category) => category.stores)
  category: Category;

  @ManyToMany(() => Product, (product) => product.store)
  @JoinTable()
  products: Product[];

  @ManyToOne(() => Events, (event) => event.stores)
  @JoinTable()
  event: Event;
}
