import {
  Controller,
  Get,
  HttpStatus,
  HttpException,
  Param,
  Put,
  Delete,
  Post,
  Body,
  UseGuards,
  Req
} from '@nestjs/common';
import { User } from './user.schema';
import { UserService } from './user.service';
import { Auth } from '../auth/auth.guard';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Request } from 'express';
import { OrganizationContext } from '../organization/organization.decorator';
import { Organization } from '../organization/organization.schema';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService, private configService: ConfigService) {}

  /**
   * Get all user information for all users.
   */
  @Get('/')
  @Auth('admin')
  async getAllUsers(@OrganizationContext() organization: Organization): Promise<User[]> {
    return this.userService.findAll({ organization: organization._id });
  }

  /**
   * Get information on the logged in user
   */
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Req() request: Request): Promise<User | null> {
    return this.userService.findOne({ _id: (request.user as User)._id! });
  }

  /**
   * Add a role to the given user
   *
   * @param role The role to add to the user
   * @param id The of the user to add the role to
   */
  @Put('/:role/:id')
  @Auth('admin')
  async addRoleToUser(@Param('role') role: string, @Param('id') id: string) {
    // This endpoint is not intended for changing ownership
    if (role == 'owner') {
      throw new HttpException('The endpoint does not support changing owernship', HttpStatus.BAD_REQUEST);
    }

    const result = await this.userService.addRole(role, id);

    if (result) {
      return;
    } else {
      throw new HttpException(`Could not add role to user ID ${id}`, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Remove a role from the given user
   *
   * @param role The role to remove from the user
   * @param id The id of the user to remove the role from
   */
  @Delete('/:role/:id')
  @Auth('admin')
  async removeRoleFromUser(@Param('role') role: string, @Param('id') id: string) {
    // This endpoint is not intended for changing ownership
    if (role == 'owner') {
      throw new HttpException('The endpoint does not support changing owernship', HttpStatus.BAD_REQUEST);
    }

    // Get the user and ensure the user exists
    const user = await this.userService.findOne({ _id: id });
    if (!user) {
      throw new HttpException(`User with ID: ${id} not found`, HttpStatus.BAD_REQUEST);
    }

    // Cannot remove admin from an owner
    if (role === 'admin' && user.roles.owner) {
      throw new HttpException(`Cannot remove the admin role from an owner`, HttpStatus.BAD_REQUEST);
    }

    const result = await this.userService.removeRole(role, id);

    if (result) {
      return;
    } else {
      throw new HttpException(`Could not remove role from user ID ${id}`, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Handle adding an owner. Will update the role of the user to include
   * the ownership information.
   *
   * This will first check to see if the number of owners is below the
   * maximum before adding the provided user as an owner
   */
  @Post('/owner/add/:id')
  @Auth('owner')
  async addOwner(@Param('id') id: string) {
    // Check to make sure the maximum number of owners isn't exceeded
    const owners = await this.userService.getByRole('owner');
    if (owners.length >= this.configService.get('auth.maxOwnerAccounts')) {
      throw new HttpException(
        `Maximum number of owner accounts reached: ${this.configService.get('auth.maxOwnerAccounts')}`,
        HttpStatus.BAD_REQUEST
      );
    }

    // Get the user and ensure the user exists
    const user = await this.userService.findOne({ _id: id });
    if (!user) {
      throw new HttpException(`User with ID: ${id} not found`, HttpStatus.BAD_REQUEST);
    }
    this.userService.addRole('owner', id);
  }

  /**
   * Transfer ownership from one to user to another. After this request the
   * original owner will no longer be an owner.
   */
  @Post('/owner/transfer')
  @Auth('owner')
  async transferOwnership(@Body() transferRequest: { originalID: string; newOwnerID: string }) {
    // Verify that both users exist
    const originalOwner = await this.userService.findOne({
      _id: transferRequest.originalID
    });
    if (!originalOwner) {
      throw new HttpException(`User with ID: ${transferRequest.originalID} not found`, HttpStatus.BAD_REQUEST);
    }
    const newOwner = await this.userService.findOne({
      _id: transferRequest.newOwnerID
    });
    if (!newOwner) {
      throw new HttpException(`User with ID: ${transferRequest.originalID} not found`, HttpStatus.BAD_REQUEST);
    }

    // If the users are the same, do nothing
    if (transferRequest.originalID == transferRequest.newOwnerID) {
      return;
    }

    // Add the owner role to the new user
    this.userService.addRole('owner', transferRequest.newOwnerID);
    this.userService.addRole('admin', transferRequest.newOwnerID);

    // Remove the role from the original owner
    this.userService.removeRole('owner', transferRequest.originalID);
  }

  /**
   * Get information on the owner usage. This will give back the number of
   * current owners as well as the maximum number of owners.
   */
  @Get('/owner/info')
  @Auth('owner')
  async getOwnerInfo(): Promise<{
    numberOfOwners: number;
    maxOwnerAccounts: number;
  }> {
    const owners = await this.userService.getByRole('owner');

    return {
      numberOfOwners: owners.length,
      maxOwnerAccounts: this.configService.getOrThrow('auth.maxOwnerAccounts')
    };
  }
}
