const server = Bun.serve({
    port: Bun.env.PORT || 8000,
    fetch() {
        return new Response('Hello via Bun!');
    },
});

console.log(`Listening on port ${server.port}...`);
