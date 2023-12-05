// import {
//   Column,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import { Product } from './Product';
// import { Events } from './Event';
//
// @Entity('event_product')
// export class EventProduct {
//   @PrimaryGeneratedColumn()
//   id: number;
//
//   @Column()
//   quantity: number;
//
//   @ManyToOne(() => Events, (event) => event.products)
//   @JoinColumn({ name: 'event_id' })
//   event: Event;
//
//   @ManyToOne(() => Product, (product) => product.events)
//   @JoinColumn({ name: 'product_id' })
//   product: Product;
// }
