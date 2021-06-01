const fs=require('fs')

const requestHandler=(req,res)=>{
    //print request data
        //console.log(req.url,req.method,req.headers);
    //send response
    const url=req.url;
    const method=req.method;
    if(url==='/'){
       // res.setHeader('Content-Type','text/html')
        res.write('<html>');
        res.write('<head><title>Home Page</title></head>')
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"/><button type="submit">Submit</button></form></body>')
        res.write('</html>');
         return res.end();
    }
    if(url==='/message' && method==='POST'){
        const body=[]
        req.on('data',(chunk)=>{
            console.log(chunk);
            body.push(chunk)
            console.log('3') 
        });
        return req.on('end',()=>{
            const parseBody=Buffer.concat(body).toString();
            const message=parseBody.split('=')[1]
            fs.writeFile('message.txt',message,err=>{
                console.log('4')  
                res.statusCode=302;
                res.setHeader('Location','/');
                return res.end();
            });
           });
        
        
    }
    res.setHeader('Content-Type','text/html')
        res.write('<html>');
        res.write('<body>Node Js is Live!! this is not the home page</body>')
        res.write('</html>');
        res.end();

}

module.exports=requestHandler;