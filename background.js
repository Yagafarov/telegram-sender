function escapeTelegramMessage(text) {
  const specialCharacters = ['_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!'];

  for (const char of specialCharacters) {
    text = text.replace(new RegExp(`\\${char}`, 'g'), `\\${char}`);
  }

  return text;
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sendToTelegram",
    title: "Send to Telegram",
    contexts: ["selection", "image"]
  });

  chrome.runtime.openOptionsPage(); // Open options page on first install
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "sendToTelegram") {
    if (info.selectionText) {
      const selectedText = info.selectionText;
      const sourcePath = tab.url; // Get the URL of the current tab
      const message = `${selectedText}\n\nSource: ${sourcePath}`; // Include source path in the message
      const escapedMessage = escapeTelegramMessage(message);
      await sendMessageToTelegram(escapedMessage);
    } else if (info.mediaType === "image") {
      const imageUrl = info.srcUrl;
      const sourcePath = tab.url; // Get the URL of the current tab
      const caption = `Source: ${sourcePath}`; // Include source path as caption
      await sendImageToTelegram(imageUrl, caption);
    }
  }
});

async function sendMessageToTelegram(text) {
  const { botToken, chatId } = await getTelegramCredentials();
  const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(telegramApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "MarkdownV2"
      })
    });

    const data = await response.json();
    if (data.ok) {
      console.log("Message sent successfully");
    } else {
      console.error("Error sending message:", JSON.stringify(data));
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function sendImageToTelegram(imageUrl, caption) {
  const { botToken, chatId } = await getTelegramCredentials();
  const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;

  try {
    // Check the imageUrl before sending the request
    console.log("Image URL:", imageUrl);

    const response = await fetch(telegramApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        photo: imageUrl,
        caption: caption // Include source path as caption
      })
    });

    const data = await response.json();
    if (data.ok) {
      console.log("Image sent successfully");
    } else {
      console.error("Error sending image:", JSON.stringify(data));
    }
  } catch (error) {
    console.error("Error:", error);
  }
}



function getTelegramCredentials() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['botToken', 'chatId'], function(result) {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError));
      } else {
        const { botToken, chatId } = result;
        const defaultBotToken = "6478767923:AAFJzjOXhI7aRMgEhVcdUFaYFEfo2tVSe2c";
        const defaultChatId = "-1002078066535";
        const resolvedBotToken = botToken || defaultBotToken;
        const resolvedChatId = chatId || defaultChatId;
        resolve({ botToken: resolvedBotToken, chatId: resolvedChatId });
      }
    });
  });
}

