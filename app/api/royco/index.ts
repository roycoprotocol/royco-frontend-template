import { Api as ProductionApi } from "royco/api";
import { Api as DevelopmentApi } from "./Api";

export const api =
  process.env.NEXT_PUBLIC_API_ENV === "development"
    ? new DevelopmentApi({
        baseURL: "http://localhost:8000",
        withCredentials: true,
      })
    : new ProductionApi({
        baseURL: "/",
        withCredentials: true,
      });
