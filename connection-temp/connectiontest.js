async function getdata(){
    const returnedPromise = await fetch('http://localhost:3000');
    const data = returnedPromise.json();
    return data;
}
const area = document.getElementById('area');
const button = document.getElementById('but');
button.addEventListener('click',async ()=>{
    const data = await getdata();
    area.textContent = JSON.stringify(data, null, 2);
});

(async () => {
    const request = await fetch("http://localhost:3000",{
        mode : 'cors',
        method : 'POST',
        headers : {
            'Content-Type' : 'text/plain'
        },
        body : "Hello from frontend!"
    });
    const response = await request.text();
    console.log(response);
})();


