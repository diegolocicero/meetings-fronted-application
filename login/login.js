async function getData() {
    const input = document.getElementById("input");
    const url = 'https://standupparo-apis.vercel.app/api/company-name';
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': input.value
            }
        });
        if (!response.ok) {
            throw new Error(response.status);
        }
        const data = await response.json();
        console.log(data);
        return data;
        
    } catch (error) {
        document.getElementById("error-msg").innerHTML = "API key non valida";
        return null;
    }
}

async function saveOnStorage()
{
    const input = document.getElementById("input");
    if(!input.value){
        document.getElementById("error-msg").innerHTML = "API key non valida";
        return;
    }
    const data = await getData();
    if(!data) { return; }
    localStorage.setItem("key", input.value);
    window.location.href = "/dashboard/dashboard.html"
}