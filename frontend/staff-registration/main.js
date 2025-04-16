const button = document.getElementById('submit-button');
const staffname = document.getElementById('name');
const staffid = document.getElementById('staffid');
const airportid = document.getElementById('airportid');
const role = document.getElementById('role');

button.addEventListener('click', async (event) =>{
    try {
        event.preventDefault();
        const request = await fetch("http://localhost:3000/register",{
            mode : 'cors',
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                type : "database update request",
                for : "staff registration",
                parameter1 : "staff name",
                parameter2 : "staff id",
                parameter3 : "airportid",
                parameter4: "role",
                staffname : `${staffname.value}`,
                staffid : `${staffid.value}`,
                airportid : `${airportid.value}`,
                role : `${role.value}`
            })
        });
        const response = await request.json();
        if(response.message == "not allowed"){
            alert("You are not allowed to register");
            console.log(response);
        }
        else if(response.message == "queries executed"){
            alert("You have been registered successfully");
        }
        else{
            alert("Registration Failed. Try again.");
        }
    } catch (error) {
        console.log(error);
    }
    
});
