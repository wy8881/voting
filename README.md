# Voting System using steps
## A. Before you use this system
1. Create an account at https://cloud.mongodb.com/
2. Create User.
3. Click '**Quickstart**', scroll down, and check whether any IP address exists.

   If there is no IP address, click '**Add My Current IP Address**'.

   Next time, if you see this in '**Overview**':

   ![image](https://github.com/wy8881/voting/assets/74237376/ca759087-d4f0-40b9-be5f-67d229075922)

   click '**Add Current IP Address**'
5. Click '**CONNECT**' in '**Overview**' (First of the left sidebar):

   ![2](https://github.com/wy8881/voting/assets/74237376/4966521d-f251-455b-8224-e36f0125e4ef)

7. Choose '**Compass**' as your access data tool, then copy the **connection string**.
8. Download '**Compass**'.
9. Open MongoDB Compass.
10. Paste the **connection string** into the '**URI**', and replace **<password>** with the password for the user. 
11. Click '**Save & Connect**'. (If you have a problem here, visit https://www.mongodb.com/community/forums/t/error-while-connecting-my-database-through-mongodb-compass/243317)
12. Create a database. -- (Remember the database's name)
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
1. For creating `delegate`, use `mvn spring-boot:run "-Dspring-boot.run.arguments=--create_delegate"` under the 'voting' folder.
2. For creating `logger`, use `mvn spring-boot:run "-Dspring-boot.run.arguments=--create_logger"` under the 'voting' folder.
## D. Common Issues
1. Frontend Application Fails to Start: 
        Ensure that Node.js is correctly installed. Run `npm install` in the frontend folder to install all necessary frontend dependencies.
2. Backend Application Fails to Start: 
        Ensure that the MongoDB database service is running. Verify that the network connection is stable and not blocked by a firewall. Ensure that the database connection information in the `.env` file is accurate and correct.
3. This project does not support Spring Framework 6+. If you get the error `class file has wrong version 61.0, should be 55.0` when you run VotingApplication.java, you should downgrade your Spring Framework to 5.3.x and check your Java version. For more information, visit https://stackoverflow.com/questions/74648576/spring-class-file-has-wrong-version-61-0-should-be-55-0.
