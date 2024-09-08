import express from 'express';
import fs from "fs";
import {dirname} from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.get("/" , (req,res)=>{
    res.send("Hello World");
})

app.get("/video", (req, res) => {
    const file = `${__dirname}/public/{Your File Location}`;
    try {
      const stat = fs.statSync(file);
      const fileSize = stat.size;
      const range = req.headers.range;
  
      if (!range) {
        //send the entire file
        const headers = {
          "Content-Length": fileSize,
          "Content-Type": " ",//videofilename,
          "Cross-Origin-Resource-Policy": "cross-origin",
          "Content-Disposition": "inline",
        };
        res.writeHead(200, headers);
        const fileStream = fs.createReadStream(file);
        fileStream.pipe(res);
      } else {
        const chunkSize = 10 ** 6; // 1MB chunk size
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + chunkSize - 1, fileSize - 1);
        const contentLength = end - start + 1;
  
        const headers = {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": contentLength,
          "Content-Type": " ",//videofilename,
          "Cross-Origin-Resource-Policy": "cross-origin",
          "Content-Disposition": "inline",
        };
  
        res.writeHead(206, headers);
        console.log(headers);
        const fileStream = fs.createReadStream(file, { start, end });
        fileStream.pipe(res);
      }
    } catch (error) {
      res.status(500).send("Internal Server Error");
      console.error("Error handling video request:", error);
    }
  });
app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})
