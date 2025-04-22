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

function populateList(data) {
    const employeesList = document.getElementById("employees-wrapper");
    employeesList.innerHTML = ""; 

    data.forEach(e => {
        const employee = document.createElement("div");
        const id = document.createElement("p");
        const email = document.createElement("p");
        const name = document.createElement("p");
        const play = document.createElement("button");
        const stop = document.createElement("button");
        const timer = document.createElement("p");


        id.textContent = `ID: ${e.id}`;
        email.textContent = `Email: ${e.email}`;
        name.textContent = `Name: ${e.name}`;
        play.id = "play-btn";
        play.textContent = "▶️";
        stop.id = "stop-btn";
        stop.textContent = "⏹️";
        timer.id = "timer";
        timer.textContent = "00:00";

        play.addEventListener("click", () => {
            startTimer(timer);
        })

        stop.addEventListener("click", () => {
            endTimer(timer);
        })

        employee.appendChild(id);
        employee.appendChild(email);
        employee.appendChild(name);
        employee.appendChild(play);
        employee.appendChild(stop);
        employee.appendChild(timer);
        employeesList.appendChild(employee);
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
}