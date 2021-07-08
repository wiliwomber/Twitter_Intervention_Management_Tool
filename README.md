# Twitter_Intervention_Management_Tool

Tool that enables researchers to conduct intervention experiments on Twitter

To run locally check out the READMEs in frontend and backend.

## Run the dockerized system

1. Install `Docker`
1. Install `docker-compose`
1. Open terminal at root folder
1. Update certificate in `nginx/certs/` and add private key
1. Change default database admin username and password in docker-compose file
1. Add .env file to project root folder
1. run `sudo docker-compose up --build`
1. run `docker-compose up -d` to run docker in detached mode
