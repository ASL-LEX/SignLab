import { Project } from './project.dto';
export interface Study {
    _id?: string;
    name: string;
    description: string;
    instructions: string;
    project: Project | string;
    tagSchema: {
        dataSchema: any;
        uiSchema: any;
    };
    tagsPerEntry: number;
}
export interface StudyCreation {
    study: Omit<Study, 'project'>;
    projectID: string;
    trainingEntries: string[];
    disabledEntries: string[];
}
