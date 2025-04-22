require("dotenv").config();

const cors = require("cors");
const path = require("path");
const express = require("express");
const sql = require("mysql2");
const app = express();
const port = 3000;

const delayrouter = require(path.join(__dirname, "routes/delayroute"));
const checkinrouter = require(path.join(__dirname, "routes/checkinroute"));
const lfrouter = require(path.join(__dirname, "routes/lostnfoundroute"));
const staffregistrationrouter = require(path.join(
	__dirname,
	"routes/regroute"
));
const welcomerouter = require(path.join(__dirname, "routes/welcomeroute"));
const staffloginrouter = require(path.join(__dirname, "routes/loginroute"));
const loggedinrouter = require(path.join(__dirname, "routes/loggedinroute"));

const dbConnection = sql.createConnection({
	host: "localhost",
	user: "root",
	password: process.env.DB_PASSWORD,
	database: "airport_db",
	connectionLimit: 20,
});

let loggedIn = false;

app.use(express.text());
app.use(express.json());
app.use(cors());

function requireLogin(req, res, next) {
	if (loggedIn) {
		return next();
	} else {
		try {
			res.redirect("/login");
		} catch (err) {
			console.error("ERROR: ", err);
			res.status(500).send("Error encoutnered");
		}
	}
}

app.use("/baggage", requireLogin, checkinrouter);
app.use("/delay", requireLogin, delayrouter);
app.use("/lostandfound", requireLogin, lfrouter);
app.use("/register", staffregistrationrouter);
app.use("/welcome", welcomerouter);
app.use("/login", staffloginrouter);
app.use("/logged-in", requireLogin, loggedinrouter);

let loginName = "";

app.get("/", (req, res) => {
	app.use(express.static(path.join(__dirname, "../frontend/home")));
	res.sendFile(path.join(__dirname, "../frontend/home/index.html"));
});

app.post("/welcome", (req, res) => {
	let query = `select AirlineID, DepartureAirportID, ArrivalAirportID, TIME(DepartureTime) as DepartureTime, TIME(ArrivalTime) as ArrivalTime from flight where DepartureAirportID = ${req.body.depairport} and ArrivalAirportID = ${req.body.arrairport} and DATE(DepartureTime) = '${req.body.tripdate}'`;

	dbConnection.query(query, (err, result) => {
		if (err) {
			console.log("Error occured: ", err);
		}
		res.json(result);
		console.log(result);
	});
});

app.post("/delay", (req, res) => {
	let flightid = req.body.flightid;
	let delay = req.body.delay;

	const query = `update flight set delay = ${delay} where FlightID = ${flightid}`;

	dbConnection.query(query, (err, result) => {
		if (err) {
			console.log("Query error:", err);
			return res.json({ error: "Query failed", details: err });
		}
		res.json({ message: "query executed" });
		console.log("Query result:", result);
	});
});

app.post("/baggage", (req, res) => {
	let passengerid = req.body.passengerid;
	let baggagetag = req.body.baggagetag;
	let weight = req.body.weight;
	let departureairport = req.body.departureairport;
	let arrivalairport = req.body.arrivalairport;

	const query = `insert into baggage values(${passengerid},'${baggagetag}',${weight},'${departureairport}','${arrivalairport}')`;

	dbConnection.query(query, (err, result) => {
		if (err) {
			console.log("Query error:", err);
			return res.json({ error: "Query failed", details: err });
		}
		res.json({ message: "query executed" });
		console.log("Query result:", result);
	});
});

app.post("/lostandfound", (req, res) => {
	let itemid = req.body.itemid;
	let airportid = req.body.airportid;
	let datefound = req.body.datefound;
	let description = req.body.description;

	const query = `insert into lostandfound values(${itemid}, ${airportid}, '${datefound}', '${description}')`;

	dbConnection.query(query, (err, result) => {
		if (err) {
			console.log("Query error:", err);
			return res.json({ error: "Query failed", details: err });
		}
		res.json({ message: "query executed" });
		console.log("Query result:", result);
	});
});

