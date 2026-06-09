import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface City {
    id: string;
    name: string;
    state: string;
    code?: string;
}

interface CityContextType {
    selectedCity: City | null;
    setSelectedCity: (city: City | null) => void;
    cities: City[];
    isLoading: boolean;
    error: Error | null;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cities, setCities] = useState<City[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const [selectedCity, setSelectedCity] = useState<City | null>(() => {
        const stored = localStorage.getItem('selectedCity');
        if (stored) {
            return JSON.parse(stored);
        }
        return null;
    });

    useEffect(() => {
        const fetchCities = async () => {
            try {
                setIsLoading(true);
                // We are using the 'districts' table as the source of truth for cities/locations
                const { data, error } = await supabase
                    .from('districts')
                    .select('*')
                    .order('name');

                if (error) throw error;

                if (data) {
                    // Mapping district data to City interface if necessary, though they share structure
                    setCities(data as City[]);

                    // If no city is selected, select the first one
                    if (!selectedCity && data.length > 0) {
                        setSelectedCity(data[0] as City);
                    }
                }
            } catch (err) {
                console.error('Error fetching cities:', err);
                setError(err instanceof Error ? err : new Error('Failed to fetch cities'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchCities();
    }, []); // Run once on mount

    useEffect(() => {
        if (selectedCity) {
            localStorage.setItem('selectedCity', JSON.stringify(selectedCity));
        }
    }, [selectedCity]);

    return (
        <CityContext.Provider value={{
            selectedCity,
            setSelectedCity,
            cities,
            isLoading,
            error
        }}>
            {children}
        </CityContext.Provider>
    );
};

export const useCity = () => {
    const context = useContext(CityContext);
    if (context === undefined) {
        throw new Error('useCity must be used within a CityProvider');
    }
    return context;
};
