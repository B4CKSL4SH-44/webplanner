export interface Task {
  id: number;
  title: string;
  desription: string;
  severity: "high" | "medium" | "low";
  relations: {
    blocks: number[];
    follows: number[];
    relation: number[];
  };
  creator: string;
  assignees: string[];
}

const tasks: Task[] = [
  {
    id: 1,
    title: "Erster Task",
    desription: "Lorem ipsum",
    severity: "high",
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
    desription: "Lorem ipsum",
    severity: "low",
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
    desription: "Lorem ipsum",
    severity: "medium",
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
