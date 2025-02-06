// import React, { useEffect, useState } from "react";
// import { writeTestData, listenForMessages } from "./firebaseUtils";

// function FirebaseTest() {
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     listenForMessages((messagesArray) => {
//       setMessages(messagesArray);
//     });
//   }, []);

//   return (
//     <div>
//       <h1>Firebase Test</h1>
//       <button onClick={writeTestData}>Write Test Data</button>
//       <h3>Received Messages:</h3>
//       <ul>
//         {messages.map((msg) => (
//           <li key={msg.id}>
//             <strong>{msg.username}:</strong> {msg.text}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default FirebaseTest;
