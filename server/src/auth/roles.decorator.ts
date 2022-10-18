import { SetMetadata } from '@nestjs/common';

/**
 * Basic decorator which will set the meta data of a handler to include
 * the list of roles that will have access to that endpoint.
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
