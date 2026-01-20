-- Add Sport specific columns to events table if they don't exist

DO $$
BEGIN
    BEGIN
        ALTER TABLE events ADD COLUMN league TEXT;
        RAISE NOTICE 'Added league column to events table';
    EXCEPTION
        WHEN duplicate_column THEN RAISE NOTICE 'league column already exists';
    END;

    BEGIN
        ALTER TABLE events ADD COLUMN home_team TEXT;
        RAISE NOTICE 'Added home_team column to events table';
    EXCEPTION
        WHEN duplicate_column THEN RAISE NOTICE 'home_team column already exists';
    END;

    BEGIN
        ALTER TABLE events ADD COLUMN away_team TEXT;
        RAISE NOTICE 'Added away_team column to events table';
    EXCEPTION
        WHEN duplicate_column THEN RAISE NOTICE 'away_team column already exists';
    END;

    BEGIN
        ALTER TABLE events ADD COLUMN is_active BOOLEAN DEFAULT true;
        RAISE NOTICE 'Added is_active column to events table';
    EXCEPTION
        WHEN duplicate_column THEN RAISE NOTICE 'is_active column already exists';
    END;
    
    -- Add indexes for better performance on these new columns if needed
    -- CREATE INDEX IF NOT EXISTS idx_events_league ON events(league);

END $$;
