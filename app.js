const express = require("express");
const app = express();

const PORT = 8080;

app.get("/",
    (req,res,next) => {
        res.send("hallo");
    }
);

app.listen(PORT);