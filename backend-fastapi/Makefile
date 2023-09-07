.DEFAULT_GOAL := help
.PHONY: format lint test install init tidy ready_to_commit all help run
.EXPORT_ALL_VARIABLES:

format:				## Format code.
	black .
	isort .

lint:				## Run linters.
	flake8 .
	# mypy .

run:				## Run the project.
	poetry run uvicorn app:app --host 0.0.0.0 --port 8000

test:				## Run tests in the development environment.
	pytest --cache-clear

performance-test:		## Run performance tests in the development environment.
	locust -f tests/performance/locust_test.py --host=http://localhost:8000

install:			## Install developement dependecies and local packages.
	pip install --upgrade pip
	pip install poetry
	pip install -r requirements.txt
	poetry install --no-root
	poetry run prisma generate
	pip install --prefer-binary locust
	# pre-commit install

init: install test		## Initialize the project.

tidy: format lint		## Tidy up the project.

ready_to_commit: tidy test		## Check if the project is ready to push.
	@echo "\033[32m\nAll OK! Ready to commit!\n\033[0m"

all: install tidy test		## Build everything.

help:				## Show this help.
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'
