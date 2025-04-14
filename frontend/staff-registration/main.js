const button = document.getElementById('submit-button');
const staffname = document.getElementById('name');
const staffid = document.getElementById('username');
const password = document.getElementById('password');

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
                for : "staff registration",
                parameter1 : "staff name",
                parameter2 : "staff id",
                parameter3 : "password",
                staffname : `${staffname.value}`,
                staffid : `${staffid.value}`,
                password : `${password.value}`
            })
        });
        const response = await request.json();
        console.log(response);
    } catch (error) {
        console.log(error);
    }
    
});
