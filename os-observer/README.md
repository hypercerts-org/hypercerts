# Open Source Observer

## Typescript

### Setup

Install your npm dependencies

```bash
yarn install
```

> Note: the codebase is currently set up to just work directly off the production database. In the future, we should allow for local dev databases.

You can check if the code schema is in sync with your database schema by running:

```bash
yarn db:migrate
```

For more details on how to collaborate within a team with Prisma, see [here](https://www.prisma.io/docs/guides/migrate/developing-with-prisma-migrate/team-development)

## Python

### Setup

1. Set environment variables in a `.env` file. You'll need API access credentials for Alchemy, Etherscan, Github, and Supabase.

2. Install the requirements in the `requirements.txt` file.

`$ pip install -r requirements.txt`

### Adding projects

Projects must be stored in a JSON with the following fields:

- name
- description
- github_org

A database of projects can then be initialized with the following command in `src/database.py`:

`insert_projects_and_wallets_from_json("data/projects.json")`

### Fetching Github events for a project

Once the database of projects is created, you can trigger the script to gather Github events with the following command in `src/database.py`:

`insert_all_events()`

Don't forget to review constant settings for:

```
START, END = '2021-01-01T00:00:00Z', '2023-04-30T00:00:00Z'
QUERIES = ["merged PR", "issue", "created PR"]
```

Note: there is currently no detection of duplicate entries in the database, so be careful modifying these settings.

### Fetching financial transactions linked to a project's Ethereum address

The script uses Zerion to download all transaction data for a wallet address.

`$ python src/zerion_scraper.py`

It will store all of the CSV files in a local directory:

`STORAGE_DIR = "data/temp"`

Finally, these can be added to the events database through the following command in `src/database.py`:

`insert_zerion_transactions()`
