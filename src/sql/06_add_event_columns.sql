-- Add Generic Event specific columns to events table if they don't exist

DO $$
BEGIN
    BEGIN
        ALTER TABLE events ADD COLUMN artist TEXT;
        RAISE NOTICE 'Added artist column to events table';
    EXCEPTION
        WHEN duplicate_column THEN RAISE NOTICE 'artist column already exists';
    END;

    BEGIN
        ALTER TABLE events ADD COLUMN duration INTEGER;
        RAISE NOTICE 'Added duration column to events table';
    EXCEPTION
        WHEN duplicate_column THEN RAISE NOTICE 'duration column already exists';
    END;

    BEGIN
        ALTER TABLE events ADD COLUMN language TEXT;
        RAISE NOTICE 'Added language column to events table';
    EXCEPTION
        WHEN duplicate_column THEN RAISE NOTICE 'language column already exists';
    END;

END $$;
