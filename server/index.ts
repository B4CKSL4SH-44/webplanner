// eslint-disable-next-line import/no-unresolved
import { Database } from 'bun:sqlite';
import addProject from './addProject';

const db = new Database('./webconductor.sqlite', { create: true });

export interface CustomResponse extends Response {}

try {
    db.query('SELECT * FROM Projects').run();
} catch (error: { message: string }) {
    if (error.message === 'no such table: Projects') {
        db.query('CREATE TABLE Projects (id int, alias text, tasks text, boards text);').run();
    } else {
        console.error('Error:', error.message);
    }
}
try {
    const test = db.query('SELECT * FROM Tasks').run();
} catch (error: { message: string }) {
    if (error.message === 'no such table: Tasks') {
        db.query(`CREATE TABLE Tasks (
            id int,
            title text,
            description text,
            priority text,
            relations text,
            creator text,
            assignees text,
            project int,
            board int,
            state text,
            color int
            );`).run();
    } else {
        console.error('Error:', error.message);
    }
}

const server = Bun.serve({
    port: Bun.env.PORT || 8000,
    async fetch(req) {
        const url = new URL(req.url);
        if (url.pathname === '/addproject') {
            //  console.log('REQUEST: ', req);
            const res = await addProject(req, db);
            // console.log('RES: ', await res.json());
            return res;
            // req.json().then((request) => {
            //     console.log(request);
            //     return new Response('Test');
            // });
        }
        return new Response('Hello!');
    },
});

console.log(`Listening on port ${server.port}...`);
