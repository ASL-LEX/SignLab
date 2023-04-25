import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetOrganizationsGQL } from 'src/app/graphql/organization/organization.generated';
import { Organization } from '../../graphql/graphql';

@Injectable()
export class OrganizationService {
  private organizationObs: BehaviorSubject<Organization[]> = new BehaviorSubject<Organization[]>([]);
  private currentOrganizationObs: BehaviorSubject<Organization | null> = new BehaviorSubject<Organization | null>(null);

  constructor(private readonly getOrganizationsGQL: GetOrganizationsGQL) {
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

  setOrganization(organization: Organization | null) {
    this.currentOrganizationObs.next(organization);
  }
}
