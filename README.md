# Little Tools

A collection of simple, customizable, and embeddable web-based tools. This application provides a user-friendly interface to configure various widgets and open them in separate windows, making them easy to use for presentations, streams, or personal dashboards.

## Features

This project includes the following tools:

- **Clock**: Display the current time in either digital or analog format, with timezone support.
- **Countdown Timer**: A simple timer that counts down from a specified time and displays a message when finished.
- **Text Display**: Show a custom piece of text.
- **Spinning Wheel**: A decision-making wheel that can be populated with a list of items.
- **Ladder Game**: A game of chance where players at the top descend to a random result at the bottom.
- **Weather Widget**: Shows the current weather for a specified location (requires an OpenWeatherMap API key).

## How to Use

1.  **Configure Tools**: The main page serves as a settings dashboard. On the left panel, you can find tabs for each tool and a "General" tab for global style settings.
2.  **Live Preview**: As you change the settings, you can see a live preview of each tool on the right side of the dashboard.
3.  **Profile Management**: You can save your configurations into different profiles. This allows you to easily switch between different sets of styles and settings. You can create, save, rename, and delete profiles.
4.  **Open in New Window**: Each tool's preview card has an "Open" button. Clicking this will open the tool in a new browser tab with the currently configured settings. The URL of the new tab is self-contained, so you can bookmark it or share it.

## Development

This is a SvelteKit project. To get started with development:

1.  **Install dependencies**:
    ```bash
    npm install
    # or pnpm install or yarn
    ```
2.  **Start the development server**:

    ```bash
    npm run dev
    ```

    This will start the development server, and you can view the application in your browser, usually at `http://localhost:5173`.

3.  **Build for production**:
    ```bash
    npm run build
    ```
    This will create a production-ready version of the application.

## Configuration

Some components may require API keys to function correctly:

- **Weather Widget**: This tool requires an API key from [OpenWeatherMap](https://openweathermap.org/api).
- **Google Fonts**: If you use many different fonts, you may want to get a Google Fonts API key to avoid rate limiting.

These keys can be entered in the settings panel.
