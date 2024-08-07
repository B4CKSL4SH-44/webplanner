import { action, makeObservable, observable } from 'mobx';

export interface Notebook {
    id: string;
    position: number;
    title: string;
    content: string;
}

const defaultNotebook: Notebook = {
    id: crypto.randomUUID(),
    position: 0,
    title: 'Notebook',
    content: '',
};

export default class NoteBookStore {
    private static instance: NoteBookStore;

    public notebooks: Notebook[];

    public setNotebooks = (newNotebooks: Notebook[]) => {
        this.notebooks = newNotebooks;
        NoteBookStore.writeLsNotebooks(this.notebooks);
    };

    public updateNotebookContent = (updatedNotebook: Notebook) => {
        this.notebooks.find((notebook) => notebook.id === updatedNotebook.id)!.content = updatedNotebook.content;
        this.setNotebooks([...this.notebooks]);
    };

    public addNotebook = (title: string) => {
        const newPosition = this.notebooks.length;
        const newNotebook: Notebook = {
            title,
            id: crypto.randomUUID(),
            content: '',
            position: newPosition,
        };
        this.setNotebooks([...this.notebooks, newNotebook]);
    };

    public deleteNotebook = (notebookToDelete: Notebook) => {
        const updatedNotebooks = this.notebooks.filter((notebook) => notebook.id !== notebookToDelete.id);
        updatedNotebooks.sort((a, b) => a.position - b.position).map((notebook, index) => ({ ...notebook, position: index }));
        this.setNotebooks(updatedNotebooks);
    };

    private constructor() {
        this.notebooks = [defaultNotebook];
        const lsNotebooks = localStorage.getItem('webPlannerNotebook');
        if (lsNotebooks !== null) {
            this.notebooks = JSON.parse(lsNotebooks);
        } else {
            localStorage.setItem('webPlannerNotebook', JSON.stringify([defaultNotebook]));
        }
        makeObservable(this, {
            notebooks: observable,
            setNotebooks: action,
        });
    }

    public static getInstance = () => {
        if (NoteBookStore.instance === undefined) {
            NoteBookStore.instance = new NoteBookStore();
        }
        return NoteBookStore.instance;
    };

    private static getLsNotebooks = (): Notebook[] => {
        const lsNotebooks = localStorage.getItem('webPlannerNotebook') as string;
        return JSON.parse(lsNotebooks) as Notebook[];
    };

    private static writeLsNotebooks = (newNotebooks: Notebook[]): void => {
        localStorage.setItem('webPlannerNotebook', JSON.stringify(newNotebooks));
    };
}
