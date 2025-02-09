// script.js
const supabase = window.supabase.createClient("https://ocjkzxaaqbsmmcveuxxn.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jamt6eGFhcWJzbW1jdmV1eHhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMjgzNTEsImV4cCI6MjA1NDcwNDM1MX0.Ha8jMv6pewZAka5NV4N8Tj6olp6LlsqYpJvcgUQW_1w");
console.log(supabase);

document.addEventListener("DOMContentLoaded", function () {
  const clientForm = document.getElementById("clientForm");
  const barberForm = document.getElementById("barberForm");

  if (clientForm) {
    clientForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const email = document.getElementById("clientEmail").value;
      const clientData = {
        name: document.getElementById("clientName").value,
        email: email,
        phone: document.getElementById("clientPhone").value,
        hairstyle: document.getElementById("hairstyle").value
      };

      const { data, error } = await supabase.from("clients").insert([clientData]);
      if (error) {
        console.error("Error:", error);
        alert(error.message);
      } else {
        alert("Client registered successfully!");
      }
    });
  }

  if (barberForm) {
    barberForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const email = document.getElementById("barberEmail").value;
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

      const { data, error } = await supabase.from("barbers").insert([barberData]);
      if (error) {
        console.error("Error:", error);
        alert(error.message);
      } else {
        alert("Barber registered successfully!");
        window.location.href = "barber-dashboard.html";
      }
    });
  }

  if (document.getElementById("clientSchool")) {
    document.getElementById("clientSchool").addEventListener("change", displayBarbers);
    document.getElementById("hairstyle").addEventListener("change", displayBarbers);
  }
});

async function displayBarbers() {
  const school = document.getElementById("clientSchool").value;
  const selectedHairstyle = document.getElementById("hairstyle").value;
  const barberList = document.getElementById("barberList");
  barberList.innerHTML = "";

  if (!school) return;

  const { data: barbers, error } = await supabase
    .from("barbers")
    .select("*")
    .eq("school", school);

  if (error) {
    console.error("Error getting barbers:", error);
    return;
  }

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
}

function formatTimeSlots(timeslots) {
  return timeslots.length ? timeslots.join(", ") : "Not specified";
}

function selectBarber(barber, button) {
  document.querySelectorAll(".barber-button").forEach(btn => btn.classList.remove("selected"));
  button.classList.add("selected");
  localStorage.setItem("selectedBarber", JSON.stringify(barber));
  document.getElementById("submitAppointment").style.display = "block";
  alert(`You selected ${barber.name} for your appointment.`);
}

async function bookAppointment(clientId, barberId, appointmentData) {
  const { data, error } = await supabase.from("appointments").insert([{
    clientId,
    barberId,
    ...appointmentData,
    status: "pending",
    timestamp: new Date().toISOString()
  }]);

  if (error) {
    console.error("Error booking appointment:", error);
  } else {
    alert("Appointment request sent!");
  }
}

async function listenForAppointments(barberId) {
  supabase
    .from("appointments")
    .on("INSERT", payload => {
      console.log("New appointment:", payload.new);
    })
    .subscribe();
}
