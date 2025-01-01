-- Clear existing data
DELETE FROM workout_movements;
DELETE FROM workouts;
DELETE FROM movements;

-- Seed movements table - Strength movements
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000001', 'snatch', 'strength');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000002', 'clean', 'strength');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000003', 'jerk', 'strength');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000004', 'clean and jerk', 'strength');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000007', 'push press', 'strength');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000008', 'press', 'strength');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000009', 'jerk', 'strength');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000011', 'thruster', 'strength');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000012', 'squat', 'strength');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000015', 'deadlift', 'strength');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000016', 'sumo deadlift high pull', 'strength');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000017', 'bench press', 'strength');

-- Gymnastic movements
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000018', 'push up', 'gymnastic');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000020', 'handstand push up', 'gymnastic');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000022', 'pull up', 'gymnastic');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000023', 'chest to bar pull up', 'gymnastic');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000024', 'ring row', 'gymnastic');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000025', 'muscle up', 'gymnastic');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000027', 'toes to bar', 'gymnastic');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000028', 'knees to elbow', 'gymnastic');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000029', 'ghd sit up', 'gymnastic');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000030', 'sit up', 'gymnastic');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000031', 'v up', 'gymnastic');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000032', 'hollow rock', 'gymnastic');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000033', 'l-sit', 'gymnastic');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000034', 'rope climb', 'gymnastic');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000036', 'burpee', 'gymnastic');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000037', 'box jump', 'gymnastic');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000038', 'pistol', 'gymnastic');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000039', 'lunge', 'gymnastic');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000041', 'air squat', 'gymnastic');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000042', 'handstand walk', 'gymnastic');

-- Additional strength movements
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000049', 'wall ball', 'strength');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000050', 'dumbbell snatch', 'strength');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000051', 'kettlebell swing', 'strength');

-- Monostructural movements
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000054', 'run', 'monostructural');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000055', 'row', 'monostructural');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000056', 'bike', 'monostructural');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000057', 'jump rope', 'monostructural');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000058', 'double under', 'monostructural');
INSERT INTO movements (id, name, type) VALUES ('00000000-0000-0000-0000-000000000059', 'ski erg', 'monostructural');

-- Seed workouts table
INSERT INTO workouts (id, name, description, scheme, created_at) VALUES ('10000000-0000-0000-0000-000000000001', 'Fran', '21-15-9 reps of thrusters (95/65 lbs) and pull-ups', 'time', CURRENT_TIMESTAMP);
INSERT INTO workouts (id, name, description, scheme, created_at) VALUES ('10000000-0000-0000-0000-000000000002', 'Angie', '100 pull-ups 100 push-ups 100 sit-ups 100 squats', 'time', CURRENT_TIMESTAMP);
INSERT INTO workouts (id, name, description, scheme, created_at) VALUES ('10000000-0000-0000-0000-000000000003', 'Barbara', '5 rounds of: 20 pull-ups 30 push-ups 40 sit-ups 50 squats; Rest 3 minutes between rounds', 'time', CURRENT_TIMESTAMP);
INSERT INTO workouts (id, name, description, scheme, created_at) VALUES ('10000000-0000-0000-0000-000000000004', 'Chelsea', 'Every minute on the minute for 30 minutes: 5 pull-ups 10 push-ups 15 squats', 'pass-fail', CURRENT_TIMESTAMP);
INSERT INTO workouts (id, name, description, scheme, created_at) VALUES ('10000000-0000-0000-0000-000000000005', 'Cindy', 'As many rounds as possible in 20 minutes: 5 pull-ups 10 push-ups 15 squats', 'rounds-reps', CURRENT_TIMESTAMP);
INSERT INTO workouts (id, name, description, scheme, created_at) VALUES ('10000000-0000-0000-0000-000000000006', 'Diane', '21-15-9 reps of deadlifts (225/155 lbs) and handstand push-ups', 'time', CURRENT_TIMESTAMP);
INSERT INTO workouts (id, name, description, scheme, created_at) VALUES ('10000000-0000-0000-0000-000000000007', 'Elizabeth', '21-15-9 reps of cleans (135/95 lbs) and ring dips', 'time', CURRENT_TIMESTAMP);
INSERT INTO workouts (id, name, description, scheme, created_at) VALUES ('10000000-0000-0000-0000-000000000008', 'Grace', '30 clean and jerks (135/95 lbs)', 'time', CURRENT_TIMESTAMP);
INSERT INTO workouts (id, name, description, scheme, created_at) VALUES ('10000000-0000-0000-0000-000000000009', 'Helen', '3 rounds for time: 400m run 21 kettlebell swings (53/35 lbs) 12 pull-ups', 'time', CURRENT_TIMESTAMP);
INSERT INTO workouts (id, name, description, scheme, created_at) VALUES ('10000000-0000-0000-0000-000000000010', 'Isabel', '30 snatches (135/95 lbs)', 'time', CURRENT_TIMESTAMP);
INSERT INTO workouts (id, name, description, scheme, created_at) VALUES ('10000000-0000-0000-0000-000000000011', 'Jackie', '1000m row 50 thrusters (45/35 lbs) 30 pull-ups', 'time', CURRENT_TIMESTAMP);
INSERT INTO workouts (id, name, description, scheme, created_at) VALUES ('10000000-0000-0000-0000-000000000012', 'Karen', '150 wall-ball shots (20/14 lbs)', 'time', CURRENT_TIMESTAMP);
INSERT INTO workouts (id, name, description, scheme, created_at) VALUES ('10000000-0000-0000-0000-000000000013', 'Linda', '10-9-8-7-6-5-4-3-2-1 reps for time: deadlift (1.5 bodyweight) bench press (bodyweight) clean (0.75 bodyweight)', 'time', CURRENT_TIMESTAMP);
INSERT INTO workouts (id, name, description, scheme, created_at) VALUES ('10000000-0000-0000-0000-000000000014', 'Mary', 'As many rounds as possible in 20 minutes: 5 handstand push-ups 10 one-legged squats 15 pull-ups', 'rounds-reps', CURRENT_TIMESTAMP);
INSERT INTO workouts (id, name, description, scheme, created_at) VALUES ('10000000-0000-0000-0000-000000000015', 'Nancy', '5 rounds for time: 400m run 15 overhead squats (95/65 lbs)', 'time', CURRENT_TIMESTAMP);
INSERT INTO workouts (id, name, description, scheme, created_at) VALUES ('10000000-0000-0000-0000-000000000016', 'Annie', '50-40-30-20-10 reps for time: double-unders sit-ups', 'time', CURRENT_TIMESTAMP);

