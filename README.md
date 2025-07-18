# Geolocation 🌍

**Geolocation** is a website that allows users to find their current city or search for any city to get real-time weather information, using data from the OpenWeather API. Users can also subscribe to receive daily weather updates at 7:00 AM.

## Features

- **City Search**: Find your location or search for a city worldwide to see the current weather.
- **Real-Time Weather Updates**: Get up-to-date weather information with details on temperature, humidity, wind speed, and more.
- **Daily Weather Email Subscription**: Users can subscribe to receive daily weather updates for their chosen city at 7:00 AM.
![Untitled Diagram drawio (2)](https://github.com/user-attachments/assets/57947b73-7272-4c28-a970-15e2f717fa64)

*Diagram 1: Workflow showing how the system handles a user's first-time subscription for daily weather updates.*

![Push Notification Flow](https://github.com/user-attachments/assets/bbbd41ca-4c33-483e-b289-4f1b5a5cd597)

*Diagram 2: Process flow of how the browser requests an FCM token, registers a service worker, and receives push notifications via Firebase Cloud Messaging (FCM).*


## Table of Contents

- [Getting Started](#getting-started)

## Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **NPM** or **Yarn**

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/luuphuphat69/geolocation.git
   
2. **Navigate to the Project Directory**:

   ```bash
   cd geolocation
   
3. **Install Dependencies**:

   ```bash
   npm install

4. **Run the Server**:

   ```bash
   cd server
   npm start
