# Movie Explorer

A feature-rich React application that allows users to discover trending movies, search for their favorite films, and manage their personalized watch lists.

## ✨ Features

- **User Authentication** 
  - Secure registration with real-time field validation
  - Email/username format detection and validation
  - Login with credentials persistence

- **Trending Movies** 
  - Browse latest trending movies (today/this week)
  - "Load More" functionality for better user experience

- **Search Functionality** 
  - Real-time search as you type
  - Search history tracking per user
  - Advanced filtering options

- **Movie Details** 
  - Comprehensive movie information display
  - Watch trailers in a modal popup
  - View cast information and production details
  - Budget and revenue statistics

- **Favorites System** 
  - User-specific favorites collection
  - One-click add/remove from any movie card

- **Dark/Light Mode** 
  - Toggle between theme preferences
  - Automatic theme persistence
  - Optimized contrast for both modes

- **Responsive Design** 
  - Adaptive layout for mobile, tablet and desktop
  - Touch-friendly interface elements
  - Collapsible navigation on smaller screens

## 🛠️ Technologies

- **React** - UI library for building component-based interfaces
- **React Router** - Navigation and routing between different views
- **Context API** - State management for global application data
- **Material UI** - Component library for consistent, responsive design
- **Axios** - HTTP client for API requests
- **localStorage** - Client-side storage for user preferences and data
- **TMDb API** - Real-time movie data source
- **React Toastify** - Notification system for user feedback

## 📋 Prerequisites

- Node.js (v14.0.0 or higher)
- NPM or Yarn
- TMDb API key (get one from [The Movie Database](https://www.themoviedb.org/documentation/api))

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/movie-explorer.git
   cd movie-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   - Create a `.env` file in the root directory
   - Add your TMDb API key:
     ```
     REACT_APP_TMDB_API_KEY=your_api_key_here
     ```

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3000`

## 🔑 API Usage

This project uses the [TMDb API](https://developers.themoviedb.org/3) to fetch movie data:

- **Trending Movies**: `/trending/movie/{time_window}` - Gets daily or weekly trending movies
- **Search**: `/search/movie` - Searches for movies by title with optional filters
- **Movie Details**: `/movie/{movie_id}` - Retrieves comprehensive information about a specific movie including videos and cast

## 🌟 Recent Updates

- **Enhanced Authentication**
  - Improved form validation with real-time feedback
  - Special character restriction for usernames
  - Email format detection and validation
  
- **Improved Search Experience**
  - User-specific recent searches
  - Enhanced UI with visual feedback

- **UI/UX Enhancements**
  - Movie card redesign with better visibility in dark mode
  - Modal trailer viewing
  - Improved button styles with hover effects
  - Gradient backgrounds and modern UI elements

- **Performance Optimization**
  - Load more button instead of infinite scroll
  - User-specific data segregation
  - Debounced search functionality

## 🌐 Live Demo

[View Live Demo](https://movie-explorer-omega-six.vercel.app/login) 

## 🔮 Future Enhancements

- User reviews and ratings
- Social sharing functionality
- Personalized movie recommendations
- Advanced search with cast/crew filtering
- Watch history tracking
- Multi-language support
- Offline capability with PWA features

## 👤 Author

- Oshadha Pathiraja - [GitHub Profile](https://github.com/oshadha2k01)

## 🙏 Acknowledgements

- [The Movie Database (TMDb)](https://www.themoviedb.org/) for providing the API
- [Material-UI](https://mui.com/) for the component library
- [React Toastify](https://fkhadra.github.io/react-toastify/) for notification system
- All open-source libraries and tools used in this project
