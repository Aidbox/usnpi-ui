# US NPI Demo

This is a demonstration app showcasing indexed search capability of the [US NPI](https://github.com/HealthSamurai/us-npi) registry powered by [Aidbox](https://www.health-samurai.io/aidbox).

The app performs search on Practitioner and Organization FHIR resources.

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
