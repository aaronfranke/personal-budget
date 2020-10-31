// Budget API

const express = require("express");
const app = express();
const port = 3000;

// Mongo*
let url = "mongodb://localhost:27017/budget"
const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);
const chartModel = require("./models/chart_schema");

app.use("/", express.static("public"));

app.get("/hello", (req, res) => {
	res.send("Hello World!");
});

app.get("/budget", (req, res) => {
	mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
		.then(() => {
			console.log("Connected to the database.");
			chartModel.find({})
				.then((data) => {
					console.log(data);
					res.json(data);
					mongoose.connection.close();
				})
				.catch((connectionError) => {
					console.log(connectionError);
				});
		})
		.catch((connectionError) => {
			console.log(connectionError);
		});
});

app.post("/add_to_budget", (req, res) => {
	console.log(req.query);
	mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
		.then(() => {
			console.log("Connected to the database.");
			let newData = new chartModel(req.query);
			newData.validateSync();
			if (newData.errors !== undefined) {
				let errors = [];
				for (let prop in newData.errors) {
					errors.push(newData.errors[prop].properties.message);
				}
				res.json({
					"ok": 0,
					"errors": errors
				});
				mongoose.connection.close();
				return;
			}
			chartModel.deleteOne({ "title": newData.title })
				.catch((connectionError) => {
					console.log(connectionError);
				});
			// chartModel.create causes a useless "__v" key, so use updateOne instead.
			chartModel.updateOne({ "title": newData.title }, newData, { "upsert": true })
				.then((data) => {
					console.log(data);
					res.json(data);
					mongoose.connection.close();
				})
				.catch((connectionError) => {
					console.log(connectionError);
				});
		})
		.catch((connectionError) => {
			console.log(connectionError);
		});
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
