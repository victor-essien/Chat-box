const btn = document.getElementById("btn");

async function handleSubmitMessage(message) {
  if (!message) {
    return alert("Please enter your question");
  }

  addUserMessageToCont(message);
  //  let inputText = document.getElementById('input').value
  //

  let res = await fetch("/api/openai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();

  return data;
}

function addUserMessageToCont(message) {
  const userMessage = document.createElement("div");
  const parentDiv = document.getElementById("chat-area");
  userMessage.classList.add(
    "bg-indigo-500",
    "text-white",
    "rounded",
    "p-2",
    "w-fit",
    "self-end",
    "break-words",
    "overflow-auto"
  );
  userMessage.innerText = message;
  parentDiv.appendChild(userMessage);
  document.getElementById("input").value = "";
  addLoadingIndicatorToDialogueBox();
}
// add the loading indicator to the dialogue box
function addLoadingIndicatorToDialogueBox() {
  const parentDiv = document.getElementById("chat-area");
  // create a new li element
  const loadingIndicator = document.createElement("div");

  // set the id of the loading indicator
  loadingIndicator.id = "loading-indicator";

  // add loading indicator styling
  loadingIndicator.classList.add(
    "bg-gray-500",
    "text-white",
    "rounded",
    "p-1",
    "w-fit",
    "self-start",
    "w-12"
  );

  // create a new image element
  const loadingImage = document.createElement("img");

  // set the image source
  loadingImage.src = "loading.svg";

  // add loading indicator image as a child to li element
  loadingIndicator.appendChild(loadingImage);

  // add the li element to the DOM
  parentDiv.appendChild(loadingIndicator);
}

// remove the loading indicator from the dialogue box
function removeLoadingIndicatorFromDialogueBox() {
  // get the loading indicator element
  const loadingIndicator = document.getElementById("loading-indicator");

  // remove the loading indicator from the DOM
  loadingIndicator.remove();
}

function addBotMessageToCont(response) {
  removeLoadingIndicatorFromDialogueBox();
  const botMessage = document.createElement("div");
  const parentDiv = document.getElementById("chat-area");
  if (response.status === "error") {
    // add error styling
    botMessage.classList.add(
      "bg-red-500",
      "text-white",
      "rounded",
      "p-2",
      "w-fit",
      "self-start"
    );

    // add error text
    botMessage.innerText =
      "Oh no! Something went wrong. Please try again later.";
  } else {
    botMessage.classList.add(
      "bg-gray-500",
      "text-white",
      "rounded",
      "p-2",
      "w-fit",
      "self-start"
    );
    botMessage.innerText = response.data.trim();
    parentDiv.appendChild(botMessage);
    document.getElementById("input").value = "";
  }
}

window.onload = () =>
  document.getElementById("btn").addEventListener("click", (e) => {
    // prevent the form from refreshing the page

    // get the value of the input
    const message = document.getElementById("input").value;

    // call the function that handles the fetch request to our backend
    handleSubmitMessage(message).then((data) => {
      // add the chatbot's response to the DOM when the fetch request is complete
      addBotMessageToCont(data);
    });
  });
