import {BadRequestException} from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OrganizationCreate } from './organization.dto';
import { Organization } from './organization.schema';
import { OrganizationService } from './organization.service';

@Resolver(() => Organization)
export class OrganizationResolver {
  constructor(private readonly orgService: OrganizationService) {}

  @Query(() => [Organization])
  async getOrganizations(): Promise<Organization[]> {
    return this.orgService.find();
  }

  @Query(() => Boolean)
  async exists(@Args('name') name: string): Promise<boolean> {
    return this.orgService.exists(name);
  }

  @Query(() => Organization)
  async findOrganization(@Args('organization') organization: string): Promise<Organization> {
    const org = await this.orgService.findOne(organization);
    if (!org) {
      throw new BadRequestException(`Organization with id ${organization} does not exist`);
    }
    return org;
  }

  @Mutation(() => Organization)
  async createOrganization(@Args('orgCreate') orgCreate: OrganizationCreate): Promise<Organization> {
    return this.orgService.create(orgCreate);
  }
}
