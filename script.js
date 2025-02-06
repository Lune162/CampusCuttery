document.addEventListener("DOMContentLoaded", function () {
    const clientForm = document.getElementById("clientForm");
    const barberForm = document.getElementById("barberForm");

    // Handle Client Form Submission
    if (clientForm) {
        clientForm.addEventListener("submit", function (e) {
            e.preventDefault(); // Prevent default form submission
            const clientData = {
                email: document.getElementById("clientEmail").value,
                phone: document.getElementById("clientPhone").value,
                hairstyle: document.getElementById("hairstyle").value
            };

            localStorage.setItem("clientData", JSON.stringify(clientData));

            const selectedBarber = JSON.parse(localStorage.getItem("selectedBarber"));
            if (selectedBarber) {
                const appointmentRequest = {
                    clientEmail: clientData.email,
                    clientPhone: clientData.phone,
                    hairstyle: clientData.hairstyle,
                    barberEmail: selectedBarber.email,
                    time: "Selected Time Here" // Placeholder
                };

                const clientRequests = JSON.parse(localStorage.getItem("clientRequests")) || [];
                clientRequests.push(appointmentRequest);
                localStorage.setItem("clientRequests", JSON.stringify(clientRequests));

                alert("Appointment request sent to barber!");
            }
            alert("Client registered successfully!");
        });
    }

    // Handle Barber Form Submission (Now Stores Multiple Barbers)
    if (barberForm) {
        barberForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const barberData = {
                name: document.getElementById("barberName").value,
                email: document.getElementById("barberEmail").value,
                phone: document.getElementById("barberPhone").value,
                location: document.getElementById("location").value,
                school: document.getElementById("school").value,
                hairstyles: Array.from(document.getElementsByClassName("hairstyle-button"))
                    .filter(button => button.classList.contains("selected"))
                    .map(button => button.innerText),
                days: Array.from(document.querySelectorAll('input[name="days"]:checked')).map(day => day.value),
                timeslots: Array.from(document.querySelectorAll('.timeslot-container input'))
                    .map(input => input.value).filter(time => time)
            };

            let barbersBySchool = JSON.parse(localStorage.getItem("barbersBySchool")) || {};

            if (!barbersBySchool[barberData.school]) {
                barbersBySchool[barberData.school] = [];
            }

            barbersBySchool[barberData.school].push(barberData);
            localStorage.setItem("barbersBySchool", JSON.stringify(barbersBySchool));

            alert("Barber registered successfully!");
            window.location.href = "barber-dashboard.html";
        });
    }

    // Handle Displaying Barbers for Clients
    if (document.getElementById("clientSchool")) {
        document.getElementById("clientSchool").addEventListener("change", displayBarbers);
    }
});

// Function to Display Barbers When Client Selects a School
function displayBarbers() {
    const school = document.getElementById("clientSchool").value;
    const barberList = document.getElementById("barberList");
    barberList.innerHTML = "";

    if (!school) return;

    let barbersBySchool = JSON.parse(localStorage.getItem("barbersBySchool")) || {};
    let barbers = barbersBySchool[school] || [];

    console.log("Barbers for", school, barbers); // Debugging

    if (barbers.length === 0) {
        barberList.innerHTML = "<p>No barbers available for this school.</p>";
        return;
    }

    barbers.forEach(barber => {
        const button = document.createElement("button");
        button.classList.add("barber-button");
        button.innerHTML = `
            <strong>${barber.name}</strong><br>
            <span>${barber.location}</span><br>
            <span>Hairstyles: ${barber.hairstyles.length ? barber.hairstyles.join(", ") : "Not specified"}</span><br>
            <span>Available Days: ${barber.days ? barber.days.join(", ") : "Not specified"}</span><br>
            <span>Available Times: ${formatTimeSlots(barber.timeslots)}</span>
        `;
        button.onclick = () => selectBarber(barber, button);
        barberList.appendChild(button);
    });
}

// Helper Function to Format Time Slots
function formatTimeSlots(timeslots) {
    return timeslots && timeslots.length ? timeslots.filter(time => time).join(", ") : "Not specified";
}

// Function to Select a Barber
function selectBarber(barber, button) {
    document.querySelectorAll(".barber-button").forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
    localStorage.setItem("selectedBarber", JSON.stringify(barber));
    document.getElementById("submitAppointment").style.display = "block";
    alert(`You selected ${barber.name} for your appointment.`);
}
