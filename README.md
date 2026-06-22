# PortfolioReact
React/Node.js applications
---
**About Gurpy's Pharmacy Project**

---

# Online Pharmacy Simulation - React Portfolio Project

## Overview
This React-based project simulates an online pharmacy, offering a sophisticated, interactive experience for managing pharmacy operations. The application boasts a modern web development approach, emphasizing responsive design and intuitive user interfaces.

## Getting Started
### Prerequisites
- Node.js
- npm (Node Package Manager)

### Installation
1. Clone the repository:
   ```
   git clone [repository-url]
   ```
2. Navigate to the project directory:
   ```
   cd PortfolioReact-main/PharmacyProject
   ```
3. Install dependencies for the server:
   ```
   npm install
   ```
4. Navigate to the client directory and install dependencies:
   ```
   cd client/gurpypharmacy
   npm install
   ```
5. Start the server:
   ```
   npm start
   ```
   This will run the backend server on a default port.

6. In a new terminal, start the React application:
   ```
   npm start
   ```
   This will launch the application in your default web browser.

## Features
- **User Authentication**: A secure system for user login and registration.
- **Patient Management**: Comprehensive tools for adding, viewing, and managing patient records.
- **Medication Management**: A detailed module for maintaining a list of medications, including adding and managing medication details.
- **Interactive Dashboard**: A central hub for easy navigation and a quick overview of operations.
- **Pharmacist View**: A dedicated interface for pharmacists to manage prescriptions and patient information.
- **Administration Panel**: For managing administrative tasks and operations within the pharmacy.

## Project Structure
The application is structured into several key directories:
- **Pages Directory**: Contains React components for different pages such as `dashboard.js`, `patientList.js`, and `medicationList.js`.
- **Components**: Modular React components like `navBar.js` and `notificationPane.js` for reusable elements.
- **Images**: A repository of visual assets used across the application.

## Usage
- After logging in, users navigate through the application via the navigation bar.
- The dashboard provides a central place for monitoring and managing pharmacy activities.
- Manage patient and medication records through dedicated sections in the application.



## Contributing
Guidelines for contributing to this project include:
1. Forking the repository.
2. Creating a feature branch.
3. Committing and pushing changes.
4. Opening a Pull Request.

---
**About GurpreetKaurResume project**

This project is a web-based resume application developed using React.js for the frontend and Express.js for the backend. The application serves as a dynamic portfolio, showcasing the user's skills, education, and work history. Data is fetched from the Express.js server via RESTful API calls and presented in a visually engaging Carousel interface designed with React-Bootstrap.

**Key Features:**
 - **Dynamic Data Fetching**: The application uses RESTful API calls to fetch real-time data from the server, allowing for easy updates to the resume details.
 - **Reusable Components**: The frontend incorporates reusable components such as DataList, which takes care of rendering lists of data, thereby making the application easily extendable.
 - **Custom Hooks**: A custom React hook, UseFetchData, is utilized for fetching data from the server, providing a cleaner and more modular approach to data management.
 - **Stylish UI**: React-Bootstrap's Carousel component is used to add a touch of dynamism to the resume, making it more engaging to navigate through the user's skills, education, and work history.
 - **Responsive Design**: The application is built using Bootstrap, making it fully responsive and mobile-friendly.
 - **Error Handling**: The application handles errors gracefully by capturing them during the data-fetching process, thereby enhancing the user experience.
 - **CORS Support**: CORS is configured properly to enable secure communication between the frontend and the backend
