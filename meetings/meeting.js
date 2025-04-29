async function getData() {
    const input = document.getElementById("input");
    const url = 'https://standupparo-apis.vercel.app/api/devs';
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
        const data=  await response.json();    
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

const employeeList = [];

function populateList(data) {
    const employeesList = document.getElementById("employees-wrapper");
    employeesList.innerHTML = ""; 

    data.forEach(e => {
        const employee = document.createElement("div");
        const dataWrapper = document.createElement("div");
        const name = document.createElement("p");
        const play = document.createElement("button");
        const stop = document.createElement("button");
        const timer = document.createElement("p");
        const textArea = document.createElement("textarea");


        employee.id = "employee"
        dataWrapper.id = "data-wrapper";
        name.textContent = e.name;
        play.id = "play-btn";
        play.textContent = "▶️";
        stop.id = "stop-btn";
        stop.textContent = "⏹️";
        timer.id = "timer";
        timer.textContent = "00:00";
        textArea.id = "tArea";
        textArea.value = "";

        play.addEventListener("click", () => {
            startTimer(timer);
        })

        stop.addEventListener("click", () => {
            endTimer(timer);
        })

        dataWrapper.appendChild(name);
        dataWrapper.appendChild(play);
        dataWrapper.appendChild(stop);
        dataWrapper.appendChild(timer);
        employee.appendChild(dataWrapper);
        employee.appendChild(textArea);
        employeesList.appendChild(employee);

        employeeList.push({
            devId: e.id,
            durationMins: 0,
            notes: ""
        });

    });
}


const timersMap = new Map();
const timePassedMap = new Map();

function startTimer(timer) {
    if (timersMap.has(timer)) return;

    timersMap.forEach((intervalId, activeTimer) => {
        clearInterval(intervalId);
        timersMap.delete(activeTimer);
    });

    let seconds = timePassedMap.get(timer) || 0;

    const intervalId = setInterval(() => {
        seconds++;
        timePassedMap.set(timer, seconds);

        const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        timer.textContent = `${minutes}:${secs}`;
    }, 1000);

    timersMap.set(timer, intervalId);
}

function endTimer(timer) {
    const intervalId = timersMap.get(timer);
    if (intervalId) {
        clearInterval(intervalId);
        timersMap.delete(timer);
    }
}

function endMeeting() {
    timersMap.forEach((intervalId, timer) => {
        clearInterval(intervalId);
        timersMap.delete(timer);
    });

    let totalSeconds = 0;
    timePassedMap.forEach(seconds => {
        totalSeconds += seconds;
    });

    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    const totalFormatted = `${minutes}:${seconds}`;

    document.getElementById("meeting-timer").textContent = totalFormatted;

    saveData();

    window.location.href = "http://127.0.0.1:5500/dashboard/dashboard.html";

}

async function saveData() {
    const url = 'https://standupparo-apis.vercel.app/api/stand-up'; // Replace with actual API URL
    const apiKey = localStorage.getItem("key"); // Replace with your actual API key
    let totalTime = 0;

    const timerList = Array.from(document.querySelectorAll("#timer"));
    for(let i = 0; i < timerList.length; i++) {        
        splittedTimer = timerList[i].innerHTML.split(":");
        let time = Number(splittedTimer[1]) + Number(splittedTimer[0]) * 60;
        employeeList[i].durationMins = time;
        totalTime+=time;
    }

    const textareaList = Array.from(document.querySelectorAll("#tArea"));
    for(let i = 0; i < textareaList.length; i++) {
        employeeList[i].notes = textareaList[i].value;
    }

    const payload = {
        date: new Date(),
        durationMins: totalTime,
        standUpsInfo: employeeList
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Stand-up created:', data);
    } catch (error) {
        console.error('Error creating stand-up:', error.message);
    }
}
