import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { GetOrganizationsGQL, FindOrganizationGQL } from 'src/app/graphql/organization/organization.generated';
import { Organization } from '../../graphql/graphql';

@Injectable()
export class OrganizationService {
  private organizationObs: BehaviorSubject<Organization[]> = new BehaviorSubject<Organization[]>([]);
  private currentOrganizationObs: BehaviorSubject<Organization | null> = new BehaviorSubject<Organization | null>(null);

  constructor(
    private readonly getOrganizationsGQL: GetOrganizationsGQL,
    private readonly findOrganizationGQL: FindOrganizationGQL
  ) {
    this.getOrganizationsGQL.watch().valueChanges.subscribe((result) => {
      this.organizationObs.next(result.data.getOrganizations);
    });
  }

  get organizations(): Observable<Organization[]> {
    return this.organizationObs.asObservable();
  }

  get organization(): Observable<Organization | null> {
    return this.currentOrganizationObs.asObservable();
  }

  async setOrganization(organization: Organization | string | null) {
    if (typeof organization === 'string') {
      const org = await firstValueFrom(this.findOrganizationGQL.fetch({ organization }));
      this.currentOrganizationObs.next(org.data ? org.data.findOrganization : null);
      return;
    }

    this.currentOrganizationObs.next(organization);
  }
}
