
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## License

Nest is [MIT licensed](LICENSE).


## Requirements

1. Add wallet addresses and display them 
2. From the set of wallets, the user should be able to select favorites and order by them 
3. We should have a way to know if a wallet is old. A wallet is considered old if the first transaction was performed at least one year ago. 
4. The user should be able to do the following actions - 
  a. Get exchange rates from Euro and US Dollar to ETH (Ethereum), those can be stored in-memory or in any DB of your preference. 
  b. Edit the exchange rate of Euro or US Dollar to ETH 
5. Given a currency (Euro or US Dollar) then the user should have the balance of the ETH in the wallet in the selected currency using the exchange rates from step 4. 
- You can store data in memory, but a DB is a must be.


## TODO
- Logging
- Add schema validation (like joi)
- Add remaining unit tests (+ schema validation tests)
- - Rate tests not added because there was no logic on them
- - User tests not added because there was no logic on them
- Check null cases after retrieving from db.
- Add backend to docker compose using dockerfile
- Put mocks in mocks file instead of hardcoding in tests
- Add custom error
- Add standard response for requests
- Use nock for mocking calls to external services
- Add swagger