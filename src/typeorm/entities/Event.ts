import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Store } from './Store';

@Entity({ name: 'events' })
export class Events {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column()
  content: string;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column({ default: 'active' })
  status: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Store, (store) => store.event)
  stores: Store[];
}
