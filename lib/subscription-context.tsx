import React, { createContext, useContext, useState, useCallback } from "react";
import { HOME_SUBSCRIPTIONS } from "@/constants/data";

interface SubscriptionContextType {
  subscriptions: Subscription[];
  addSubscription: (sub: Subscription) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscriptions: HOME_SUBSCRIPTIONS,
  addSubscription: () => {},
});

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(HOME_SUBSCRIPTIONS);

  const addSubscription = useCallback((sub: Subscription) => {
    setSubscriptions((prev) => [sub, ...prev]);
  }, []);

  return (
    <SubscriptionContext.Provider value={{ subscriptions, addSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptions() {
  return useContext(SubscriptionContext);
}
