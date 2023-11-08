# Voting System using steps
# A. Before you use this system
1. Create an account at https://cloud.mongodb.com/
2. Create User.
3. Click 'CONNECT' in 'Overview' (First of the left sidebar).
4. Choose 'Compass' as your access data tool, then copy the connection string.
5. Download 'Compass'.
6. Open MongoDB Compass.
7. Paste the connection string into the 'URI', and replace <password> with the password for the user. 
8. Click 'Save & Connect'.
9. Create a database. -- Remember the database's name
# If you haven't used IntelliJ IDEA Community before, follow these steps:
1. Download and install IntelliJ IDEA Community Edition at https://www.jetbrains.com/idea/download/?section=windows
2. Download this voting system and open it as a project in IntelliJ IDEA.
# B. Using System
1. Go to the 'voting\src\main\resources' folder, and build a new '.env' document.
2. Rewrite this '.env' document as '.env.example'.
3. Add real values with " " after every "=".
   To fill out the MONGO_DATABASE, you need to copy the database's name and paste here.
   To fill out the MONGO_CLUSTER, you need to copy the string behind '@' in the connection string we copied before.
   MONGO_USER and MONGO_PASSWORD are your account user's name and password.
   For example:
        MONGO_DATABASE="abc-voting"
        MONGO_USER="abc"
        MONGO_PASSWORD="abc"
        MONGO_CLUSTER="cluster0.edplh85.mongodb.net"
4. Open 'VotingApplication.java' and run.
5. Open 'Terminal' (tap Alt+F12).
6. Inside the voting folder, create a new folder named "frontend". (mkdir frontend)
7. Go to the 'frontend' folder (cd frontend)
8. Start the system (npm start)

   
