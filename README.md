# US NPI Demo

This is a demonstration app showcasing indexed search capabilities of the [Aidbox](https://www.health-samurai.io/aidbox) platform performed on the [US NPI](http://download.cms.gov/nppes/NPI_Files.html) registry powered by Aidbox.

The app provides search on Practitioner and Organization FHIR resources.

## Dev
- Install dependencies
  ```bash
  npm i
  ```
- Prepare environment
  ```bash
  cp env-tpl .env
  ```
- Start docker-compose with Aidbox Dev
  ```bash
  docker-compose up -d
  ```
- Register app
  ```bash
  npm run dev
  ```
- Start ui
  ```bash
  npm start
  ```

## Production
https://usnpi.netlify.com/
