const { createCanvas, loadImage, registerFont } = require('@napi-rs/canvas');

// Register the font (optional, only if you want to use a custom font)
// registerFont('path/to/font.ttf', { family: 'Custom Font' });

async function generateDiscordMessageImage(text, username, timestamp, avatarUrl) {
  const canvas = createCanvas(400, 100); // Adjust the canvas size as needed
  const ctx = canvas.getContext('2d');

  // Draw the background
  ctx.fillStyle = '#36393f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the user avatar (smaller and rounded)
  const avatarSize = 40; // Adjust the size of the user avatar
  const avatarImage = await loadImage(avatarUrl);
  const borderRadius = avatarSize / 2;
  ctx.save();
  ctx.beginPath();
  ctx.arc(20 + borderRadius, 20 + borderRadius, borderRadius, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatarImage, 20, 20, avatarSize, avatarSize);
  ctx.restore();

  // Draw the username and timestamp
  const usernameTimestampX = 80 - 12; // Adjust the x-coordinate of the username and timestamp
  const usernameTimestampY = 40; // Adjust the y-coordinate of the username and timestamp
  const usernameTimestampSpacing = 5; // Adjust the spacing between the username and timestamp
  const usernameTimestampFont = '16px Arial'; // Adjust the font size and style of the username and timestamp
  const timestampOpacity = 0.6; // Adjust the opacity of the timestamp
  const timestampFont = '12px Arial'; // Adjust the font size and style of the timestamp

  ctx.fillStyle = '#ffffff';
  ctx.font = usernameTimestampFont;
  const usernameTimestampText = `${username} — ${timestamp.getHours()}:${padZero(timestamp.getMinutes())}`;
  ctx.fillText(usernameTimestampText, usernameTimestampX, usernameTimestampY);

  ctx.fillStyle = `rgba(255, 255, 255, ${timestampOpacity})`;
  ctx.font = timestampFont;
  const timestampText = `${timestamp.getHours()}:${padZero(timestamp.getMinutes())}`;
  ctx.fillText(timestampText, usernameTimestampX + ctx.measureText(usernameTimestampText).width + usernameTimestampSpacing, usernameTimestampY);

  // Draw the message text
  const messageTextX = usernameTimestampX + 12; // Adjust the x-coordinate of the message text
  const messageTextY = 70; // Adjust the y-coordinate of the message text
  const messageTextWidth = canvas.width - 40; // Adjust the width of the message text
  const messageTextLineHeight = 20; // Adjust the line height of the message text
  const messageTextFont = '16px Arial'; // Adjust the font size and style of the message text

  ctx.fillStyle = '#ffffff';
  ctx.font = messageTextFont;
  wrapText(ctx, text, messageTextX, messageTextY, messageTextWidth, messageTextLineHeight);

  // Convert the canvas to a buffer
  const imageBuffer = canvas.toBuffer('image/png');

  return imageBuffer;
}

// Utility function to wrap text within a given width
function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = line + word + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      context.fillText(line, x, y);
      line = word + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }

  context.fillText(line, x, y);
}

// Utility function to pad single digit numbers with a leading zero
function padZero(num) {
  return num.toString().padStart(2, '0');
}

module.exports = generateDiscordMessageImage;
