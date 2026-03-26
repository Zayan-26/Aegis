import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"
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
  interactableTextColor: string

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
  const [dyslexic, setDyslexic] = useState(false)
  // const [dyslexic, setDyslexic] = useState(false);
  const [colorBlind, setColorBlind] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeButtons, setLargeButtons] = useState(false);
  const [notifyOn, setNotifyOn] = useState(true);
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);
  
  useEffect(() => {
    AsyncStorage.multiGet([
      "aegis.app.dyslexic",
      "aegis.app.colorBlind",
      "aegis.app.highContrast",
      "aegis.app.largeButtons",
      "aegis.app.trustedContacts"
    ]).then((stores) => {
      stores.forEach(([key, value]) => {
        if (key === "aegis.app.dyslexic" && value !== null) setDyslexic(JSON.parse(value));
        if (key === "aegis.app.colorBlind" && value !== null) setColorBlind(JSON.parse(value));
        if (key === "aegis.app.highContrast" && value !== null) setHighContrast(JSON.parse(value));
        if (key === "aegis.app.largeButtons" && value !== null) setLargeButtons(JSON.parse(value));
        if (key === "aegis.app.trustedContacts" && value !== null) setTrustedContacts(JSON.parse(value));
      });
    });
  }, []);

  // Save value on change
  useEffect(() => { AsyncStorage.setItem("aegis.app.dyslexic", JSON.stringify(dyslexic)) }, [setDyslexic]);
  useEffect(() => { AsyncStorage.setItem("aegis.app.colorBlind", JSON.stringify(colorBlind)) }, [setColorBlind]);
  useEffect(() => { AsyncStorage.setItem("aegis.app.highContrast", JSON.stringify(highContrast)) }, [setHighContrast]);
  useEffect(() => { AsyncStorage.setItem("aegis.app.largeButtons", JSON.stringify(largeButtons)) }, [setLargeButtons]);
  useEffect(() => { AsyncStorage.setItem("aegis.app.trustedContacts", JSON.stringify(trustedContacts)) }, [setTrustedContacts]);

  const theme = useMemo<AccessibilityTheme>(() => {
    const screenBackground = highContrast ? "#000000" : "#F7F8FC";
    const boxBackground = highContrast ? "#1A1A1A" : "#FFFFFF";
    const mainTextColor = highContrast ? "#FFFFFF" : "#1E2A78";
    const smallTextColor = highContrast ? "#CCCCCC" : "#4F647A";
    const boxBorderColor = highContrast ? "#FFFFFF" : "#D9DDE7";
    const buttonColor = colorBlind ? "#E69F00" : "#69B7C6";
    const buttonTextColor = colorBlind ? "#000000" : "#FFFFFF";
    const interactableTextColor = highContrast ? "#E69F00" : "#477d87"

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
      interactableTextColor,
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
