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
12. Create a database. -- (Remember the **database's name**)
### Strongly suggest using IntelliJ IDEA to run this system
### If you haven't used IntelliJ IDEA Community before, follow these steps:
1. Download and install IntelliJ IDEA Community Edition at https://www.jetbrains.com/idea/download/?section=windows
2. Download this voting system and open it as a project in IntelliJ IDEA.
## B. Start System
1. Go to the `voting\src\main\resources` folder, and build a new `.env` document.
2. Rewrite this `.env` document as `.env.example`.
3. Add real values with `" "` after every "`=`".
   
   To fill out the `MONGO_DATABASE`, copy the **database's name** and paste it here.
   
   To fill out the `MONGO_CLUSTER`, copy the string behind `@` in the connection string we copied before.
   
   `MONGO_USER` and `MONGO_PASSWORD` are your account user's name and password.
   
   For example:
   
        MONGO_DATABASE="abc-voting"
   
        MONGO_USER="abc"
   
        MONGO_PASSWORD="abc"
   
        MONGO_CLUSTER="cluster0.edplh85.mongodb.net"
5. Open '**VotingApplication.java**' in `voting\src\main\java\com\example\voting` folder and run.
6. Open '**Terminal**' (tap `Alt+F12`).
7. Go to the '**frontend**' folder (`cd frontend`)
8. Start the system (`npm start`)
## C. Use System
Before creating a `delegate`, `logger` and `admin`, stop running '**VotingApplication.java**'

For creating `delegate`, use `mvn spring-boot:run "-Dspring-boot.run.arguments=--create-delegate"` under the 'voting' folder.

1. After CLI stop running, you can set `delegate's name` (`Username` hidden before), then `Enter`.
2. Set `password`, then `Enter`. 
3. Set `Email`, then `Enter`.
   
   (You can use this email and password to log in as a delegate)

For example:

![3](https://github.com/wy8881/voting/assets/74237376/64374e39-7c03-46e6-81fb-69d2c22d01b1)

4. Then type another command to create a `logger` and `admin` as `delegate`'s process.
   
   (1) For creating `logger`, use `mvn spring-boot:run "-Dspring-boot.run.arguments=--create-logger"`

   (2) For creating `admin`, use `mvn spring-boot:run "-Dspring-boot.run.arguments=--create-admin"`
## D. Deploy System
System Requirements of the Server:
- JDK 21
- Node.js 14+
- MongoDB Compass
- Nginx

1. For deploying the system, use `mvn clean package` under the 'voting' folder.
2. For deploying the frontend, use `npm run build` under the 'frontend' folder.
3. Copy the `voting-0.0.1-SNAPSHOT.jar` file from `voting\target` folder to the server.
4. Copy the `build` folder from `frontend` folder to the server.
5. run `npm install -g serve` before you run `serve -s build` under the `build` folder.
6. run `java -jar voting-0.0.1-SNAPSHOT.jar` under the folder where the `voting-0.0.1-SNAPSHOT.jar` file is located.
7. Open Nginx configuration file and add the following code:
    - If you want to use HTTP, you can use the following code:
   
           server {
                listen 80;
                server_name example.com;
                location / {
                    proxy_pass http://localhost:3000;
                }
                location /api {
                        proxy_pass http://localhost:8000;
                }
            }

      - If you want to use HTTPS, you need to install a certificate. You can use Let's Encrypt to get a free certificate.
        use the following code:  

             server {
                 listen 80;
                 server_name example.com;
                 listen 443 ssl;
                 ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
                 ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
                 ssl_protocols TLSv1.1 TLSv1.2;
                 ssl_prefer_server_ciphers on;
                 ssl_session_timeout 5m;
                 location / {
                     proxy_pass http://localhost:3000;
                 }
                 location /api {
                         proxy_pass http://localhost:8000;
                 }
             }

8. Restart Nginx.
9. If you want to use HTTP, you can simply visit `http://[server-ip]`. If you want to use HTTPS, you can visit `https://[hostname-assciated-to-ssl-certificate]`.


## E. Common Issues
1. Frontend Application Fails to Start: 
        Ensure that Node.js is correctly installed. Run `npm install` in the frontend folder to install all necessary frontend dependencies.
2. Backend Application Fails to Start: 
        Ensure that the MongoDB database service is running. Verify that the network connection is stable and not blocked by a firewall. Ensure that the database connection information in the `.env` file is accurate and correct.
3. Java 1.8 and 11 does not support Spring Framework 6+. If you get the error `class file has wrong version 61.0, should be 55.0` when you run VotingApplication.java, you should downgrade your Spring Framework to 5.3.x and check your Java version. For more information, visit https://stackoverflow.com/questions/74648576/spring-class-file-has-wrong-version-61-0-should-be-55-0.
4. This uses JDK 21 as Development Environment. So that JDK 21 is strongly recommended.
