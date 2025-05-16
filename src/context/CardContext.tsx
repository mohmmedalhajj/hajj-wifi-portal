
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

export type CardType = {
  id: string;
  serialNumber: string;
  value: 200 | 500 | 1000;
  durationHours: number;
  isActive: boolean;
  activatedAt: string | null;
  expiresAt: string | null;
};

interface CardContextType {
  cards: CardType[];
  addCard: (value: 200 | 500 | 1000, count: number) => void;
  checkCard: (serialNumber: string) => CardType | null;
  activateCard: (serialNumber: string) => CardType | null;
  getAllCards: () => CardType[];
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
          const now = new Date();
          const expireDate = new Date(now);
          expireDate.setHours(now.getHours() + card.durationHours);
          
          foundCard = {
            ...card,
            isActive: true,
            activatedAt: now.toISOString(),
            expiresAt: expireDate.toISOString(),
          };
          return foundCard;
        }
        return card;
      })
    );
    
    return foundCard;
  };

  const getAllCards = (): CardType[] => {
    return cards;
  };

  return (
    <CardContext.Provider value={{ cards, addCard, checkCard, activateCard, getAllCards }}>
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
