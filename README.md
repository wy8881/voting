# Voting System using steps
## A. Before you use this system
1. Create an account at https://cloud.mongodb.com/
2. Create User.
3. Click 'Quickstart', scroll down, and check whether any IP address exists. If there is no IP address, click 'Add My Current IP Address'.
4. Click 'CONNECT' in 'Overview' (First of the left sidebar).
5. Choose 'Compass' as your access data tool, then copy the connection string.
6. Download 'Compass'.
7. Open MongoDB Compass.
8. Paste the connection string into the 'URI', and replace <password> with the password for the user. 
9. Click 'Save & Connect'. (If you have a problem here, visit https://www.mongodb.com/community/forums/t/error-while-connecting-my-database-through-mongodb-compass/243317)
10. Create a database. -- (Remember the database's name)
## If you haven't used IntelliJ IDEA Community before, follow these steps:
1. Download and install IntelliJ IDEA Community Edition at https://www.jetbrains.com/idea/download/?section=windows
2. Download this voting system and open it as a project in IntelliJ IDEA.
## B. Start System
1. Go to the `voting\src\main\resources` folder, and build a new `.env` document.
2. Rewrite this `.env` document as `.env.example`.
3. Add real values with `" "` after every "`=`".
   
   To fill out the `MONGO_DATABASE`, copy the database's name and paste it here.
   
   To fill out the `MONGO_CLUSTER`, copy the string behind `@` in the connection string we copied before.
   
   `MONGO_USER` and `MONGO_PASSWORD` are your account user's name and password.
   
   For example:
   
        MONGO_DATABASE="abc-voting"
   
        MONGO_USER="abc"
   
        MONGO_PASSWORD="abc"
   
        MONGO_CLUSTER="cluster0.edplh85.mongodb.net"
5. Open 'VotingApplication.java' and run.
6. Open 'Terminal' (tap `Alt+F12`).
7. Go to the 'frontend' folder (`cd frontend`)
8. Start the system (`npm start`)
## C. Use System
1. Start the Terminal and go to the 'voting' folder.
2. For creating `delegate`, use `mvn spring-boot:run "-Dspring-boot.run.arguments=--create_delegate"`
3. For creating `logger`, use `mvn spring-boot:run "-Dspring-boot.run.arguments=--create_logger"`
   
