import { createContext, useContext } from "react";

const WeddingDataContext = createContext(null);

export function WeddingDataProvider({ data, children }) {
  return <WeddingDataContext.Provider value={data}>{children}</WeddingDataContext.Provider>;
}

export function useWeddingData() {
  return useContext(WeddingDataContext);
}
