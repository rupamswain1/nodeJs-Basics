const http=require('http');
const routes=require('./routes')
const assignmentRoute=require('./assignmentRoute1');

const server=http.createServer(assignmentRoute);

server.listen(8000);