
'use client';

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

export type ActiveSection = 'home' | 'about' | 'projects' | 'journey' | 'contact' | string | null;

interface ScrollSectionContextType {
  activeSection: ActiveSection;
  setActiveSection: Dispatch<SetStateAction<ActiveSection>>;
}

const ScrollSectionContext = createContext<ScrollSectionContextType | undefined>(undefined);

export function ScrollSectionProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<ActiveSection>('home');

  return (
    <ScrollSectionContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </ScrollSectionContext.Provider>
  );
}

export function useScrollSection() {
  const context = useContext(ScrollSectionContext);
  if (context === undefined) {
    throw new Error('useScrollSection must be used within a ScrollSectionProvider');
  }
  return context;
}
