pull:
	act -W .github/workflows/deploy.yml pull_request --secret-file .env
push:
	act -W .github/workflows/deploy.yml push -b master --secret-file .env
dispatch:
	act -W .github/workflows/deploy.yml workflow_dispatch --secret-file .env
