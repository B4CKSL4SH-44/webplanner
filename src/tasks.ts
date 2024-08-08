<<<<<<< HEAD
const tasks = [
    {
        id: 1,
        title: 'Erster Task',
        desription: 'Lorem ipsum',
        severity: 'high',
        relations: {
            blocks: [],
            follows: [],
            relation: [],
        },
        creator: 'Simon',
        assignees: [],
    },
    {
        id: 2,
        title: 'Zweiter Task',
        desription: 'Lorem ipsum',
        severity: 'low',
        relations: {
            blocks: [],
            follows: [],
            relation: [],
        },
        creator: 'Simon',
        assignees: [],
    },
    {
        id: 3,
        title: 'Dritter Task',
        desription: 'Lorem ipsum',
        severity: 'normal',
        relations: {
            blocks: [],
            follows: [],
            relation: [],
        },
        creator: 'Simon',
        assignees: [],
    },
];
=======
export interface Projects {
    0: Project;
    [projectId: number]: Project;
}
>>>>>>> origin/develop

export interface Project {
    id: number;
    alias: string;
    tasks: Task[];
    boards: { [index: number]: string };
}

export interface Task {
    id: number;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    relations: Relations;
    creator: string;
    assignees: string[];
    project: number;
    board?: number;
    state: 'open' | 'closed';
}

export interface Relations {
    blocks: number[] | false;
    follows: number[] | false;
    relation: number[] | false;
}

export const defaultProjects: Projects = {
    0: {
        id: 0, alias: 'personal', tasks: [], boards: { 0: 'NONE' },
    },
};

export const defaultProject: Project = {
    id: -1,
    alias: '',
    tasks: [],
    boards: { 0: 'NONE', 1: 'NEW' },
};

export const defaultTask: Task = {
    id: -1,
    title: '',
    description: '',
    priority: 'medium',
    relations: {
        blocks: false,
        follows: false,
        relation: false,
    },
    creator: '',
    assignees: [],
    project: 0,
    board: 0,
    state: 'open',
};
