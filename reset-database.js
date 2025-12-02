// MongoDB Reset Script
// Run this with: mongosh reset-database.js
// Or: mongo reset-database.js (for older MongoDB versions)

// Default database name
const DB_NAME = "voting_db";

print("⚠️  WARNING: This will delete ALL data in the database!");
print("Resetting database: " + DB_NAME);

// Switch to the database
db = db.getSiblingDB(DB_NAME);

// Drop all collections
db.users.drop();
db.voters.drop();
db.candidates.drop();
db.parties.drop();
db.preferences.drop();
db.votes.drop();
db.ballots.drop();
db.election_status.drop();
db.election_results.drop();
db.logs.drop();

// Or drop the entire database
db.dropDatabase();

print("✅ Database reset complete!");
print("Restart the Spring Boot application to reinitialize data.");

