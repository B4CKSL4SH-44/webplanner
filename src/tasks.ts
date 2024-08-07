export interface Task {
  id: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  relations: Relations;
  creator: string;
  assignees: string[];
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
};

const tasks: Task[] = [
  {
    id: 1,
    title: "Erster Task",
    description: "Lorem ipsum",
    priority: "high",
    relations: {
      blocks: [],
      follows: [],
      relation: [],
    },
    creator: "Simon",
    assignees: [],
  },
  {
    id: 2,
    title: "Zweiter Task",
    description: "Lorem ipsum",
    priority: "low",
    relations: {
      blocks: [],
      follows: [],
      relation: [],
    },
    creator: "Simon",
    assignees: [],
  },
  {
    id: 3,
    title: "Dritter Task",
    description: "Lorem ipsum",
    priority: "medium",
    relations: {
      blocks: [],
      follows: [],
      relation: [],
    },
    creator: "Simon",
    assignees: [],
  },
];

export default tasks;
