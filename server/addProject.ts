// eslint-disable-next-line import/no-unresolved
import { type Database } from 'bun:sqlite';
import type { Project } from '../src/tasks';
import type { CustomResponse } from '.';

const addProject = async (req: Request, db: Database): Promise<CustomResponse> => {
    const request: Project = await req.json();
    // console.log('addproject :', request);
    try {
        const response = db.query(`SELECT * FROM Projects WHERE alias="${request.alias}"`).get();
        if (response !== null) {
            return { success: false, status: 'Already in use' };
        }
        const query = `INSERT INTO Projects (
        id,
        alias,
        tasks,
        boards
        ) VALUES (
        ${request.id},
        "${request.alias}",
        '${JSON.stringify(request.tasks)}',
        '${JSON.stringify(request.boards)}');`;
        db.query(query).run();

        return { success: true, status: '' };
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, status: error.message };
        }
        return { success: false, status: 'UNKNOWN ERROR' };
    }
};
export default addProject;
