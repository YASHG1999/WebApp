import { UserRole } from '../../user/enum/user.role';

export type JwtPayload = {
  iss: string;
  exp?: number;
  iat: number;
  userId: string;
  roles: typeof UserRole[];
  defaultRole: UserRole;
};
