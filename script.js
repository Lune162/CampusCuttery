document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("availabilityList")) {
        displayAvailability();
    }
});

function getLoggedInBarber() {
    let barbers = JSON.parse(localStorage.getItem("barbers")) || [];
    let loggedInEmail = localStorage.getItem("loggedInBarber");
    return barbers.find(barber => barber.email === loggedInEmail);
}

function setAvailability() {
    let day = document.getElementById("availableDay").value;
    let startTime = document.getElementById("startTime").value;
    let endTime = document.getElementById("endTime").value;

    if (!startTime || !endTime) {
        alert("Please select a valid time range.");
        return;
    }

    let barbers = JSON.parse(localStorage.getItem("barbers")) || [];
    let loggedInEmail = localStorage.getItem("loggedInBarber");
    let barberIndex = barbers.findIndex(barber => barber.email === loggedInEmail);

    if (barberIndex === -1) {
        alert("Error: Barber not found.");
        return;
    }

    // Ensure the availability list exists
    if (!barbers[barberIndex].availability) {
        barbers[barberIndex].availability = [];
    }

    // Check if the day already exists, update instead of adding duplicate entries
    let existingIndex = barbers[barberIndex].availability.findIndex(slot => slot.day === day);
    if (existingIndex !== -1) {
        barbers[barberIndex].availability[existingIndex] = { day, startTime, endTime };
    } else {
        barbers[barberIndex].availability.push({ day, startTime, endTime });
    }

    localStorage.setItem("barbers", JSON.stringify(barbers));

    alert("Availability set!");
    displayAvailability();
}

function displayAvailability() {
    let loggedInBarber = getLoggedInBarber();
    if (!loggedInBarber) return;

    let list = document.getElementById("availabilityList");
    list.innerHTML = "";

    loggedInBarber.availability.forEach((slot, index) => {
        let li = document.createElement("li");
        li.innerText = `${slot.day}: ${slot.startTime} - ${slot.endTime}`;

        // Remove button for each availability slot
        let removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.onclick = () => removeAvailability(index);

        li.appendChild(removeBtn);
        list.appendChild(li);
    });
}

function removeAvailability(index) {
    let barbers = JSON.parse(localStorage.getItem("barbers")) || [];
    let loggedInEmail = localStorage.getItem("loggedInBarber");
    let barberIndex = barbers.findIndex(barber => barber.email === loggedInEmail);

    if (barberIndex === -1) return;

    barbers[barberIndex].availability.splice(index, 1);
    localStorage.setItem("barbers", JSON.stringify(barbers));

    displayAvailability();
}
