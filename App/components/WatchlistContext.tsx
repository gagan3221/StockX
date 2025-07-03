import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Stock } from '../../services/AlphaVantageAPI';

interface Watchlist {
  id: string;
  name: string;
  stocks: Stock[];
  createdAt: Date;
}

interface WatchlistContextType {
  watchlists: Watchlist[];
  currentWatchlistId: string;
  currentWatchlist: Watchlist | null;
  addToWatchlist: (stock: Stock, watchlistId?: string) => void;
  removeFromWatchlist: (stockId: string, watchlistId?: string) => void;
  isInWatchlist: (stockId: string, watchlistId?: string) => boolean;
  createWatchlist: (name: string) => string;
  deleteWatchlist: (watchlistId: string) => void;
  renameWatchlist: (watchlistId: string, newName: string) => void;
  setCurrentWatchlist: (watchlistId: string) => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};

interface WatchlistProviderProps {
  children: ReactNode;
}

export const WatchlistProvider: React.FC<WatchlistProviderProps> = ({ children }) => {
  // Initialize with a default watchlist
  const [watchlists, setWatchlists] = useState<Watchlist[]>([
    {
      id: '1',
      name: 'My Watchlist',
      stocks: [],
      createdAt: new Date(),
    }
  ]);
  const [currentWatchlistId, setCurrentWatchlistId] = useState('1');

  const currentWatchlist = watchlists.find(w => w.id === currentWatchlistId) || null;

  const addToWatchlist = (stock: Stock, watchlistId?: string) => {
    const targetId = watchlistId || currentWatchlistId;
    
    setWatchlists(prev => prev.map(watchlist => {
      if (watchlist.id === targetId) {
        const exists = watchlist.stocks.find(item => item.id === stock.id);
        if (!exists) {
          const newStocks = [...watchlist.stocks, stock];
          return { ...watchlist, stocks: newStocks };
        }
      }
      return watchlist;
    }));
  };

  const removeFromWatchlist = (stockId: string, watchlistId?: string) => {
    const targetId = watchlistId || currentWatchlistId;
    
    setWatchlists(prev => prev.map(watchlist => {
      if (watchlist.id === targetId) {
        const newStocks = watchlist.stocks.filter(stock => stock.id !== stockId);
        return { ...watchlist, stocks: newStocks };
      }
      return watchlist;
    }));
  };

  const isInWatchlist = (stockId: string, watchlistId?: string) => {
    const targetId = watchlistId || currentWatchlistId;
    const watchlist = watchlists.find(w => w.id === targetId);
    return watchlist ? watchlist.stocks.some(stock => stock.id === stockId) : false;
  };

  const createWatchlist = (name: string): string => {
    const newId = Date.now().toString();
    const newWatchlist: Watchlist = {
      id: newId,
      name,
      stocks: [],
      createdAt: new Date(),
    };
    
    setWatchlists(prev => [...prev, newWatchlist]);
    return newId;
  };

  const deleteWatchlist = (watchlistId: string) => {
    if (watchlists.length <= 1) {
      return;
    }
    
    setWatchlists(prev => prev.filter(w => w.id !== watchlistId));
    
    // If we're deleting the current watchlist, switch to the first remaining one
    if (currentWatchlistId === watchlistId) {
      const remaining = watchlists.filter(w => w.id !== watchlistId);
      if (remaining.length > 0) {
        setCurrentWatchlistId(remaining[0].id);
      }
    }
  };

  const renameWatchlist = (watchlistId: string, newName: string) => {
    setWatchlists(prev => prev.map(watchlist => 
      watchlist.id === watchlistId 
        ? { ...watchlist, name: newName }
        : watchlist
    ));
  };

  const setCurrentWatchlist = (watchlistId: string) => {
    setCurrentWatchlistId(watchlistId);
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlists,
        currentWatchlistId,
        currentWatchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        createWatchlist,
        deleteWatchlist,
        renameWatchlist,
        setCurrentWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}; 