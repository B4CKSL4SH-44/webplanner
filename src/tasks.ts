export interface Projects {
  personal: Task[];
  [projectName: string]: Task[];
}

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  relations: Relations;
  creator: string;
  assignees: string[];
  project: string;
}

export interface Relations {
  blocks: number[] | false;
  follows: number[] | false;
  relation: number[] | false;
}

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
  project: "personal",
};
