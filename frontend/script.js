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
    } else {
        messageDiv.style.backgroundColor = "#E3F2FD";
        messageDiv.style.color = "#222";
        messageDiv.style.marginRight = "auto";
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

sendBtn.addEventListener("click", async function (event) {
    console.log("Button clicked");

    event.preventDefault();

    const message = userInput.value.trim();

    if (message === "") return;

    const msg = message.toLowerCase();

    addMessage("You", message);
    console.log(chatBox.innerHTML);

    userInput.value = "";

    // Count Available Slots
    if (msg.includes("count") || msg.includes("how many")) {

        const data = await callAPI("http://127.0.0.1:8000/slot-count");

        if (data)
            addMessage("Agent", data.count);

        loadDashboard();
        return;
    }

    // Available Slots
    if (msg.includes("available")) {

        const data = await callAPI("http://127.0.0.1:8000/available-slots");

        if (data)
            addMessage("Agent", data.slots);

        loadDashboard();
        return;
    }

    // Occupied Slots
    if (msg.includes("occupied")) {

        const data = await callAPI("http://127.0.0.1:8000/occupied-slots");

        if (data)
            addMessage("Agent", data.slots);
        console.log(chatBox.innerHTML);

        loadDashboard();
        return;
    }

    // Reserved Slots
    if (msg.includes("reserved slots")) {

        const data = await callAPI("http://127.0.0.1:8000/reserved-slots");

        if (data)
            addMessage("Agent", data.slots);

        loadDashboard();
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

        loadDashboard();
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

    console.log(data);

    if (data) {
        addMessage("Agent", data.message);
        await loadDashboard();
    }

    return;
}

    // Parking Timings
    if (msg.includes("timing") || msg.includes("hours")) {

        const data = await callAPI(
            "http://127.0.0.1:8000/parking-timings"
        );

        if (data)
            addMessage("Agent", data.timings);

        return;
    }

    // Parking Rules
    if (msg.includes("rule") || msg.includes("guideline")) {

        const data = await callAPI(
            "http://127.0.0.1:8000/parking-rules"
        );

        if (data)
            addMessage("Agent", data.rules);

        return;
    }

    addMessage(
        "Agent",
        "I can help you with:<br><br>" +
        "• Show available slots<br>" +
        "• Show occupied slots<br>" +
        "• Show reserved slots<br>" +
        "• How many slots are available?<br>" +
        "• Status of A1<br>" +
        "• Where is A1?<br>" +
        "• Reserve B1<br>" +
        "• Cancel B1<br>" +
        "• Parking timings<br>" +
        "• Parking rules"
    );

});

userInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {
        sendBtn.click();
    }

});

async function loadDashboard() {

    const data = await callAPI("https://campus-parking-agent-1.onrender.com/run");

    if (!data) return;

    const availableMatch = String(data.available).match(/\d+/);

    document.getElementById("available-count").innerText =
        availableMatch ? availableMatch[0] : "0";

    document.getElementById("occupied-count").innerText =
        data.occupied;

    document.getElementById("reserved-count").innerText =
        data.reserved;
}

loadDashboard();