-- Initial Schema for ScaffAI
-- Created: 2025-06-04

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create enums
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE user_plan AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE project_status AS ENUM ('draft', 'in_progress', 'completed');

-- Users table (extends auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    plan user_plan DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    site_address TEXT,
    status project_status DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drawings table
CREATE TABLE drawings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    dxf_blob TEXT, -- Base64 encoded DXF data
    svg_blob TEXT, -- SVG data
    scale DECIMAL(10,4) DEFAULT 1.0,
    metadata JSONB, -- Additional drawing metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conditions table (scaffold configuration)
CREATE TABLE conditions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    eave_depths DECIMAL(10,2)[] NOT NULL DEFAULT '{600}', -- Array of eave depths in mm
    boundaries JSONB NOT NULL DEFAULT '{}', -- Boundary settings
    roof_type TEXT NOT NULL DEFAULT 'flat',
    special_materials TEXT[] DEFAULT '{}', -- Array of special material codes
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calculations table (results)
CREATE TABLE calculations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    algo_version TEXT NOT NULL DEFAULT '1.0',
    result_json JSONB NOT NULL, -- Calculation results
    cost DECIMAL(10,2), -- Total cost
    material_list JSONB, -- Bill of materials
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_drawings_project_id ON drawings(project_id);
CREATE INDEX idx_conditions_project_id ON conditions(project_id);
CREATE INDEX idx_calculations_project_id ON calculations(project_id);
CREATE INDEX idx_calculations_created_at ON calculations(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_drawings_updated_at BEFORE UPDATE ON drawings
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_conditions_updated_at BEFORE UPDATE ON conditions
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_calculations_updated_at BEFORE UPDATE ON calculations
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE drawings ENABLE ROW LEVEL SECURITY;
ALTER TABLE conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculations ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: Can only see and update their own profile
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Projects: Users can only access their own projects
CREATE POLICY "Users can view their own projects" ON projects
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own projects" ON projects
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own projects" ON projects
    FOR DELETE USING (auth.uid() = owner_id);

-- Drawings: Users can only access drawings of their projects
CREATE POLICY "Users can view drawings of their projects" ON drawings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = drawings.project_id 
            AND projects.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert drawings to their projects" ON drawings
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = drawings.project_id 
            AND projects.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can update drawings of their projects" ON drawings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = drawings.project_id 
            AND projects.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete drawings of their projects" ON drawings
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = drawings.project_id 
            AND projects.owner_id = auth.uid()
        )
    );

-- Conditions: Users can only access conditions of their projects
CREATE POLICY "Users can view conditions of their projects" ON conditions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = conditions.project_id 
            AND projects.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert conditions to their projects" ON conditions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = conditions.project_id 
            AND projects.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can update conditions of their projects" ON conditions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = conditions.project_id 
            AND projects.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete conditions of their projects" ON conditions
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = conditions.project_id 
            AND projects.owner_id = auth.uid()
        )
    );

-- Calculations: Users can only access calculations of their projects
CREATE POLICY "Users can view calculations of their projects" ON calculations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = calculations.project_id 
            AND projects.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert calculations to their projects" ON calculations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = calculations.project_id 
            AND projects.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can update calculations of their projects" ON calculations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = calculations.project_id 
            AND projects.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete calculations of their projects" ON calculations
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = calculations.project_id 
            AND projects.owner_id = auth.uid()
        )
    );