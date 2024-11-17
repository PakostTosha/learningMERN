import express from "express";

const app = express();

app.get("/", (req, res) => {
	res.send("Hello world!");
});

app.listen(4444, (error) => {
	if (error) {
		return console.log(error);
	}

	console.log("Server OK");
});
