// import { database } from "./firebaseConfig";
// import { ref, push, onValue } from "firebase/database";

// // 📌 Function to write test data
// export function writeTestData() {
//   push(ref(database, "messages/"), {
//     // ✅ Use push() instead of set()
//     username: "System",
//     text: "Hello Firebase!",
//     timestamp: Date.now(),
//   })
//     .then(() => console.log("Data written successfully!"))
//     .catch((error) => console.error("Error writing data:", error));
// }

// // 📌 Function to send a new message
// export const sendMessage = (username, text) => {
//   const messagesRef = ref(database, "messages/");
//   push(messagesRef, {
//     username,
//     text,
//     timestamp: Date.now(), // Store the time
//   })
//     .then(() => console.log("Message sent!"))
//     .catch((error) => console.error("Error sending message:", error));
// };

// // 📌 Function to listen for new messages
// export const listenForMessages = (callback) => {
//   const messagesRef = ref(database, "messages/");
//   onValue(messagesRef, (snapshot) => {
//     const data = snapshot.val();
//     if (data) {
//       const messagesArray = Object.entries(data).map(([id, msg]) => ({
//         id,
//         ...msg,
//       }));
//       callback(messagesArray);
//     } else {
//       callback([]);
//     }
//   });
// };
