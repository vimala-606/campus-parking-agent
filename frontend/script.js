const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function addMessage(sender, message) {

    const messageDiv = document.createElement("div");

    messageDiv.style.maxWidth = "70%";
    messageDiv.style.padding = "12px 16px";
    messageDiv.style.margin = "10px";
    messageDiv.style.borderRadius = "15px";
    messageDiv.style.wordWrap = "break-word";
    messageDiv.style.fontSize = "15px";
    messageDiv.style.lineHeight = "1.5";

    if (sender === "You") {

        messageDiv.style.backgroundColor = "#1565C0";
        messageDiv.style.color = "white";
        messageDiv.style.marginLeft = "auto";
        messageDiv.style.textAlign = "left";

    } else {

        messageDiv.style.backgroundColor = "#E3F2FD";
        messageDiv.style.color = "#222";
        messageDiv.style.marginRight = "auto";
        messageDiv.style.textAlign = "left";

    }

    messageDiv.innerHTML =
        `<strong>${sender}</strong><br>${String(message).replace(/\n/g, "<br>")}`;

    chatBox.appendChild(messageDiv);

    chatBox.scrollTop = chatBox.scrollHeight;
}
async function callAPI(url, options = {}) {

    try {

        const response = await fetch(url, options);

        return await response.json();

    } catch (error) {

        console.error(error);

        addMessage("Agent", "Unable to connect to the backend.");

        return null;
    }
}

sendBtn.addEventListener("click", async (event) => {

    event.preventDefault();

    const message = userInput.value.trim();

    if (message === "") return;

    const msg = message.toLowerCase();

    addMessage("You", message);

    userInput.value = "";

    // Count Available Slots
    if (msg.includes("count") || msg.includes("how many")) {

        const data = await callAPI("http://127.0.0.1:8000/slot-count");

        if (data)
            addMessage("Agent", data.count);

        return;
    }

    // Available Slots
    if (msg.includes("available")) {

        const data = await callAPI("http://127.0.0.1:8000/available-slots");

        if (data)
            addMessage("Agent", data.slots);

        return;
    }

    // Occupied Slots
    if (msg.includes("occupied")) {

        const data = await callAPI("http://127.0.0.1:8000/occupied-slots");

        if (data)
            addMessage("Agent", data.slots);

        return;
    }

    // Slot Status
    if (msg.includes("status")) {

        const slot = message.split(" ").pop().toUpperCase();

        const data = await callAPI(
            `http://127.0.0.1:8000/slot-status/${slot}`
        );

        if (data)
            addMessage("Agent", data.status);

        return;
    }

    // Slot Location
    if (msg.includes("where") || msg.includes("location")) {

        const slot = message.split(" ").pop().toUpperCase();

        const data = await callAPI(
            `http://127.0.0.1:8000/slot-location/${slot}`
        );

        if (data)
            addMessage("Agent", data.location);

        return;
    }

    // Reserve Slot
    if (msg.includes("reserve")) {

        const slot = message.split(" ").pop().toUpperCase();

        const data = await callAPI(
            "http://127.0.0.1:8000/reserve-slot",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    slot_name: slot
                })
            }
        );

        if (data)
            addMessage("Agent", data.message);

        return;
    }

    // Cancel Reservation
    if (msg.includes("cancel")) {

        const slot = message.split(" ").pop().toUpperCase();

        const data = await callAPI(
            "http://127.0.0.1:8000/cancel-slot",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    slot_name: slot
                })
            }
        );

        if (data)
            addMessage("Agent", data.message);

        return;
    }
// Parking Timings
if (msg.includes("timing") || msg.includes("hours")) {

    const data = await callAPI("http://127.0.0.1:8000/parking-timings");

    if (data)
        addMessage("Agent", data.timings);

    return;
}
// Parking Rules
if (msg.includes("rule") || msg.includes("guideline")) {

    const data = await callAPI("http://127.0.0.1:8000/parking-rules");

    if (data)
        addMessage("Agent", data.rules);

    return;
}

    addMessage(
        "Agent",
        "I can help you with:\n\n" +
        "• Show available slots\n" +
        "• Show occupied slots\n" +
        "• How many slots are available?\n" +
        "• Status of B1\n" +
        "• Where is B1?\n" +
        "• Reserve B1\n" +
        "• Cancel B1"
    );

});

userInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {

        sendBtn.click();

    }

});
async function loadDashboard() {

    const available = await callAPI("http://127.0.0.1:8000/slot-count");

    if (available) {

        document.getElementById("available-count").innerText =
            available.count.match(/\d+/)[0];

    }

}
loadDashboard();