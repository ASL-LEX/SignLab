import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organization, OrganizationDocument } from './organization.schema';
import { Model } from 'mongoose';
import { OrganizationCreate } from './organization.dto';

@Injectable()
export class OrganizationService {
  constructor(@InjectModel(Organization.name) private orgModel: Model<OrganizationDocument>) {}

  async find(): Promise<Organization[]> {
    return this.orgModel.find();
  }

  /** Create a new organization. The name must be unique */
  async create(orgCreate: OrganizationCreate): Promise<Organization> {
    if (await this.exists(orgCreate.name)) {
      throw new BadRequestException(`Organization with the name ${orgCreate.name} already exists`);
    }

    return this.orgModel.create(orgCreate);
  }

  /** Check to see if an organization with the given name already exists */
  async exists(name: string): Promise<boolean> {
    const org = await this.orgModel.findOne({ name }).exec();
    return org !== null;
  }
}
