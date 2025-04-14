window.onload = () => {
    const trackercontainer = document.getElementById('tracker-container');
    trackercontainer.style.height = "200px";
};
const trackflightbutton = document.getElementById('tracker-button');
trackflightbutton.addEventListener('click', () =>{
    const trackercontainer = document.getElementById('tracker-container');
    let height = trackercontainer.style.height;
    if(height == "200px")
        trackercontainer.style.height = "500px";
    else{
        trackercontainer.style.height = "200px";
    }
});
//server code
const button = document.getElementById('flight-search');
button.addEventListener('click', async () => {
    try {
        const request = await fetch("http://localhost:3000/welcome/",{
            mode : 'cors',
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                type : "database search request",
                for : "available flights",
                parameter1 : "flying from",
                parameter2 : "flying to",
                parameter3 : "date",
            })
        });
        const response = await request.json();
        console.log(response);
    } catch (error) {
        console.log(error)
    }
});