document.addEventListener("DOMContentLoaded", function () {
    const clientForm = document.getElementById("clientForm");
    const barberForm = document.getElementById("barberForm");

    if (clientForm) {
        clientForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const clientData = {
                email: document.getElementById("clientEmail").value,
                phone: document.getElementById("clientPhone").value,
                address: document.getElementById("clientAddress").value,
                hairstyle: document.getElementById("clientHairstyle").value
            };
            localStorage.setItem("clientData", JSON.stringify(clientData));
            alert("Client registered successfully!");
            window.location.href = "appointment.html";
        });
    }

    if (barberForm) {
        barberForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const barberData = {
                email: document.getElementById("barberEmail").value,
                phone: document.getElementById("barberPhone").value,
                location: document.getElementById("barberLocation").value,
                styles: Array.from(document.getElementById("barberStyles").selectedOptions).map(opt => opt.value),
                availability: document.getElementById("barberAvailability").value
            };
            localStorage.setItem("barberData", JSON.stringify(barberData));
            alert("Barber registered successfully!");
            window.location.href = "barber-dashboard.html";
        });
    }
});

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
    });
}

document.addEventListener("DOMContentLoaded", async function () {
    if (document.getElementById("payment-form")) {
        const stripe = Stripe("YOUR_PUBLISHABLE_KEY");
        const elements = stripe.elements();
        const card = elements.create("card");
        card.mount("#card-element");

        const form = document.getElementById("payment-form");
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const { paymentMethod, error } = await stripe.createPaymentMethod({
                type: "card",
                card: card,
                billing_details: { name: document.getElementById("name").value }
            });

            if (error) {
                alert(error.message);
            } else {
                processPayment(paymentMethod.id);
            }
        });
    }
}
