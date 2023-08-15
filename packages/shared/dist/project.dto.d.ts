export interface Project {
    _id: string;
    name: string;
    description: string;
    created: Date;
}
export interface ProjectCreate extends Omit<Project, '_id' | 'created'> {
}
