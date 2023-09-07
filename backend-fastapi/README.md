# PMW Backend API Server

This project is built on FastAPI using MongoDB as well as Prisma for ORM + database migrations.

There are two ways to setup and run the application:

> Docker is the recommended way to run the application as it is easier to setup and run. It also ensures that the application runs in the same environment across all machines.

1. Using Docker (Recommended and easier)
2. Manual Installation

## Installation and Setup (Using Docker)

### Prerequisites

1. Docker Desktop
2. Docker Compose
3. Docker Engine
4. Make sure an `.env` file is present in the root project directory, a sample environment file `.env.sample` has been provided for reference.

Link to download Docker: https://docs.docker.com/get-docker/

At the time of developement, following are the versions of the tools used:

1. Docker Desktop: 4.18.0
2. Engine: 20.10.24
3. Compose: v2.17.2

> To check the version of Docker, run `docker --version` in the terminal.
>
> To check the version of Docker Compose, run `docker-compose --version` in the terminal.

### Running the application on Docker

The Dockerfile and docker-compose.yml are present in the root directory of the project. To run the application, follow the steps below:

1. Run `docker compose up --build` to build and run the application.
2. The application will be running on `http://localhost:{PORT}` (or the port specified in the `.env` file).

## Environment Setup (Manual Installation)

The dependencies for this project can be found in `pyproject.toml` and `requirements.txt`.
For easier installation use Makefile commands. This can be found in the root directory of the project.

### Prerequisites

There are two ways to setting up the environment and running the application:

1. Using make commands (Recommended and easier)
2. Manually

> On MacOS and Linux, make is probably already installed, but on Windows, you might need to install it manually. You can download the binary from [GNUWin32](http://gnuwin32.sourceforge.net/packages/make.htm) or here: http://gnuwin32.sourceforge.net/packages/make.htm

At the time of developement, following are the versions of the tools used (some python packages would not work as expected with other versions):

1. Python: 3.8.10
2. Python Package Manager (pip): 21.2.1
3. Make: 3.81

> To check the version of Python, run `python --version` in the terminal.
>
> To check the version of pip, run `pip --version` in the terminal.
>
> To check the version of Make, run `make --version` in the terminal.

#### Setup python virtual environment

To setup the python virtual environment, follow the steps below:

1. Create a virtual environment using `python -m venv venv`
2. Activate the virtual environment using `source venv/bin/activate`

#### Manual Installation and run: Using make commands

> Assuming that make is already installed on the system and the virtual environment is already setup and activated.

1. Run `make install` to install the dependencies.
   This will install the dependencies from `pyproject.toml` and `requirements.txt` in the virtual environment. It will also generate the prisma client.
2. Run `make run` to run the application.
   This will run the application on `http://localhost:{PORT}` (or the port specified in the `.env` file).

#### Manual Installation and run: Manually

> Assuming that the virtual environment is already setup and activated.

> For installing the dependencies, follow the steps below:

1. Run `pip install --upgrade pip` to upgrade pip to the latest version.
   This is required as the latest version of pip is required to install the dependencies from `pyproject.toml
2. Run `pip install poetry` to install poetry.
3. Run `pip install -r requirements.txt` to install the dependencies from `requirements.txt
4. Run `poetry install --no-root` to install the dependencies from `pyproject.toml
5. Run `poetry run prisma generate` to generate the prisma client. Prisma client connects to the database and provides the ORM functionalities.

> For running the application, follow the steps below:

1. Run `poetry run uvicorn app:app --host 0.0.0.0 --port 8000` to run the application.
   This will run the application on `http://localhost:8000`

## On application startup

On application startup, the following happens:

1. The application connects to the database. On successful connection, it show the message: "START UP: Connected to database".
2. An INFO log is generated with the message: "INFO: Uvicorn running on http://0.0.0.0:{PORT} (Press CTRL+C to quit)". This shows that the application is running on the specified port.

## API Documentation

The API documentation can be found at `http://localhost:{PORT}/docs` (or the port specified in the `.env` file).

## Running the tests

There are two types of tests:

1. API tests
2. Performance tests

### API tests

The API tests are written using pytest and can be found in `app/test_apis.py`.

1. Run `make test` to run the tests.

### Performance tests

#### Prerequisites

1. Locust (https://docs.locust.io/en/stable/installation.html) is required to run the performance tests. To install locust, run `pip install locust`. On MacOS, you can also install locust using `brew install locust`. Mac with M1 chip is not supported by locust yet. To install locust on Mac with M1 chip, follow the steps below:
   1. Run `pip install --prefer-binary locust` to install locust
   2. Run the API server using `make run`

The performance tests are written using locust and can be found in `tests/performance/locust_test.py`.

1. Run `make performance-test` to run the performance tests. This will start the locust server on `http://localhost:8089`.
2. Open `http://localhost:8089` in the browser to open the locust dashboard.
3. Enter the number of users to spawn and the hatch rate and click on "Start swarming".
4. The locust server will start sending requests to the application.
5. The results can be seen in the locust dashboard.
