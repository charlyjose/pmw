.DEFAULT_GOAL := help
.PHONY: format lint test e2e install init tidy all help ready_to_commit
.EXPORT_ALL_VARIABLES:

format:				## Format code.
	black .
	isort .

lint:				## Run linters.
	flake8 .
	# mypy .

test:				## Run tests in the development environment.
	pytest . --ignore=tests/end_to_end

e2e:
	pytest ./tests/end_to_end

install:			## Install developement dependecies and local packages.
	pip install --upgrade pip
	pip install poetry
	pip install -r requirements.txt
	poetry install --no-root
	# pre-commit install

init: install test		## Initialize the project.

tidy: format lint		## Tidy up the project.

ready_to_commit: tidy test		## Check if the project is ready to push.
	@echo "\033[32m\nAll OK! Ready to commit!\n\033[0m"

all: install tidy test		## Build everything.

help:				## Show this help.
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'
