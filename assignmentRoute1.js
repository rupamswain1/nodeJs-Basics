
const assignmentRoute1=(req,res)=>{
    const url=req.url;
    const method=req.method;

    switch(url){
        case '/':
            res.write('<html>');
            res.write('<head><title>Assignment 1</title></head>');
            res.write('<body><h1>Hello User!!!</h1><form action="/create-user" method="POST"><input type="text" name="UserName"/><button type="submit">Submit UserName</button></form></body>')
            res.write('</html>');
            return res.end();
        case '/users':
            res.write('<html>');
            res.write('<head><title>Assignment 1-users</title></head>');
            res.write('<body><ul><li>user1</li><li>user2</li></ul></body>')
            res.write('</html>');
            return res.end();  
        case '/create-user':
            const body=[];
            req.on('data',(chunk)=>{
                body.push(chunk)
            });
            return req.on('end',()=>{
                const parsedData=Buffer.concat(body).toString();
                const userName=parsedData.split('=')[1];
                console.log(userName);
                res.statusCode=302;
                res.setHeader('Location','/');
                return res.end();
            })
           

        default:
            res.write('<html>');
            res.write('<head><title>Assignment 1</title></head>');
            res.write('<body><h1>No Route Defined</h1></body>')
            res.write('</html>'); 
            return res.end();             
    }
}
module.exports=assignmentRoute1;