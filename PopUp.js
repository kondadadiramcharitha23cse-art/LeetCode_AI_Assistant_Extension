const chatDiv = document.getElementById("chat");

document.getElementById("sendBtn")
.addEventListener("click", async () => {

    const userInput =
    document.getElementById("userInput").value;

    addMessage("You", userInput);

    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    chrome.tabs.sendMessage(
        tab.id,
        { action: "getProblem" },

        async (response) => {

            if(!response){

                addMessage(
                    "AI",
                    "Could not read LeetCode page."
                );

                return;
            }

            const problem = response.text;

            try {

                const apiKey =
                "My_API_key";

                const res = await fetch(
                "https://openrouter.ai/api/v1/chat/completions",
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                        `Bearer ${apiKey}`,

                        "Content-Type":
                        "application/json"
                    },

                    body: JSON.stringify({

                        model:
                        "openai/gpt-3.5-turbo",

                        messages: [

                            {
                                role: "system",

                                content:
                                "You are a DSA mentor. Give hints only. Never provide full code."
                            },

                            {
                                role: "user",

                                content:
`Problem:
${problem}

Question:
${userInput}`
                            }
                        ]
                    })
                });

                const data = await res.json();

                console.log(data);

                if(data.choices){

                    const aiReply =
                    data.choices[0]
                    .message.content;

                    addMessage(
                        "AI",
                        aiReply
                    );

                } else {

                    addMessage(
                        "AI",
                        JSON.stringify(data)
                    );
                }

            } catch(error){

                console.log(error);

                addMessage(
                    "AI",
                    "Something went wrong."
                );
            }
        }
    );
});

function addMessage(sender, text){

    const div =
    document.createElement("div");

    div.classList.add("message");

    div.innerHTML =
    `<p><b>${sender}:</b> ${text}</p>`;

    chatDiv.appendChild(div);
}
