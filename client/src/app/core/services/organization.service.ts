import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetOrganizationsGQL } from 'src/app/graphql/organization/organization.generated';
import { Organization } from '../../graphql/graphql';

@Injectable()
export class OrganizationService {
  private organizationObs: BehaviorSubject<Organization[]> = new BehaviorSubject<Organization[]>([]);
  private currentOrganizationObs: BehaviorSubject<Organization>;

  constructor(private readonly getOrganizationsGQL: GetOrganizationsGQL) {
    this.getOrganizationsGQL.watch().valueChanges.subscribe((result) => {
      this.organizationObs.next(result.data.getOrganizations);
    });
  }

  get organizations(): Observable<Organization[]> {
    return this.organizationObs.asObservable();
  }
}
