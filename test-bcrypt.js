const bcrypt = require('bcryptjs');

const password = 'password123'; // The password they likely used
const hash = '$2b$10$zlvjh8IhBinhty0oYVUUaur5nwmufeQawMrTLZQR5168gFg1DOD8.'; // The hash from DB

bcrypt.compare(password, hash).then(res => {
  console.log("Match:", res);
}).catch(err => {
  console.error("Error:", err);
});
