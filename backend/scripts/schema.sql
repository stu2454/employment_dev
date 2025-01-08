DO $$
BEGIN
    -- Check if the 'providers' table exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'providers') THEN
        CREATE TABLE providers (
            provider_id VARCHAR(255) NOT NULL,
            provider_name VARCHAR(255) NOT NULL,
            contact_phone VARCHAR(20) NOT NULL,
            contact_email VARCHAR(255) NOT NULL,
            number_of_sites INTEGER NOT NULL,
            role VARCHAR(10) NOT NULL DEFAULT 'staff', -- New column for role
            PRIMARY KEY (provider_id, contact_email) -- Composite primary key
        );
    ELSE
        -- Add the 'role' column if it doesn't already exist
        IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'providers' AND column_name = 'role'
        ) THEN
            ALTER TABLE providers ADD COLUMN role VARCHAR(10) NOT NULL DEFAULT 'staff';
        END IF;
    END IF;

    -- Check if the 'sites' table exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sites') THEN
        CREATE TABLE sites (
            site_id SERIAL PRIMARY KEY,
            provider_id VARCHAR(255) NOT NULL,
            contact_email VARCHAR(255) NOT NULL,
            site_name VARCHAR(255) NOT NULL,
            FOREIGN KEY (provider_id, contact_email) REFERENCES providers(provider_id, contact_email) ON DELETE CASCADE
        );
    END IF;

    -- Check if the 'mfa_secrets' table exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mfa_secrets') THEN
        CREATE TABLE mfa_secrets (
            email VARCHAR(255) PRIMARY KEY,
            secret VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END $$;
