const button = document.getElementById('submit-button');
const itemid = document.getElementById('firstname');
const airportid = document.getElementById('lastname');
const datefound = document.getElementById('date');
const description = document.getElementById('resizeable-desc');

button.addEventListener('click', async (event) =>{
    try {
        event.preventDefault();
        const request = await fetch("http://localhost:3000/lostandfound",{
            mode : 'cors',
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                type : "database update request",
                for : "lost and found log",
                parameter1 : "item id",
                parameter2 : "airport id",
                parameter3 : "date found",
                parameter4 : "description",
                itemid : `${itemid.value}`,
                airportid : `${airportid.value}`,
                datefound : `${datefound.value}`,
                description : `${description.value}`,
            })
        });
        const response = await request.json();
        console.log(response);
    } catch (error) {
        console.log(error);
    }
    
});
