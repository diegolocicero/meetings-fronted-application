async function getData() {
    const input = document.getElementById("input");
    const url = 'https://standupparo-apis.vercel.app/api/company-name';
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': localStorage.getItem("key")
            }
        });
        if (!response.ok) {
            throw new Error(response.status);
        }
        const data = await response.json();
        if(data)
        {
            console.log(data);
            
            document.getElementById("company-title").innerHTML = data.companyName;
        }
        return data;
        
    } catch (error) {
        return null;
    }
}