app.post("/register", (req, res) => {
	let staffname = req.body.staffname;
	let staffid = req.body.staffid;
	let airportid = req.body.airportid;
	let role = req.body.role;
	let password = req.body.password;

	const queryStaff = `insert into staff values(${staffid}, ${airportid}, '${staffname}', '${password}')`;
	const queryRole = `insert into staff_role values(${staffid}, '${role}')`;
	const queryWorksFor = `insert into works_for values(${staffid}, '${airportid}')`;
	const queryCheckExistingStaff = "select staffid from staff";

	// if (!allowedstaff.mutableArrayObject.allowed.includes(Number(staffid))) {
	// 	return res.json({
	// 		message: "not allowed",
	// 		details:
	// 			"user is not employed by the airport and/or the employment status is not updated in the database",
	// 	});
	// }

	// registeredstaff.mutableArrayObject.registered.push(Number(staffid)); //add the registered staff to the registered array

	// console.log(
	// 	"Updated registered staff: ",
	// 	registeredstaff.mutableArrayObject.registered
	// );

	// allowedstaff.mutableArrayObject.allowed =
	// 	allowedstaff.mutableArrayObject.allowed.filter(
	// 		(value) => value != Number(staffid)
	// 	); //remove this staff from the allowed array

	// console.log(
	// 	"Updated allowed staff: ",
	// 	allowedstaff.mutableArrayObject.allowed
	// );

	// let staffAlreadyRegistered = false;

	// const thenable = {
	// 	then: function (resolve, reject) {
	// 		dbConnection.query(queryCheckExistingStaff, (err, result) => {
	// 			if (err) {
	// 				console.log("Existing staff check query error:", err);
	// 				return res.json({ error: "Query failed", details: err });
	// 			}
	// 			const existingStaff = JSON.parse(JSON.stringify(result)).map(
	// 				(item) => item.staffid
	// 			);
	// 			if (existingStaff.includes(Number(staffid))) {
	// 				staffAlreadyRegistered = true;
	// 				console.log("Staff already registered");
	// 			}
	// 			if (staffAlreadyRegistered) {
	// 				return res.json({
	// 					message: "not allowed",
	// 					details: "staffid is already in database",
	// 				});
	// 			} else {
	// 				resolve("Staff not in database!");
	// 			}
	// 		});
	// 	},
	// };

	// Promise.resolve(thenable).then(() => {
	// 	dbConnection.query(queryStaff, (err) => {
	// 		if (err) {
	// 			console.log("Staff table query error:", err);
	// 			return res.json({ error: "Query failed", details: err });
	// 		}

	// 		dbConnection.query(queryRole, (err) => {
	// 			if (err) {
	// 				console.log("Staff_role table query error:", err);
	// 				return res.json({ error: "Query failed", details: err });
	// 			}

	// 			dbConnection.query(queryWorksFor, (err) => {
	// 				if (err) {
	// 					console.log("Works_for table query error:", err);
	// 					return res.json({ error: "Query failed", details: err });
	// 				}
	// 				res.json({ message: "queries executed" });
	// 			});
	// 		});
	// 	});
	// });

	dbConnection.query(queryCheckExistingStaff, (err, result) => {
		if (err) {
			console.log("Existing staff check query error:", err);
			return res.json({ error: "Query failed", details: err });
		}
		const existingStaff = JSON.parse(JSON.stringify(result)).map(
			(item) => item.staffid
		);
		if (existingStaff.includes(Number(staffid))) {
			console.log("Staff already registered");
			return res.json({
				message: "not allowed",
				details: "staffid is already in database",
			});
		} else {
			dbConnection.query(queryStaff, (err) => {
				if (err) {
					console.log("Staff table query error:", err);
					return res.json({ error: "Query failed", details: err });
				}

				dbConnection.query(queryRole, (err) => {
					if (err) {
						console.log("Staff_role table query error:", err);
						return res.json({ error: "Query failed", details: err });
					}

					dbConnection.query(queryWorksFor, (err) => {
						if (err) {
							console.log("Works_for table query error:", err);
							return res.json({ error: "Query failed", details: err });
						}
						res.json({ message: "queries executed" });
					});
				});
			});
		}
	});
});

app.post("/login", (req, res) => {
	loginName = "";
	const staffid = req.body.staffid;
	const password = req.body.password;
	const staffname = req.body.name;
	console.log(password);
	const loginQuery = `select name from staff where staffid = ${staffid} and password = '${password}' and name = '${staffname}'`;
	const queryCheckExistingStaff = "select staffid from staff";
	let staffHasRegistered = false;
	dbConnection.query(queryCheckExistingStaff, (err, result) => {
		if (err) {
			console.log("Existing staff check query error:", err);
			return res.json({ error: "Query failed", details: err });
		}
		const existingStaff = JSON.parse(JSON.stringify(result)).map(
			(item) => item.staffid
		);
		if (existingStaff.includes(Number(staffid))) {
			dbConnection.query(loginQuery, (err, innerResult) => {
				if (err) {
					console.log("Query error:", err);
					return res.json({ error: "Query failed", details: err });
				}
				loginName = innerResult;
				if (innerResult.length === 0) {
					console.log(innerResult);
					return res.json({
						message: "not authorized",
						details: "invalid credentials",
					});
				} else {
					loggedIn = true;
					return res.json({
						message: "authenticated",
					});
				}
			});
		} else {
			return res.json({
				message: "not allowed",
				details: "staffid is not in database",
			});
		}
	});

	// if (
	// 	registeredstaff.mutableArrayObject.registered.includes(
	// 		Number(req.body.staffid)
	// 	)
	// ) {
	// 	res.send({ message: "authenticated" });
	// } else {
	// 	res.send({ message: "not allowed" });
	// }
});

app.get("/getname", (req, res) => {
	res.json({ message: loginName[0].name });
});

app.listen(port, () => {
	console.log(`Server started at port: ${port}`);
});
