(function() {
  // Inject Chat UI
  const chatHtml = `
  <div class="chat draggable" id="chat">
    <div class="chat-title">
      <h1>Roboi</h1>
      <h2>Your YouTube Assistant</h2>
      <figure class="avatar">
        <img src="https://img.freepik.com/free-photo/3d-delivery-robot-working_23-2151150169.jpg" alt="Avatar">
      </figure>
      <button class="chat-close" id="chat-close">&times;</button>
    </div>
    <div class="messages">
      <div class="messages-content" id="messages-content"></div>
    </div>
    <div class="message-box">
      <textarea type="text" class="message-input" id="message-input" placeholder="Type message..."></textarea>
      <button type="submit" class="message-submit" id="message-submit">Send</button>
    </div>
  </div>
  `;
  const chatContainer = document.createElement('div');
  chatContainer.innerHTML = chatHtml;
  document.body.appendChild(chatContainer);

  const chat = document.getElementById('chat');
  const chatClose = document.getElementById('chat-close');
  const messageInput = document.getElementById('message-input');
  const messageSubmit = document.getElementById('message-submit');
  const messagesContent = document.getElementById('messages-content');

  // Close chat on close button click
  chatClose.addEventListener('click', () => {
    chat.style.display = 'none';
  });

  // Event listener for message submission
  messageSubmit.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
      displayMessage(message, 'user');
      displayTypingAnimation();
      chrome.runtime.sendMessage({ action: 'userQuery', query: message }, response => {
        removeTypingAnimation();
        displayMessage(response.data, 'assistant');
      });
      messageInput.value = ''; // Clear input field
    }
  });

  // Function to display message in chat UI
  function displayMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender === 'user' ? 'message-user' : 'message-assistant');
    messageElement.textContent = message;
    messagesContent.appendChild(messageElement);
    messagesContent.scrollTop = messagesContent.scrollHeight; // Scroll to bottom
  }

  // Function to display typing animation
  function displayTypingAnimation() {
    const typingElement = document.createElement('div');
    typingElement.classList.add('message', 'message-assistant', 'typing');
    typingElement.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    typingElement.id = 'typing';
    messagesContent.appendChild(typingElement);
    messagesContent.scrollTop = messagesContent.scrollHeight; // Scroll to bottom
  }

  // Function to remove typing animation
  function removeTypingAnimation() {
    const typingElement = document.getElementById('typing');
    if (typingElement) {
      messagesContent.removeChild(typingElement);
    }
  }

  // Make chat draggable
  dragElement(chat);

  function dragElement(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (element.querySelector('.chat-title')) {
      element.querySelector('.chat-title').onmousedown = dragMouseDown;
    } else {
      element.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      element.style.top = (element.offsetTop - pos2) + "px";
      element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

})();
