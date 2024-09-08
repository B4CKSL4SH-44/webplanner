const addProject = async (req: Request): Promise<Response> => {
    const request = await req.json();
    console.log(request);
    return new Response('Test');
};
export default addProject;
