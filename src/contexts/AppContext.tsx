import React, { createContext, useContext, useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  sku: string;
  salePrice: number;
  costPrice: number;
  stockQuantity: number;
  soldQuantity: number;
  isSold: boolean;
}

interface Transaction {
  id: string;
  date: string;
  type: 'profit' | 'expense';
  amount: number;
  description: string;
}

interface AppContextType {
  products: Product[];
  transactions: Transaction[];
  addProduct: (product: Omit<Product, 'id' | 'isSold' | 'soldQuantity'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  markAsSold: (productId: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addProduct = (product: Omit<Product, 'id' | 'isSold' | 'soldQuantity'>) => {
    const newProduct = {
      ...product,
      id: crypto.randomUUID(),
      isSold: false,
      soldQuantity: 0
    };
    setProducts(prev => [...prev, newProduct]);
    
    // Add cost as expense
    setTransactions(prev => [...prev, {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      type: 'expense',
      amount: product.costPrice * product.stockQuantity,
      description: `Custo inicial: ${product.name}`
    }]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const markAsSold = (productId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId && !p.isSold) {
        // Calculate profit
        const profit = p.salePrice - p.costPrice;
        
        // Add profit transaction
        setTransactions(prev => [...prev, {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          type: 'profit',
          amount: profit,
          description: `Venda: ${p.name}`
        }]);

        return { ...p, isSold: true, soldQuantity: p.stockQuantity };
      }
      return p;
    }));
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <AppContext.Provider value={{ 
      products, 
      transactions,
      addProduct, 
      updateProduct, 
      deleteProduct,
      markAsSold,
      darkMode,
      toggleDarkMode
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}