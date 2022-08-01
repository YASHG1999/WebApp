import { UserRole } from '../../user/enum/user.role';

export type JwtPayload = {
  iss: string;
  exp?: number;
  iat: number;
  userId: string;
  role: typeof UserRole;
};
