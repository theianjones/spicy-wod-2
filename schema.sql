-- Drop tables in reverse order of dependencies
DROP TABLE IF EXISTS monostructural_sets;
DROP TABLE IF EXISTS monostructural_results;
DROP TABLE IF EXISTS strength_sets;
DROP TABLE IF EXISTS strength_results;
DROP TABLE IF EXISTS wod_sets;
DROP TABLE IF EXISTS wod_results;
DROP TABLE IF EXISTS results;
DROP TABLE IF EXISTS workout_movements;
DROP TABLE IF EXISTS workouts;
DROP TABLE IF EXISTS movements;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    joined_at TIMESTAMP NOT NULL
);

-- Movements table
CREATE TABLE IF NOT EXISTS movements (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('strength', 'gymnastic', 'monostructural'))
);

-- Workouts table
CREATE TABLE IF NOT EXISTS workouts (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    scheme VARCHAR(20) CHECK (scheme IN ('time', 'time-with-cap', 'pass-fail', 'rounds-reps', 
        'reps', 'emom', 'load', 'calories', 'meters', 'feet', 'points')),
    created_at TIMESTAMP,
    reps_per_round INTEGER,
    rounds_to_score INTEGER,
    user_id UUID REFERENCES users(id),
    sugar_id VARCHAR(255),
    tiebreak_scheme VARCHAR(20) CHECK (tiebreak_scheme IN ('time', 'reps')),
    secondary_scheme VARCHAR(20) CHECK (secondary_scheme IN ('time', 'pass-fail', 'rounds-reps', 
        'reps', 'emom', 'load', 'calories', 'meters', 'feet', 'points'))
);

-- Workout Movements (junction table)
CREATE TABLE IF NOT EXISTS workout_movements (
    id UUID PRIMARY KEY,
    workout_id UUID REFERENCES workouts(id),
    movement_id UUID REFERENCES movements(id)
);

-- Results base table
CREATE TABLE IF NOT EXISTS results (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    date TIMESTAMP NOT NULL,
    type UUID NOT NULL,
    notes TEXT
);

-- WOD Results
CREATE TABLE IF NOT EXISTS wod_results (
    id UUID PRIMARY KEY REFERENCES results(id),
    workout_id UUID REFERENCES workouts(id) NOT NULL,
    scale VARCHAR(20) CHECK (scale IN ('rx', 'scaled', 'rx+'))
);

-- WOD Sets
CREATE TABLE IF NOT EXISTS wod_sets (
    id UUID PRIMARY KEY,
    result_id UUID REFERENCES wod_results(id),
    score NUMERIC,
    set_number INTEGER NOT NULL
);

-- Strength Results
CREATE TABLE IF NOT EXISTS strength_results (
    id UUID PRIMARY KEY REFERENCES results(id),
    movement_id UUID REFERENCES movements(id) NOT NULL,
    set_count INTEGER NOT NULL
);

-- Strength Sets
CREATE TABLE IF NOT EXISTS strength_sets (
    id UUID PRIMARY KEY,
    result_id UUID REFERENCES strength_results(id),
    set_number INTEGER NOT NULL,
    reps INTEGER NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pass', 'fail')),
    weight INTEGER NOT NULL
);

-- Monostructural Results
CREATE TABLE IF NOT EXISTS monostructural_results (
    id UUID PRIMARY KEY REFERENCES results(id),
    movement_id UUID REFERENCES movements(id) NOT NULL,
    distance INTEGER NOT NULL,
    time INTEGER NOT NULL
);

-- Monostructural Sets
CREATE TABLE IF NOT EXISTS monostructural_sets (
    id UUID PRIMARY KEY,
    result_id UUID REFERENCES monostructural_results(id),
    set_number INTEGER NOT NULL,
    distance INTEGER NOT NULL,
    time INTEGER NOT NULL
);

