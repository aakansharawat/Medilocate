# MediLocate

MediLocate is a web application designed to help users find the nearest pharmacy that has a specific medicine available in stock. The application provides a user-friendly interface for searching medicines and viewing pharmacy details.

## Features

- Search for medicines by name.
- View a list of nearby pharmacies that have the requested medicine in stock.
- Detailed information about each pharmacy, including address and available medicines.
- Responsive design for optimal viewing on various devices.

## Technologies Used

- React: A JavaScript library for building user interfaces.
- TypeScript: A typed superset of JavaScript that compiles to plain JavaScript.
- Axios: A promise-based HTTP client for making API requests.
- CSS: For styling the application.

## Project Structure

```
MediLocate-frontend
├── public
│   └── index.html
├── src
│   ├── components
│   │   ├── Header.tsx
│   │   ├── PharmacyList.tsx
│   │   ├── SearchBar.tsx
│   │   └── MedicineDetails.tsx
│   ├── pages
│   │   ├── Home.tsx
│   │   └── Pharmacy.tsx
│   ├── services
│   │   └── api.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── types
│       └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd MediLocate-frontend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the development server:
   ```
   npm start
   ```

2. Open your browser and go to `http://localhost:3000` to view the application.

## API Integration

The application interacts with a backend API to fetch pharmacy and medicine data. Ensure that the backend server is running and accessible.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.