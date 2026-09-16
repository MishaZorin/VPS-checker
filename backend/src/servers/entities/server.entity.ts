import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
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
  authType!: 'password' | 'key';

  @Column({ type: 'text' })
  privateKey!: string; // пароль или SSH-ключ, в зависимости от authType — храним как есть для MVP

  // Привязка сервера к конкретному пользователю — без этого все видели бы чужие сервера
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;

  @Column()
  userId!: string;
}