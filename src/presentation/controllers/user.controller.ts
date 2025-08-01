import { Request, Response } from 'express';
import { CreateUserHandler } from '../../application/commands/users/create-user.handler';
import { UpdateUserHandler } from '../../application/commands/users/update-user.handler';
import { DeleteUserHandler } from '../../application/commands/users/delete-user.handler';
import { GetUserHandler } from '../../application/queries/users/get-user.handler';
import { GetAllUsersHandler } from '../../application/queries/users/get-all-users.handler';
import { CreateUserCommand } from '../../application/commands/users/create-user.command';
import { UpdateUserCommand } from '../../application/commands/users/update-user.command';
import { DeleteUserCommand } from '../../application/commands/users/delete-user.command';
import { GetUserQuery } from '../../application/queries/users/get-user.query';
import { GetAllUsersQuery } from '../../application/queries/users/get-all-users.query';

export class UserController {
  constructor(
    private createUserHandler: CreateUserHandler,
    private updateUserHandler: UpdateUserHandler,
    private deleteUserHandler: DeleteUserHandler,
    private getUserHandler: GetUserHandler,
    private getAllUsersHandler: GetAllUsersHandler
  ) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      
      console.log(`[CREATE_USER] Tentativa de criar usuário: ${email}`);

      if (!name || !email || !password) {
        console.log(`[CREATE_USER] Campos obrigatórios faltando: name=${!!name}, email=${!!email}, password=${!!password}`);
        res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
        return;
      }

      const command: CreateUserCommand = {
        name,
        email,
        password,
      };

      console.log(`[CREATE_USER] Executando comando para usuário: ${email}`);
      const user = await this.createUserHandler.execute(command);

      console.log(`[CREATE_USER] Usuário criado com sucesso: ${user.id}`);
      res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error(`[CREATE_USER] Erro ao criar usuário:`, error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;

      if (!id) {
        res.status(400).json({ error: 'ID do usuário é obrigatório' });
        return;
      }

      if (!name && !email && !password) {
        res.status(400).json({ error: 'Pelo menos um campo deve ser fornecido para atualização' });
        return;
      }

      const command: UpdateUserCommand = {
        id,
        name,
        email,
        password,
      };

      const user = await this.updateUserHandler.execute(command);

      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      res.status(200).json({
        message: 'Usuário atualizado com sucesso',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'ID do usuário é obrigatório' });
        return;
      }

      const command: DeleteUserCommand = { id };
      const success = await this.deleteUserHandler.execute(command);

      if (!success) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      res.status(200).json({
        message: 'Usuário deletado com sucesso',
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor' });
      }
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'ID do usuário é obrigatório' });
        return;
      }

      const query: GetUserQuery = { id };
      const user = await this.getUserHandler.execute(query);

      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const { name, page, limit } = req.query;
      
      const query: GetAllUsersQuery = {
        ...(name && { name: name as string }),
        ...(page && { page: parseInt(page as string) }),
        ...(limit && { limit: parseInt(limit as string) }),
      };

      const result = await this.getAllUsersHandler.execute(query);

      res.status(200).json({
        data: result.data.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })),
        pagination: result.pagination,
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
} 