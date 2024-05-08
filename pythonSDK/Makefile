pcommand=pipenv run python
resetdatabase:
	$(pcommand) reset_database.py
	$(pcommand) reset_ambientes.py
	$(pcommand) reset_ambientes_norte.py
	$(pcommand) assign_lideres.py

download_volumes:
	$(pcommand) download_volumes.py

.PHONY: resetdatabase