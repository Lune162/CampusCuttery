<!-- Your HTML code -->
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

  // Initialize Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyB9TYVDPd5yiEMgeyzYZuW04qXAlMD-C4k",
    authDomain: "campus-cuttery.firebaseapp.com",
    projectId: "campus-cuttery",
    storageBucket: "campus-cuttery.firebasestorage.app",
    messagingSenderId: "505873129716",
    appId: "1:505873129716:web:5b2f41d92058137f0dbea1",
    measurementId: "G-91K4SBTWQX"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
</script>


// Handle Client Sign-Up
document.addEventListener("DOMContentLoaded", function () {
    const clientForm = document.getElementById("clientForm");
    const barberForm = document.getElementById("barberForm");

    if (clientForm) {
        clientForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const email = document.getElementById("clientEmail").value;
            const password = "defaultPass123";  // Can be changed later
            const clientData = {
                name: document.getElementById("clientName").value,
                email: email,
                phone: document.getElementById("clientPhone").value,
                hairstyle: document.getElementById("hairstyle").value
            };

            // Create user in Firebase Auth
            auth.createUserWithEmailAndPassword(email, password)
                .then(userCredential => {
                    const user = userCredential.user;
                    return db.collection("clients").doc(user.uid).set(clientData);
                })
                .then(() => {
                    alert("Client registered successfully!");
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert(error.message);
                });
        });
    }

    // Handle Barber Sign-Up
    if (barberForm) {
        barberForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const email = document.getElementById("barberEmail").value;
            const password = "defaultPass123"; 
            const barberData = {
                name: document.getElementById("barberName").value,
                email: email,
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

            // Create barber in Firebase Auth
            auth.createUserWithEmailAndPassword(email, password)
                .then(userCredential => {
                    const user = userCredential.user;
                    return db.collection("barbers").doc(user.uid).set(barberData);
                })
                .then(() => {
                    alert("Barber registered successfully!");
                    window.location.href = "barber-dashboard.html";
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert(error.message);
                });
        });
    }

    // Handle Displaying Barbers for Clients
    if (document.getElementById("clientSchool")) {
        document.getElementById("clientSchool").addEventListener("change", displayBarbers);
        document.getElementById("hairstyle").addEventListener("change", displayBarbers);
    }
});

// Function to Display Barbers When Client Selects a School
function displayBarbers() {
    const school = document.getElementById("clientSchool").value;
    const selectedHairstyle = document.getElementById("hairstyle").value;
    const barberList = document.getElementById("barberList");
    barberList.innerHTML = "";

    if (!school) return;

    // Retrieve barbers from Firestore
    db.collection("barbers").where("school", "==", school).get().then(snapshot => {
        let barbers = snapshot.docs.map(doc => doc.data());

        if (selectedHairstyle) {
            barbers = barbers.filter(barber => barber.hairstyles.includes(selectedHairstyle));
        }

        if (barbers.length === 0) {
            barberList.innerHTML = "<p>No barbers available for this school and hairstyle.</p>";
            return;
        }

        barbers.forEach(barber => {
            const button = document.createElement("button");
            button.classList.add("barber-button");
            button.innerHTML = `
                <strong>${barber.name}</strong><br>
                <span>Address: ${barber.location}</span><br>
                <span>Hairstyles: ${barber.hairstyles.join(", ")}</span><br>
                <span>Available Days: ${barber.days.join(", ")}</span><br>
                <span>Available Times: ${formatTimeSlots(barber.timeslots)}</span>
            `;
            button.onclick = () => selectBarber(barber, button);
            barberList.appendChild(button);
        });
    }).catch(error => {
        console.error("Error getting barbers: ", error);
    });
}

// Helper Function to Format Time Slots
function formatTimeSlots(timeslots) {
    return timeslots.length ? timeslots.join(", ") : "Not specified";
}

// Function to Select a Barber
function selectBarber(barber, button) {
    document.querySelectorAll(".barber-button").forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
    localStorage.setItem("selectedBarber", JSON.stringify(barber));
    document.getElementById("submitAppointment").style.display = "block";
    alert(`You selected ${barber.name} for your appointment.`);
}

// Handle Appointment Booking
function bookAppointment(clientId, barberId, appointmentData) {
    db.collection("appointments").add({
        clientId,
        barberId,
        ...appointmentData,
        status: "pending",
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert("Appointment request sent!");
    }).catch(error => {
        console.error("Error booking appointment: ", error);
    });
}

// Handle Real-Time Updates for Barbers
function listenForAppointments(barberId) {
    db.collection("appointments").where("barberId", "==", barberId)
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === "added") {
                    console.log("New appointment:", change.doc.data());
                }
            });
        });
}
