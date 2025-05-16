
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

export type CardType = {
  id: string;
  serialNumber: string;
  value: 200 | 500 | 1000;
  durationHours: number;
  isActive: boolean;
  activatedAt: string | null;
  expiresAt: string | null;
  remainingTime: number | null; // New field to store remaining time when logged out
  loggedOutAt: string | null; // New field to track when a card was logged out
};

interface CardContextType {
  cards: CardType[];
  addCard: (value: 200 | 500 | 1000, count: number) => void;
  checkCard: (serialNumber: string) => CardType | null;
  activateCard: (serialNumber: string) => CardType | null;
  getAllCards: () => CardType[];
  logoutCard: (serialNumber: string) => CardType | null; // New function to logout card
  reactivateCard: (serialNumber: string) => CardType | null; // New function to reactivate card
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export const CardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<CardType[]>([]);
  
  useEffect(() => {
    // Load cards from localStorage
    const storedCards = localStorage.getItem('alhajnet_cards');
    if (storedCards) {
      setCards(JSON.parse(storedCards));
    }
  }, []);

  // Save cards to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('alhajnet_cards', JSON.stringify(cards));
  }, [cards]);

  const addCard = (value: 200 | 500 | 1000, count: number) => {
    const newCards = [];
    
    // Set duration based on card value
    let durationHours;
    if (value === 200) durationHours = 24; // 1 day
    else if (value === 500) durationHours = 72; // 3 days
    else durationHours = 168; // 7 days
    
    for (let i = 0; i < count; i++) {
      const randomSerial = Math.floor(100000000 + Math.random() * 900000000).toString();
      newCards.push({
        id: `${Date.now()}-${i}`,
        serialNumber: randomSerial,
        value,
        durationHours,
        isActive: false,
        activatedAt: null,
        expiresAt: null,
        remainingTime: null,
        loggedOutAt: null,
      });
    }
    
    setCards(prevCards => [...prevCards, ...newCards]);
  };

  const checkCard = (serialNumber: string): CardType | null => {
    return cards.find(card => card.serialNumber === serialNumber) || null;
  };

  const activateCard = (serialNumber: string): CardType | null => {
    let foundCard = null;
    
    setCards(prevCards =>
      prevCards.map(card => {
        if (card.serialNumber === serialNumber && !card.isActive) {
          // For new activation
          const now = new Date();
          const expireDate = new Date(now);
          expireDate.setHours(now.getHours() + card.durationHours);
          
          foundCard = {
            ...card,
            isActive: true,
            activatedAt: now.toISOString(),
            expiresAt: expireDate.toISOString(),
            remainingTime: null,
            loggedOutAt: null,
          };
          return foundCard;
        } else if (card.serialNumber === serialNumber && card.remainingTime !== null) {
          // For reactivation with remaining time
          const now = new Date();
          const expireDate = new Date(now);
          
          // Add the remaining hours from previous session
          const remainingHours = card.remainingTime / (1000 * 60 * 60);
          expireDate.setHours(now.getHours() + remainingHours);
          
          foundCard = {
            ...card,
            isActive: true,
            activatedAt: now.toISOString(),
            expiresAt: expireDate.toISOString(),
            remainingTime: null,
            loggedOutAt: null,
          };
          return foundCard;
        }
        return card;
      })
    );
    
    return foundCard;
  };
  
  // New function to logout a card
  const logoutCard = (serialNumber: string): CardType | null => {
    let foundCard = null;
    
    setCards(prevCards =>
      prevCards.map(card => {
        if (card.serialNumber === serialNumber && card.isActive) {
          const now = new Date();
          const expiryDate = new Date(card.expiresAt || '');
          
          // Calculate remaining time in milliseconds
          const remainingTime = Math.max(0, expiryDate.getTime() - now.getTime());
          
          foundCard = {
            ...card,
            isActive: false,
            loggedOutAt: now.toISOString(),
            remainingTime: remainingTime,
          };
          return foundCard;
        }
        return card;
      })
    );
    
    return foundCard;
  };
  
  // New function to reactivate a card with remaining time
  const reactivateCard = (serialNumber: string): CardType | null => {
    const card = cards.find(card => card.serialNumber === serialNumber);
    
    if (card && card.remainingTime && card.remainingTime > 0) {
      return activateCard(serialNumber);
    }
    
    return null;
  };

  const getAllCards = (): CardType[] => {
    return cards;
  };

  return (
    <CardContext.Provider value={{ 
      cards, 
      addCard, 
      checkCard, 
      activateCard, 
      getAllCards,
      logoutCard,
      reactivateCard
    }}>
      {children}
    </CardContext.Provider>
  );
};

export const useCards = (): CardContextType => {
  const context = useContext(CardContext);
  if (context === undefined) {
    throw new Error('useCards must be used within a CardProvider');
  }
  return context;
};
