document.getElementById('optionsForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const botToken = document.getElementById('botToken').value;
    const chatId = document.getElementById('chatId').value;
    
    chrome.storage.sync.set({ botToken, chatId }, function() {
      alert('Bot Token and Chat ID saved successfully!');
    });
  });
  