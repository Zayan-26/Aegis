import { createContext, ReactNode, useContext, useState } from "react";
interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  image?: string;
}

interface AccessibilityContextType {
  dyslexic: boolean;
  setDyslexic: (val: boolean) => void;
  colorBlind: boolean;
  setColorBlind: (val: boolean) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  largeButtons: boolean;
  setLargeButtons: (val: boolean) => void;
  notifyOn: boolean;
  setNotifyOn: (val: boolean) => void;
  trustedContacts: TrustedContact[];
  setTrustedContacts: (contacts: TrustedContact[]) => void;
}

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [dyslexic, setDyslexic] = useState(false);
  const [colorBlind, setColorBlind] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeButtons, setLargeButtons] = useState(false);
  const [notifyOn, setNotifyOn] = useState(true);
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);

  return (
    <AccessibilityContext.Provider
      value={{
        dyslexic,
        setDyslexic,
        colorBlind,
        setColorBlind,
        highContrast,
        setHighContrast,
        largeButtons,
        setLargeButtons,
        notifyOn,
        setNotifyOn,
        trustedContacts,
        setTrustedContacts,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility(): AccessibilityContextType {
  const ctx = useContext(AccessibilityContext);
  if (!ctx)
    throw new Error(
      "useAccessibility must be used inside AccessibilityProvider",
    );
  return ctx;
}
