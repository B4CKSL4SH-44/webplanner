// eslint-disable-next-line import/no-unresolved
import { Database } from 'bun:sqlite';

const addProject =async (req: Request, db: Database): Promise<Response> => {
    try {
        const request = await req.json()
        const {newProject} = request
        // console.log(request);
        console.log(`INSERT INTO Projects (
            "${newProject.alias}",
            "${JSON.stringify(newProject.tasks)}",
            "${JSON.stringify(newProject.boards)}"
            )`)
        db.query(`INSERT INTO Projects (alias, tasks, boards) VALUES (
            '${newProject.alias}',
        '${JSON.stringify(newProject.tasks)}',
        '${JSON.stringify(newProject.boards)}')`).run()
    } catch (error) {
        console.log(error)
        return new Response("test", {status: 400, statusText: "Something went wrong"})
        
    }
    return new Response('Test');
    
};
export default addProject;
