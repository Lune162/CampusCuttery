document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("signupForm")) {
        document.getElementById("signupForm").addEventListener("submit", function(event) {
            event.preventDefault();
            let name = document.getElementById("name").value;
            let email = document.getElementById("email").value;
            let password = document.getElementById("password").value;
            
            let barbers = JSON.parse(localStorage.getItem("barbers")) || [];
            barbers.push({ name, email, password, availability: [] });
            localStorage.setItem("barbers", JSON.stringify(barbers));
            
            alert("Signup successful!");
            window.location.href = "dashboard.html";
        });
    }
});

function setAvailability() {
    let date = document.getElementById("availableDate").value;
    let time = document.getElementById("availableTime").value;
    
    let barbers = JSON.parse(localStorage.getItem("barbers")) || [];
    let barber = barbers[0]; // Simulating a logged-in barber
    barber.availability.push({ date, time });
    localStorage.setItem("barbers", JSON.stringify(barbers));

    alert("Availability set!");
    displayAvailability();
}

function displayAvailability() {
    let barbers = JSON.parse(localStorage.getItem("barbers")) || [];
    let barber = barbers[0];
    let list = document.getElementById("availabilityList");
    
    list.innerHTML = "";
    barber.availability.forEach(slot => {
        let li = document.createElement("li");
        li.innerText = `${slot.date} at ${slot.time}`;
        list.appendChild(li);
    });
}

function bookHaircut() {
    alert("Haircut booked! You can leave a review after the appointment.");
    document.getElementById("rateBtn").disabled = false;
}

function leaveReview() {
    alert("Review submitted! Thank you for your feedback.");
    document.getElementById("rateBtn").disabled = true;
}
