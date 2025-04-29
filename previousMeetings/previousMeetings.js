async function getData() {
    const url = 'https://standupparo-apis.vercel.app/api/stand-ups';
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
        const data =  await response.json();            
        return data;
        
    } catch (error) {
        return null;
    }
}

async function renderData()
{
    const data = await getData();    
    populateList(data);
    
}


function populateList(data) {
    const meetingsList = document.getElementById("meetings-wrapper");
    meetingsList.innerHTML = ""; // pulisce prima di riempire

    data.forEach(e => {
        const meeting = document.createElement("div");
        const date = document.createElement("p");
        const durationMins = document.createElement("p");

        const dateObj = new Date(e.date);
        date.innerText = `Data: ${dateObj.toLocaleString().split(",")[0]}`;
        durationMins.innerText = `Durata Totale: ${e.durationMins} minuti`;

        meeting.appendChild(date);
        meeting.appendChild(durationMins);

        meetingsList.appendChild(meeting);
    });
}
