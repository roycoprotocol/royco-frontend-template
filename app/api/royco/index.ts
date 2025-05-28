import { Api } from "royco/api";

// Create a new instance of the API client with the proxied base URL
export const api = new Api({
  baseURL: "/", // This will be proxied
  headers: {
    "Keep-Alive": "timeout=30",
    Connection: "keep-alive",
  },
});
