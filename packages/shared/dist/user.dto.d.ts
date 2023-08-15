import { Organization } from './organization.dto';
export interface UserCredentials {
    username: string;
    organization: string;
    password: string;
}
export interface UserIdentification {
    username: string;
    organization: string;
    email: string;
}
export interface UserSignup {
    organization: string;
    username: string;
    email: string;
    name: string;
    password: string;
}
export interface UserAvailability {
    username: boolean;
    email: boolean;
}
export interface User {
    _id: string;
    organization: Organization;
    name: string;
    email: string;
    username: string;
    roles: {
        owner: boolean;
        projectAdmin: Map<string, boolean>;
        studyAdmin: Map<string, boolean>;
        studyContributor: Map<string, boolean>;
        studyVisible: Map<string, boolean>;
    };
}
