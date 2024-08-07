export interface Projects {
  0: Project;
  [projectId: number]: Project;
}

export interface Project {
  id: number;
  alias: string;
  tasks: Task[];
}

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  relations: Relations;
  creator: string;
  assignees: string[];
  project: number;
}

export interface Relations {
  blocks: number[] | false;
  follows: number[] | false;
  relation: number[] | false;
}

export const defaultProjects: Projects = {
  0: { id: 0, alias: "personal", tasks: [] },
};

export const defaultProject: Project = {
  id: -1,
  alias: "",
  tasks: [],
};

export const defaultTask: Task = {
  id: -1,
  title: "",
  description: "",
  priority: "medium",
  relations: {
    blocks: false,
    follows: false,
    relation: false,
  },
  creator: "",
  assignees: [],
  project: 0,
};
