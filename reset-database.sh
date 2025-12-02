#!/bin/bash

# Database Reset Script
# This script will drop all collections in the MongoDB database

echo "⚠️  WARNING: This will delete ALL data in the database!"
echo "Press Ctrl+C to cancel, or wait 5 seconds to continue..."
sleep 5

# Default database name
DB_NAME="voting_db"

# Check if MONGODB_URI is set in environment
if [ -n "$MONGODB_URI" ]; then
    # Extract database name from URI if present
    if [[ $MONGODB_URI == *"/"* ]]; then
        DB_NAME=$(echo $MONGODB_URI | sed 's/.*\///')
    fi
    echo "Using database from MONGODB_URI: $DB_NAME"
else
    echo "Using default database: $DB_NAME"
    echo "Set MONGODB_URI environment variable to use a different database"
fi

# Try to connect and drop database
if command -v mongosh &> /dev/null; then
    echo "Using mongosh..."
    mongosh --eval "use $DB_NAME; db.dropDatabase();" --quiet
    echo "✅ Database '$DB_NAME' has been dropped."
elif command -v mongo &> /dev/null; then
    echo "Using mongo..."
    mongo $DB_NAME --eval "db.dropDatabase();" --quiet
    echo "✅ Database '$DB_NAME' has been dropped."
else
    echo "❌ Error: Neither 'mongosh' nor 'mongo' command found."
    echo "Please install MongoDB shell or use MongoDB Compass to manually drop the database."
    echo ""
    echo "To manually reset:"
    echo "1. Open MongoDB Compass"
    echo "2. Connect to your database"
    echo "3. Select the database '$DB_NAME'"
    echo "4. Click 'Drop Database'"
    exit 1
fi

echo ""
echo "🔄 Database reset complete!"
echo "Restart the Spring Boot application to reinitialize data."

