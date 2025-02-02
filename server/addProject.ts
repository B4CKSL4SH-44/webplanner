// eslint-disable-next-line import/no-unresolved
import { type Database } from 'bun:sqlite';
import type { Project } from '../src/tasks';

const addProject = async (req: Request, db: Database): Promise<Response> => {
    const request: Project = await req.json();
    // console.log('addproject :', request);
    try {
        const response = db.query(`SELECT * FROM Projects WHERE alias="${request.alias}"`).get();
        if (response !== null) {
            return new Response(
                JSON.stringify({ success: false, status: 'Already in use' }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                },
            );
            // return Response.json({ success: false, status: 'Already in use' });
        }
        console.log('RESPONSE: ', response);
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
        // console.log('QUERY: ', query);
        db.query(query).run();

        return Response.json({ success: true, status: '' });
    } catch (error) {
        if (error instanceof Error) {
            console.log('ERROR: ', error);
            return new Response(`ERROR :${error.message}`);
        }
        return new Response('UNKNOWN ERROR');
    }
};
export default addProject;
