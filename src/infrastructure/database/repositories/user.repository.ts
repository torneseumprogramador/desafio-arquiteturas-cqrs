import { eq } from 'drizzle-orm';
import { db } from '../connection';
import { users } from '../models/user.model';
import { UserRepository } from '../../../domain/users/user.repository';
import { User, CreateUserData, UpdateUserData } from '../../../domain/users/user.entity';

export class DrizzleUserRepository implements UserRepository {
  async create(data: CreateUserData): Promise<User> {
    const [user] = await db.insert(users).values({
      name: data.name,
      email: data.email,
      password: data.password,
    }).returning();

    if (!user) {
      throw new Error('Falha ao criar usuário');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findById(id: string): Promise<User | null> {
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
    
    if (user.length === 0) return null;

    const userData = user[0];
    if (!userData) return null;

    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (user.length === 0) return null;

    const userData = user[0];
    if (!userData) return null;

    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };
  }

  async findAll(): Promise<User[]> {
    const allUsers = await db.select().from(users);
    
    return allUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  async update(id: string, data: UpdateUserData): Promise<User | null> {
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.password) updateData.password = data.password;
    updateData.updatedAt = new Date();

    const [user] = await db.update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.length > 0;
  }
} 