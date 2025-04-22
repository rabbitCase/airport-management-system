window.onload = () => {
	const trackercontainer = document.getElementById("tracker-container");
	trackercontainer.style.height = "230px";
};
const trackflightbutton = document.getElementById("tracker-button");
trackflightbutton.addEventListener("click", () => {
	const trackercontainer = document.getElementById("tracker-container");
	let height = trackercontainer.style.height;
	if (height == "230px") trackercontainer.style.height = "500px";
	else {
		trackercontainer.style.height = "230px";
	}
});
//server code
function locationToId(location) {
	//convert location to reference id used by database
	if (location.toLowerCase() == "mumbai") {
		return 1;
	} else if (location.toLowerCase() == "delhi") {
		return 2;
	} else if (location.toLowerCase() == "bengaluru") {
		return 3;
	} else if (location.toLowerCase() == "kolkata") {
		return 4;
	} else {
		return 5;
	}
}
function idToLocation(id) {
	if (id === 1) {
		return "Mumbai";
	} else if (id === 2) {
		return "Delhi";
	} else if (id === 3) {
		return "Bengaluru";
	} else if (id === 4) {
		return "Kolkata";
	} else {
		return "Hyderabad";
	}
}
function airlineToId(id) {
	//convert airline id to airline name referrenced by database
	if (id === 1) {
		return "Air India";
	} else if (id === 2) {
		return "IndiGo";
	} else if (id === 3) {
		return "SpiceJet";
	} else if (id === 3) {
		return "Vistara";
	} else {
		return "GoAir";
	}
}
const button = document.getElementById("flight-search");
const flyingfrom = document.getElementById("flying-from");
const flyingto = document.getElementById("flying-to");
const tripdate = document.getElementById("trip-date");

button.addEventListener("click", async () => {
	const depairport = locationToId(`${flyingfrom.value}`);
	const arrairport = locationToId(`${flyingto.value}`);
	const result = document.getElementById("results");
	result.innerHTML = "";
	try {
		const request = await fetch("http://localhost:3000/welcome/", {
			mode: "cors",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				type: "database search request",
				for: "available flights",
				parameter1: "flying from",
				parameter2: "flying to",
				parameter3: "date",
				flyingfrom: `${flyingfrom.value}`,
				flyingto: `${flyingto.value}`,
				tripdate: `${tripdate.value}`,
				depairport: `${depairport}`,
				arrairport: `${arrairport}`,
			}),
		});
		const response = await request.json();
		response.forEach((key) => {
			const newresult = document.createElement("div");
			newresult.className = "card";
			result.appendChild(newresult); //new info card

			const tripdetails = document.createElement("div"); //for airline name and dep/land location
			tripdetails.className = "left-info";
			newresult.appendChild(tripdetails); //add this div to our card

			const airlineName = document.createElement("div"); //for airline name
			airlineName.textContent = airlineToId(key.AirlineID);
			airlineName.style.fontWeight = "900";
			tripdetails.appendChild(airlineName);

			const travelPath = document.createElement("div");
			travelPath.textContent = `${idToLocation(
				key.DepartureAirportID
			)} to ${idToLocation(key.ArrivalAirportID)}`;
			tripdetails.appendChild(travelPath);

			const deptime = document.createElement("div"); //for departure time
			deptime.className = "right-info";
			newresult.appendChild(deptime);

			const depHeader = document.createElement("div");
			depHeader.textContent = "DEPARTURE TIME";
			depHeader.style.fontWeight = "900";
			deptime.appendChild(depHeader);

			const depTime = document.createElement("div"); //time of departure
			depTime.textContent = `${key.DepartureTime}`;
			deptime.appendChild(depTime);

			const arrtime = document.createElement("div"); //for departure time
			arrtime.className = "right-info";
			newresult.appendChild(arrtime);

			const arrHeader = document.createElement("div");
			arrHeader.textContent = "ARRIVAL TIME";
			arrHeader.style.fontWeight = "900";
			arrtime.appendChild(arrHeader);

			const arrTime = document.createElement("div"); //time of departure
			arrTime.textContent = `${key.ArrivalTime}`;
			arrtime.appendChild(arrTime);
		});
		window.scrollBy({ top: 450, behavior: "smooth" });
	} catch (error) {
		console.log(error);
	}
});
