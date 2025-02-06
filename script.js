document.addEventListener("DOMContentLoaded", function () {
    const clientForm = document.getElementById("clientForm");
    const barberForm = document.getElementById("barberForm");

    // Handle Client Form Submission
    if (clientForm) {
        clientForm.addEventListener("submit", function (e) {
            e.preventDefault(); // Prevent the default form submission
            const clientData = {
                email: document.getElementById("clientEmail").value,
                phone: document.getElementById("clientPhone").value,
                address: document.getElementById("clientAddress").value,
                hairstyle: document.getElementById("clientHairstyle").value
            };

            // Save client data to localStorage
            localStorage.setItem("clientData", JSON.stringify(clientData));

            alert("Client registered successfully!");

            // Optionally, redirect after successful form submission (uncomment below line to enable redirection)
            // window.location.href = "appointment.html";
        });
    }

    // Handle Barber Form Submission
    if (barberForm) {
        barberForm.addEventListener("submit", function (e) {
            e.preventDefault(); // Prevent the default form submission
            const barberData = {
                email: document.getElementById("barberEmail").value,
                phone: document.getElementById("barberPhone").value,
                location: document.getElementById("barberLocation").value,
                styles: Array.from(document.getElementById("barberStyles").selectedOptions).map(opt => opt.value),
                availability: document.getElementById("barberAvailability").value
            };

            // Save barber data to localStorage
            localStorage.setItem("barberData", JSON.stringify(barberData));

            alert("Barber registered successfully!");

            // Optionally, redirect after successful form submission (uncomment below line to enable redirection)
            // window.location.href = "barber-dashboard.html";
        });
    }
});

// Handle Stripe Payment
function processPayment(paymentMethodId) {
    fetch("/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethodId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Payment successful!");
        } else {
            alert("Payment failed. Please try again.");
        }
    }).catch(error => {
        alert("Error processing payment. Please try again.");
    });
}

// Handle Stripe Elements (Card Input)
document.addEventListener("DOMContentLoaded", async function () {
    if (document.getElementById("payment-form")) {
        const stripe = Stripe("YOUR_PUBLISHABLE_KEY"); // Replace with your Stripe public key
        const elements = stripe.elements();
        const card = elements.create("card");

        // Mount the card element
        card.mount("#card-element");

        const form = document.getElementById("payment-form");

        // Handle form submission
        form.addEventListener("submit", async (event) => {
            event.preventDefault(); // Prevent default form submission

            const { paymentMethod, error } = await stripe.createPaymentMethod({
                type: "card",
                card: card,
                billing_details: { name: document.getElementById("name").value }
            });

            if (error) {
                alert(error.message); // Show error message if any
            } else {
                processPayment(paymentMethod.id); // Call process payment function
            }
        });
    }
});
