document.addEventListener("DOMContentLoaded", () => {
    // Handle signup form submission
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent default form submission behavior

            let name = document.getElementById("name").value;
            let email = document.getElementById("email").value;
            let password = document.getElementById("password").value;

            // Debugging: Log the form data
            console.log("Name:", name);
            console.log("Email:", email);
            console.log("Password:", password);

            // Validate form data
            if (!name || !email || !password) {
                alert("Please fill in all fields!");
                return;
            }

            // Save the barber details into localStorage
            let barbers = JSON.parse(localStorage.getItem("barbers")) || [];
            barbers.push({ name, email, password, availability: [] });
            localStorage.setItem("barbers", JSON.stringify(barbers));

            // Optionally store the email to simulate login
            localStorage.setItem("loggedInBarber", email);

            alert("Signup successful!");

            // Debugging: Check localStorage for saved barbers
            console.log("Updated Barbers:", JSON.parse(localStorage.getItem("barbers")));

            window.location.href = "dashboard.html"; // Redirect to dashboard after signup
        });
    }

    // Display availability after page load
    displayAvailability();
});

// Get logged-in barber from localStorage
function getLoggedInBarber() {
    let barbers = JSON.parse(localStorage.getItem("barbers")) || [];
    let loggedInEmail = localStorage.getItem("loggedInBarber");
    return barbers.find(barber => barber.email === loggedInEmail);
}

// Dynamically create time inputs for selected days
function updateTimeInputs() {
    let checkboxes = document.querySelectorAll("#dayChecklist input[type='checkbox']:checked");
    let timeInputsDiv = document.getElementById("timeInputs");
    timeInputsDiv.innerHTML = ""; // Clear previous inputs

    checkboxes.forEach(checkbox => {
        let day = checkbox.value;
        let div = document.createElement("div");
        div.innerHTML = `
            <label>${day}: </label>
            <input type="time" id="start-${day}" placeholder="Start Time">
            <input type="time" id="end-${day}" placeholder="End Time">
        `;
        timeInputsDiv.appendChild(div);
    });
}

// Save availability for selected days
function setAvailability() {
    let checkboxes = document.querySelectorAll("#dayChecklist input[type='checkbox']:checked");
    let barbers = JSON.parse(localStorage.getItem("barbers")) || [];
    let loggedInEmail = localStorage.getItem("loggedInBarber");
    let barberIndex = barbers.findIndex(barber => barber.email === loggedInEmail);

    if (barberIndex === -1) {
        alert("Error: Barber not found.");
        return;
    }

    if (!barbers[barberIndex].availability) {
        barbers[barberIndex].availability = [];
    }

    checkboxes.forEach(checkbox => {
        let day = checkbox.value;
        let startTime = document.getElementById(`start-${day}`).value;
        let endTime = document.getElementById(`end-${day}`).value;

        if (!startTime || !endTime) {
            alert(`Please set a valid time range for ${day}.`);
            return;
        }

        // Log for debugging
        console.log(`Setting availability for ${day}: ${startTime} - ${endTime}`);

        // Check if the day already exists, update instead of adding duplicate entries
        let existingIndex = barbers[barberIndex].availability.findIndex(slot => slot.day === day);
        if (existingIndex !== -1) {
            barbers[barberIndex].availability[existingIndex] = { day, startTime, endTime };
        } else {
            barbers[barberIndex].availability.push({ day, startTime, endTime });
        }
    });

    localStorage.setItem("barbers", JSON.stringify(barbers));

    alert("Availability set!");
    displayAvailability();
}

// Display availability on the page
function displayAvailability() {
    let loggedInBarber = getLoggedInBarber();
    if (!loggedInBarber) return;

    let list = document.getElementById("availabilityList");
    list.innerHTML = "";

    loggedInBarber.availability.forEach((slot, index) => {
        let li = document.createElement("li");
        li.innerText = `${slot.day}: ${slot.startTime} - ${slot.endTime}`;

        let removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.onclick = () => removeAvailability(index);

        li.appendChild(removeBtn);
        list.appendChild(li);
    });
}

// Remove availability
function removeAvailability(index) {
    let barbers = JSON.parse(localStorage.getItem("barbers")) || [];
    let loggedInEmail = localStorage.getItem("loggedInBarber");
    let barberIndex = barbers.findIndex(barber => barber.email === loggedInEmail);

    if (barberIndex === -1) return;

    barbers[barberIndex].availability.splice(index, 1);
    localStorage.setItem("barbers", JSON.stringify(barbers));

    displayAvailability();
}
