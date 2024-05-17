# Telegram Message Sender Chrome Extension

This Chrome extension allows users to send selected text or images to a Telegram chat using context menu options.

## Features

- **Send Selected Text**: Sends selected text to a Telegram chat with the source URL.
- **Send Images**: Sends images to a Telegram chat with the source URL as a caption.
- **Escape Special Characters**: Automatically escapes special characters for Telegram's MarkdownV2 parse mode.

## Installation

1. **Clone or download the repository** to your local machine.
2. **Open Chrome** and navigate to `chrome://extensions/`.
3. **Enable "Developer mode"** by toggling the switch in the top right corner.
4. **Click on "Load unpacked"** and select the directory where the repository was cloned or downloaded.

## Usage

1. **Right-click** on any selected text or image.
2. Select **"Send to Telegram"** from the context menu.

## Configuration

1. Navigate to the extension's **Options page**.
2. Enter your **Telegram Bot Token** and **Chat ID**.
3. Click **Save**.

## Code Overview

### Must edit

background.js:

```javascript
default-token = inter your bot token
default-id = inter your group or chat id
