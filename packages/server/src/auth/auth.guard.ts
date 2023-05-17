import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './role.guard';

/**
 * Wraps up multiple decorators together to reduce duplicated need for many
 * decorates.
 */
export function Auth(...roles: string[]) {
  return applyDecorators(Roles(...roles), UseGuards(JwtAuthGuard, RolesGuard));
}