-- Seed workout_movements junction table
INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', (SELECT id FROM movements WHERE name = 'thruster'));
INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', (SELECT id FROM movements WHERE name = 'pull up'));

INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', (SELECT id FROM movements WHERE name = 'pull up'));
INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', (SELECT id FROM movements WHERE name = 'push up'));
INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002', (SELECT id FROM movements WHERE name = 'sit up'));
INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000002', (SELECT id FROM movements WHERE name = 'air squat'));

INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000009', (SELECT id FROM movements WHERE name = 'run'));
INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000009', (SELECT id FROM movements WHERE name = 'kettlebell swing'));
INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000009', (SELECT id FROM movements WHERE name = 'pull up'));

INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000003', (SELECT id FROM movements WHERE name = 'pull up'));
INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000003', (SELECT id FROM movements WHERE name = 'push up'));
INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000003', (SELECT id FROM movements WHERE name = 'sit up'));
INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000003', (SELECT id FROM movements WHERE name = 'air squat'));

INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000004', (SELECT id FROM movements WHERE name = 'pull up'));
INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000004', (SELECT id FROM movements WHERE name = 'push up'));
INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000004', (SELECT id FROM movements WHERE name = 'air squat'));

INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000017', '10000000-0000-0000-0000-000000000005', (SELECT id FROM movements WHERE name = 'pull up'));
INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000018', '10000000-0000-0000-0000-000000000005', (SELECT id FROM movements WHERE name = 'push up'));
INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000019', '10000000-0000-0000-0000-000000000005', (SELECT id FROM movements WHERE name = 'air squat'));

INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000020', '10000000-0000-0000-0000-000000000006', (SELECT id FROM movements WHERE name = 'deadlift'));
INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000021', '10000000-0000-0000-0000-000000000006', (SELECT id FROM movements WHERE name = 'handstand push up'));

INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000022', '10000000-0000-0000-0000-000000000007', (SELECT id FROM movements WHERE name = 'clean'));
INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000023', '10000000-0000-0000-0000-000000000007', (SELECT id FROM movements WHERE name = 'muscle up'));

INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000024', '10000000-0000-0000-0000-000000000008', (SELECT id FROM movements WHERE name = 'clean and jerk'));

INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000025', '10000000-0000-0000-0000-000000000010', (SELECT id FROM movements WHERE name = 'snatch'));

INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000026', '10000000-0000-0000-0000-000000000011', (SELECT id FROM movements WHERE name = 'row'));
INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000027', '10000000-0000-0000-0000-000000000011', (SELECT id FROM movements WHERE name = 'thruster'));
INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000028', '10000000-0000-0000-0000-000000000011', (SELECT id FROM movements WHERE name = 'pull up'));

INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000029', '10000000-0000-0000-0000-000000000012', (SELECT id FROM movements WHERE name = 'wall ball'));

INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000030', '10000000-0000-0000-0000-000000000013', (SELECT id FROM movements WHERE name = 'deadlift'));
INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000031', '10000000-0000-0000-0000-000000000013', (SELECT id FROM movements WHERE name = 'bench press'));
INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000032', '10000000-0000-0000-0000-000000000013', (SELECT id FROM movements WHERE name = 'clean'));

INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000033', '10000000-0000-0000-0000-000000000014', (SELECT id FROM movements WHERE name = 'handstand push up'));
INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000034', '10000000-0000-0000-0000-000000000014', (SELECT id FROM movements WHERE name = 'pistol'));
INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000035', '10000000-0000-0000-0000-000000000014', (SELECT id FROM movements WHERE name = 'pull up'));

INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000036', '10000000-0000-0000-0000-000000000015', (SELECT id FROM movements WHERE name = 'run'));
INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000037', '10000000-0000-0000-0000-000000000015', (SELECT id FROM movements WHERE name = 'squat'));

INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000038', '10000000-0000-0000-0000-000000000016', (SELECT id FROM movements WHERE name = 'double under'));
INSERT INTO workout_movements (id, workout_id, movement_id) VALUES ('20000000-0000-0000-0000-000000000039', '10000000-0000-0000-0000-000000000016', (SELECT id FROM movements WHERE name = 'sit up'));