const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send_btn");
const themeButton = document.querySelector("#theme_btn");
const deleteButton = document.querySelector("#delete_btn");
const chatContainer = document.querySelector(".chat-container");

let userText = null;
const API_KEY = "AIzaSyCJILl6Um6C9Jkz68NjMBO3FCHAuJvILxQ";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const intialHeight = chatInput.scrollHeight;

const loadDataFromLocalStorage = () => {
    const themeColor = localStorage.getItem("theme-color");

    const defaultText = `<div class="default-text">
            <h1>ChatPulse</h1>
            <h3>Hello Dear, How may I help you Today!</h3>
            <p>Start conversation and Explore power of AI <br>And your Chat History will displayed here.</p>
        </div>`;

    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

loadDataFromLocalStorage();

const createElement = (html, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv;
}

// const processResponseText = (text) => {
//     // Step 1: Remove any empty or improperly placed <b> tags
//     text = text.replace(/<b>\s*<\/b>/g, ""); // Remove empty bold tags

//     // Step 2: Replace text between stars (*) with bold tags
//     text = text.replace(/\*([^\*]+)\*/g, "<b>$1</b>"); // Properly format bold text

//     // Step 3: Clean up excess spaces or line breaks around bold tags
//     text = text.replace(/\s*<\/b>\s*/g, "</b> "); // Add a single space after closing bold tags
//     text = text.replace(/\s*<b>\s*/g, " <b>"); // Add a single space before opening bold tags

//     // Step 4: Remove trailing or leading spaces in the final text
//     text = text.trim();

//     return text;
// };

const getChatResponse = async (incomingChatDiv) => {
    const pElement = document.createElement("p");
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "applications/json" },
            body: JSON.stringify({
                contents: [{
                    role : "user",
                    parts: [{ text: userText }]
                }]
            })
        });

    const data = await response.json();
    let apiResponse = data?.candidates[0].content.parts[0].text;

    // pElement.textContent = processResponseText(apiResponse);
    pElement.textContent = apiResponse;

    } catch (error) {
        // console.log(error);
        pElement.classList.add("error");
        pElement.textContent = "Oops! There is an error in retriving the data. Please try again.";
    }

    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    localStorage.setItem("all-chats", chatContainer.innerHTML);
}

const copyResponse = (copyBtn) =>{
    const responseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(responseTextElement.textContent);
    copyBtn.textContent = "done";
    setTimeout(() => copyBtn.textContent = "content_copy", 1000);
}

const showTypingAnimation = () => {
    const html = `<div class="chat-content">
                <div class="chat-details">
                    <img src="images/chatgpt.svg" alt="chatGPT image">
                    <div class="typing-animation">
                        <div class="typing-dot" style="--delay : 0.2s"></div>
                        <div class="typing-dot" style="--delay : 0.4s"></div>
                        <div class="typing-dot" style="--delay : 0.6s"></div>
                    </div>
                </div>
                <span onclick="copyResponse(this)" id="copy_btn" class="material-symbols-rounded">content_copy</span>
            </div>`;
    const incomingChatDiv = createElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim();
    // console.log(userText);
    if(!userText) return;

    chatInput.value = "";
    chatInput.style.height = `${intialHeight}px`;

    const html = `<div class="chat-content">
                <div class="chat-details">
                <img src="images/user.svg" alt="user image">
                <p>${userText}</p>
                </div>
            </div>`;
    const outgoingChatDiv = createElement(html, "outgoing");
    outgoingChatDiv.querySelector("p").textContent = userText;
    document.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
}

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme-color", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

deleteButton.addEventListener("click", () => {
    if(confirm("Are you sure, you want to delete all chats")) {
        localStorage.removeItem("all-chats");
        loadDataFromLocalStorage();
    }
});

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${intialHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
    }
});

sendButton.addEventListener("click", handleOutgoingChat);

// Attach an event listener to the input field
// chatInput.addEventListener("keypress", (event) => {
//     if (event.key === "Enter") { 
//         // Check if the pressed key is Enter
//         event.preventDefault(); // Prevent default form submission behavior (if any)
//         handleOutgoingChat(); // Call the send function
//     }
// });