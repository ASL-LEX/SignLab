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

  @Mutation(() => Organization)
  async createOrganization(@Args('orgCreate') orgCreate: OrganizationCreate): Promise<Organization> {
    return this.orgService.create(orgCreate);
  }
}
