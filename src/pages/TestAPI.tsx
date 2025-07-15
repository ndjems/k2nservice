import { useEffect, useState } from "react";
import api from "../services/api";

const TestAPI = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    api.get("messages/")
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error("Erreur de l'API :", error);
      });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Messages depuis Django</h2>
      <ul className="list-disc pl-5">
        {messages.map((msg: any) => (
          <li key={msg.id}>{msg.texte}</li>
        ))}
      </ul>
    </div>
  );
};

export default TestAPI;