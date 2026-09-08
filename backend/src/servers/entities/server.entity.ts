import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Server {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  host!: string;

  @Column({ default: 22 })
  port!: number;

  @Column()
  username!: string;

  @Column()
  authType!: 'password' | 'privateKey';

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  privateKey?: string;
}