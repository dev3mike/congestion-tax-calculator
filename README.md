# Congestion Tax Calculator

## Introduction
This is a code assignment from a Swedish company to develop an application for calculating congestion tax in Gothenburg.

## Assignment Goals
- **Implement an Entry Point:** Add a method for calculation calls with different inputs, using HTTP.
- **Bug Fixing and Refactoring:** Address existing bugs and improve code structure and organization.

## Technology Stack
The project uses Node.js, Express, Jest, Babel, and TypeScript. 

## Congestion Tax Rules in Gothenburg
- Taxes apply during specific hours for vehicles entering or exiting Gothenburg, with a daily maximum of 60 SEK per vehicle.
- Exemptions include weekends, public holidays, the day before a public holiday, and July.
- A single charge rule applies, billing the highest toll when passing multiple stations within 60 minutes.