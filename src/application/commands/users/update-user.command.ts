export interface UpdateUserCommand {
  id: string;
  name?: string | undefined;
  email?: string | undefined;
  password?: string | undefined;
} 