import { createContext, ReactNode, useContext, useMemo, useState } from "react";
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
  theme: AccessibilityTheme;
}

//This is somehow the less horrifying solution out of the 2.
export type AccessibilityTheme = {
  screenBackground: string;
  boxBackground: string;
  mainTextColor: string;
  smallTextColor: string;
  boxBorderColor: string;
  buttonColor: string;
  buttonTextColor: string;

  font?: string;
  letterSpacing: number;
  lineH: number;
  dyslexicFontSize?: number;

  btnPadding: number;
  btnRadius: number;
  titleSize: number;
  labelSize: number;
  descSize: number;
  btnTextSize: number;
  cardPadding: number;
};


const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [dyslexic, setDyslexic] = useState(false);
  const [colorBlind, setColorBlind] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeButtons, setLargeButtons] = useState(false);
  const [notifyOn, setNotifyOn] = useState(true);
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);

  const theme = useMemo<AccessibilityTheme>(() => {
    const screenBackground = highContrast ? "#000000" : "#F7F8FC";
    const boxBackground = highContrast ? "#1A1A1A" : "#FFFFFF";
    const mainTextColor = highContrast ? "#FFFFFF" : "#1E2A78";
    const smallTextColor = highContrast ? "#CCCCCC" : "#4F647A";
    const boxBorderColor = highContrast ? "#FFFFFF" : "#D9DDE7";
    const buttonColor = colorBlind ? "#E69F00" : "#69B7C6";
    const buttonTextColor = colorBlind ? "#000000" : "#FFFFFF";

    const font = dyslexic ? "OpenDyslexic" : undefined;
    const letterSpacing = dyslexic ? 1 : 0;
    const lineH = dyslexic ? 24 : 20;
    const dyslexicFontSize = dyslexic ? 15 : undefined;

    const btnPadding = largeButtons ? 22 : 16;
    const btnRadius = largeButtons ? 20 : 16;
    const titleSize = largeButtons ? 32 : 28;
    const labelSize = largeButtons ? 18 : 16;
    const descSize = largeButtons ? 15 : 13;
    const btnTextSize = largeButtons ? 20 : 18;
    const cardPadding = largeButtons ? 20 : 16;

    return {
      screenBackground,
      boxBackground,
      mainTextColor,
      smallTextColor,
      boxBorderColor,
      buttonColor,
      buttonTextColor,
      font,
      letterSpacing,
      lineH,
      dyslexicFontSize,
      btnPadding,
      btnRadius,
      titleSize,
      labelSize,
      descSize,
      btnTextSize,
      cardPadding,
    };
  }, [highContrast, colorBlind, dyslexic, largeButtons]);

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
        theme,
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
