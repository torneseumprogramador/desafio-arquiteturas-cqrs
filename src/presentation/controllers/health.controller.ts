import { Request, Response } from 'express';
import { db } from '../../infrastructure/database/connection';

export class HealthController {
  /**
   * Health Check Geral
   * Verifica o status geral da aplicação e banco de dados
   */
  async healthCheck(req: Request, res: Response): Promise<void> {
    try {
      const healthStatus: any = {
        status: 'UP',
        details: {
          application: 'UP',
          timestamp: new Date().toISOString(),
          database: await this.checkDatabaseConnection()
        }
      };

      // Determinar status geral
      const databaseStatus = healthStatus.details.database.status;
      healthStatus.status = databaseStatus === 'UP' ? 'UP' : 'DOWN';

      const statusCode = healthStatus.status === 'UP' ? 200 : 503;
      res.status(statusCode).json(healthStatus);
    } catch (error) {
      res.status(503).json({
        status: 'DOWN',
        error: 'Health check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Ping
   * Teste simples de conectividade da aplicação
   */
  async ping(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      status: 'pong',
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Health Check do Banco
   * Verifica o status detalhado da conexão com o banco de dados
   */
  async databaseHealth(req: Request, res: Response): Promise<void> {
    try {
      const databaseStatus = await this.checkDatabaseConnection();
      const statusCode = databaseStatus.status === 'UP' ? 200 : 503;
      res.status(statusCode).json(databaseStatus);
    } catch (error) {
      res.status(503).json({
        status: 'DOWN',
        error: 'Database health check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Verifica a conexão com o banco de dados
   */
  private async checkDatabaseConnection(): Promise<any> {
    try {
      // Testar conexão executando uma query simples
      const result = await db.execute('SELECT 1 as test');
      
      if (result && result.length > 0) {
        return {
          status: 'UP',
          database: 'PostgreSQL',
          driver: 'postgres-js',
          version: '15-alpine',
          url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/cqrs_db',
          username: 'postgres',
          queryTest: 'SUCCESS',
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          status: 'DOWN',
          error: 'Query test failed - no results returned',
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      return {
        status: 'DOWN',
        error: error instanceof Error ? error.message : 'Unknown database error',
        errorCode: error instanceof Error ? (error as any).code : undefined,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Health Check Detalhado
   * Verifica todos os componentes da aplicação
   */
  async detailedHealth(req: Request, res: Response): Promise<void> {
    try {
      const healthDetails: any = {
        status: 'UP',
        timestamp: new Date().toISOString(),
        components: {
          application: {
            status: 'UP',
            name: 'CQRS Ecommerce API',
            version: '1.0.0',
            environment: process.env.NODE_ENV || 'development'
          },
          database: await this.checkDatabaseConnection(),
          memory: this.getMemoryUsage(),
          uptime: this.getUptime()
        }
      };

      // Verificar se todos os componentes estão UP
      const allComponentsUp = Object.values(healthDetails.components).every(
        (component: any) => component.status === 'UP'
      );

      healthDetails.status = allComponentsUp ? 'UP' : 'DOWN';
      const statusCode = allComponentsUp ? 200 : 503;

      res.status(statusCode).json(healthDetails);
    } catch (error) {
      res.status(503).json({
        status: 'DOWN',
        error: 'Detailed health check failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Obtém informações de uso de memória
   */
  private getMemoryUsage(): any {
    const usage = process.memoryUsage();
    return {
      status: 'UP',
      rss: `${Math.round(usage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)} MB`,
      external: `${Math.round(usage.external / 1024 / 1024)} MB`
    };
  }

  /**
   * Obtém tempo de atividade da aplicação
   */
  private getUptime(): any {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    return {
      status: 'UP',
      uptime: `${hours}h ${minutes}m ${seconds}s`,
      uptimeSeconds: Math.floor(uptime)
    };
  }
} 