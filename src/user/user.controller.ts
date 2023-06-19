import { Controller } from '@nestjs/common';

import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserAudit } from './entities/user-audit.entity';
import { CrudAndAuditOperationsCrontoler } from '../core/architecture/controllers/crud-and-audit-operations.controller';

@Controller('user')
export class UserController extends CrudAndAuditOperationsCrontoler<
  User,
  UserAudit,
  EntityId
> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }
}
