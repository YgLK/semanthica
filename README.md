# semanthica

## Project Setup

1. Replace the placeholder values in the `backend/.env.template` and `backend/meili_config.yml.template`  file with your actual configuration details.
2. Rename `.env.template` to `.env` and `meili_config.yml.template` to `meili_config.yml`.
3. Make sure to never commit your config files with sensitive information.

For local development you can just use the `local.env` and `local_meili_config.yml` files. Rename them to `.env` and `meili_config.yml` respectively.

### Environment Variables

The following environment variables are required for this project:

- `POSTGRES_USER`: The username for database authentication.
- `POSTGRES_PASSWORD`: The password for database authentication.
- `POSTGRES_HOST`: The hostname or IP address of the database server.
- `POSTGRES_DB`: The database name.

## Run the project

#### backend
1. Create a virtual environment for the backend, install requirements, and activate the virtual environment.
```shell
# create virtual env from conda environment.yml
conda env create -f backend/environment.yml
# activate virtual env
conda activate semanthica
```

2. Run the docker-compose file to start the databases.
```shell
cd backend
docker-compose up -d
```

3. Run the backend server.
```shell
cd backend
uvicorn app.main:app --reload
```

### frontend
1. Install dependencies and run the frontend server.
```shell
cd frontend
npm install
npm start 
```
