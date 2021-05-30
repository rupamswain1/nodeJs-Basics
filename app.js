const http=require('http');

const server=http.createServer((req,res)=>{
    //print request data
    console.log(req.url,req.method,req.headers);
    //send response
    res.setHeader('Content-Type','text/html')
    res.write('<html>');
    res.write('<body>Node Js is Live</body>')
    res.write('</html>');
    res.end();
})

server.listen(8000);