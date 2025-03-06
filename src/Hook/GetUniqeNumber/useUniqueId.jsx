import { useEffect, useState } from "react";

const useUniqueId = (inNew = false) => {
  const [receivedIdentifiers, setReceivedIdentifiers] = useState(new Set());
  const [uniqueId, setUniqueId] = useState("");
  const characters = "0123456789";

  useEffect(() => {
    setReceivedIdentifiers(new Set());
    const generateUniqueIdentifier = () => {
      let identifier;
      do {
        identifier = "";
        for (let i = 0; i < 9; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          identifier += characters[randomIndex];
        }
      } while (receivedIdentifiers.has(identifier));

      setReceivedIdentifiers((prevIdentifiers) =>
        new Set(prevIdentifiers).add(identifier)
      );
      setUniqueId(`#${identifier}`);
      return identifier;
    };
    generateUniqueIdentifier();
  }, [inNew]);

  return uniqueId;
};

export default useUniqueId;
