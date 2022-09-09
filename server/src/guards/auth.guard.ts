import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt.guard';
import { RolesGuard } from './role.guard';
import { Roles } from '../decorators/roles.decorator';

/**
 * Wraps up multiple decorators together to reduce duplicated need for many
 * decorates.
 */
export function Auth(...roles: string[]) {
  return applyDecorators(
    Roles(...roles),
    UseGuards(JwtAuthGuard, RolesGuard)
  );
}
