import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

export function useSSE(url, onMessage) {
  const { user } = useAuth();

  useEffect(() => {
    // Null guard: don't connect if no user is logged in
    if (!user) return;

    const source = new EventSource(url, {
      withCredentials: true,
    });

    source.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        onMessage(parsedData);
      } catch (error) {
        console.error("Failed to parse SSE message:", error);
      }
    };

    source.onerror = (error) => {
      console.error("SSE error:", error);
    };

    return () => {
      source.close();
    };
  }, [url, user, onMessage]);
}
