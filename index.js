import express from "express";
import bodyParser from "body-parser";
import fs, { read } from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const fileData = [];

fs.readdir('views/user_blogs/', (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach(file => {
        const filePath = path.join('views/user_blogs/', file);
        const data = fs.readFileSync(filePath, 'utf8');
        var id = fileData.length+1;
        const fileContent = { name: file, content: data, id:id };
        fileData.push(fileContent);
        console.log(fileContent);
    });
});



app.post("/submit", (req, res) => {
    var date = new Date();
    const file_name =  `testing${date.getDay() + date.getMilliseconds()}.txt`;
    const file_path = path.join('views/user_blogs/', file_name);
    var content = req.body["blogInput"];

    fs.writeFile(file_path, content , function(err) {
        if(err) {
            return console.log(err);
        }
        
        res.redirect("/");
    });
});

app.post("/delete", (req, res) => {
    const fileName = req.body.fileName;
    const filePath = path.join('views/user_blogs/', fileName);

   
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return;
        }
        console.log('File deleted successfully');
        const index = fileData.findIndex(file => file.name === fileName);
        if (index !== -1) {
            fileData.splice(index, 1);
        }
        res.redirect("/");
    });
});


app.get("/", (req, res) => {
    res.render("index.ejs", { fileData: fileData }); 
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
