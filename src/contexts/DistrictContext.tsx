import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface District {
  id: string;
  name: string;
  state: string;
  code?: string; // made optional as DB might not return it immediately if not populated, or we need to ensure migration adds it
}

interface DistrictContextType {
  selectedDistrict: District | null;
  setSelectedDistrict: (district: District | null) => void;
  districts: District[];
  isLoading: boolean;
  error: Error | null;
}

const DistrictContext = createContext<DistrictContextType | undefined>(undefined);

export const DistrictProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(() => {
    const stored = localStorage.getItem('selectedDistrict');
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  });

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('districts')
          .select('*')
          .order('name');

        if (error) throw error;

        if (data) {
          setDistricts(data);

          // If no district is selected, select the first one
          if (!selectedDistrict && data.length > 0) {
            setSelectedDistrict(data[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching districts:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch districts'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDistricts();
  }, []); // Run once on mount

  useEffect(() => {
    if (selectedDistrict) {
      localStorage.setItem('selectedDistrict', JSON.stringify(selectedDistrict));
    }
  }, [selectedDistrict]);

  return (
    <DistrictContext.Provider value={{
      selectedDistrict,
      setSelectedDistrict,
      districts,
      isLoading,
      error
    }}>
      {children}
    </DistrictContext.Provider>
  );
};

export const useDistrict = () => {
  const context = useContext(DistrictContext);
  if (context === undefined) {
    throw new Error('useDistrict must be used within a DistrictProvider');
  }
  return context;
};
