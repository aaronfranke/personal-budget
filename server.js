const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");

app.use("/", express.static("public"));

app.get("/hello", (req, res) => {
	res.send("Hello World!");
});

app.get("/budget", (req, res) => {
	fs.readFile("./budget_data.json", function(err, data) {
		res.json(JSON.parse(data));
	});
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
