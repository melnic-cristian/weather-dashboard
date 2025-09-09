# Weather Dashboard

Weather Dashboard is a modern Angular application for visualizing historical temperature data. Create beautiful interactive charts showing daily min/max temperatures across different locations and time periods. Built with Angular 20+ and Chart.js for smooth performance and responsive design.

## Angular Example

This demo shows how to implement a complete weather data visualization system using Angular, Chart.js, and the Open-Meteo API. The goal is to demonstrate modern Angular patterns including HTTP interceptors, modular architecture, and reactive programming with minimal complexity. The application features a clean interface where users can select different cities worldwide and view historical temperature trends over customizable time periods (7, 14, 30, or 90 days). The chart updates dynamically with smooth animations and custom interactive tooltips.

This example uses Angular's latest features including standalone components support, modern HTTP client with interceptors, and TypeScript strict mode. It also contains proper error handling, loading states, and responsive design patterns to get you started with production-ready Angular applications.

The dashboard supports real-time data fetching with comprehensive error handling!

## Styling & Conventions

- **BEM (Block Element Modifier)**:  
  To maintain clean, scalable, and maintainable CSS, the project follows the [BEM methodology](https://getbem.com/).  
  Examples:
  - `.app` → Block
  - `.app__footer` → Element
  - `.app__footer-text` → Modifier/extended element

- **Responsive SCSS**:  
  Utility variables are defined in a central place, using CSS variables and SCSS nesting for consistency.

- **Theme Variables**:  
  Colors are extracted into CSS variables.

## How to run it locally

1. Download or clone the repository to your local machine:

```bash
$ git clone https://github.com/melnic-cristian/weather-dashboard.git
```

2. Run `npm install` inside the downloaded/cloned folder:

```bash
$ npm install
```

3. Start the dev server by running the command below. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

```bash
$ ng serve
```

## Key Features

- **Interactive Charts**: Real-time temperature visualization with Chart.js
- **Multiple Locations**: Pre-configured cities worldwide (New York, London, Tokyo, etc.)
- **Flexible Time Ranges**: View 7, 14, 30, or 90 days of historical data
- **HTTP Interceptors**: Automatic request logging with custom headers
- **Error Handling**: Comprehensive error states with retry functionality
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Loading States**: Smooth animations during API calls
- **Modular Architecture**: Core, Shared, and Feature modules

## Tech Stack

- **Angular 20+** - Latest framework features
- **Chart.js** - Interactive data visualization
- **TypeScript** - Type-safe development
- **Open-Meteo API** - Free historical weather data
- **CSS3** - Modern responsive styling

## Documentation

For more information about the technologies used:
- [Angular Documentation](https://angular.dev)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [Open-Meteo API](https://open-meteo.com/en/docs/historical-weather-api)
