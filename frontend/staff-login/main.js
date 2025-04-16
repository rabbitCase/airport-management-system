const button = document.getElementById('button');
const staffid = document.getElementById('staffid');
const staffname = document.getElementById('name');

button.addEventListener('click', async (event) =>{
    try {
        event.preventDefault();
        const request = await fetch("http://localhost:3000/login",{
            mode : 'cors',
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                type : "authentication request",
                for : "staff login",
                parameter1 : "staffid",
                parameter2 : "name",
                staffid : `${staffid.value}`,
                name : `${staffname.value}`
            })
        });
        const response = await request.json();
        console.log(response);
        if(response.message == "authenticated"){
            window.open("http://localhost:3000/logged-in", "_blank")
        }
        else{
            alert("You are not registered.");
        }
    } catch (error) {
        console.log(error);
    }
});
