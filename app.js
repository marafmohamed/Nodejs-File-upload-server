const http=require("http");
const fs=require("fs");
const path=require("path");
const server = http.createServer((req, res) => {
    if(req.method === 'POST' && req.url === '/upload'){
        let data = [];
        req.on('data', (chunk) => {
            data.push(chunk);
        });
        req.on('end', () => {
            const fileData = Buffer.concat([...data]);
           
            if (fileData.length === 0) {
                res.writeHead(400);
                res.end('No file uploaded');
                return;
            }
            const formParts = Buffer.concat(data).toString().split('\r\n');
            const fileNameMatch = formParts[1].match(/filename="(.+)"/);
            let fileName=''
            if (fileNameMatch) {
              fileName=fileNameMatch[1];
            }
            const filePath = path.join(__dirname,`./uploads/${fileName}`);
            const extention=path.extname(fileName);
            const AuthorizedExtentions=['.pdf','.txt','.png'];
            const maxFileSize=2*1024*1024 //2mb
            if(!AuthorizedExtentions.includes(extention)){
                res.writeHead(400)
                res.end("File extention isn't allowed")
            }
            if (fileData.length > maxFileSize) {
                res.writeHead(400);
                res.end('File size exceeds the maximum allowed size');
                return;
            }
            fs.writeFile(filePath, fileData, (err) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Error uploading the file');
                    return;
                }
            
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('File uploaded successfully');
            });
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});
const PORT=process.env.PORT ||4000;
server.listen(PORT,()=>{
    console.log("server is listening on port : ",PORT);
})