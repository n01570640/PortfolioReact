# PortfolioReact

A collection of my React and full-stack JavaScript projects. Each one lives in its own folder with its own setup steps, so this page is just an index to point you to the right place.

## Projects

### Pharmacy Management System — [`PharmacyProject/`](PharmacyProject/README.md)
A full-stack MERN app for running a pharmacy's daily operations across three roles: patients, pharmacists, and administrators. Includes JWT authentication with role-based access, a prescription refill workflow, and inventory management.

**Stack:** React · React Router · PrimeReact · Node/Express · MongoDB/Mongoose · JWT
**More:** see the [project README](PharmacyProject/README.md) for screenshots, architecture, and setup.

### Resume App — [`ResumeProject/`](ResumeProject/)
A dynamic resume and portfolio site. A React frontend pulls skills, education, and work history from an Express REST API and presents them in a React-Bootstrap carousel. Uses a custom `useFetchData` hook to keep data-fetching modular.

**Stack:** React · React-Bootstrap · Node/Express · REST API

### User Query App — [`MongodbProject/`](MongodbProject/)
A React frontend over an Express and MongoDB backend for querying and displaying user records, built to practice wiring a React client to a Mongoose-backed API.

**Stack:** React · Node/Express · MongoDB/Mongoose

## Running a project

Each project is self-contained. The general pattern is the same across all of them:

```bash
# from inside a project's client/frontend folder
npm install
npm start

# and, for the projects with a backend, in a second terminal:
npm install
npm start
```

Check the individual project folder for its exact ports, environment variables, and any database setup. PharmacyProject has the most detailed instructions in its own README.

## Tech across these projects

React · React Router · React-Bootstrap · PrimeReact · Node.js · Express · MongoDB / Mongoose · JWT auth · REST APIs
