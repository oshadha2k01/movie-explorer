#  Movie Explorer

A feature-rich React application that allows users to discover trending movies, search for their favorite films, and manage their personalized watch lists.


## ✨ Features

- **User Authentication** - Securely log in and maintain user-specific data
- **Trending Movies** - Browse the latest trending movies (today/this week)
- **Search Functionality** - Find movies by title with real-time results
- **Advanced Filtering** - Filter movies by genre, year, and rating
- **Movie Details** - View comprehensive information about each movie
- **Favorites System** - Save and organize your favorite movies
- **Dark/Light Mode** - Toggle between theme preferences with automatic persistence
- **Responsive Design** - Optimized viewing experience across all devices

## 🛠️ Technologies

- **React** - UI library for building component-based interfaces
- **React Router** - Navigation and routing between different views
- **Context API** - State management for global application data
- **Material UI** - Component library for consistent, responsive design
- **Axios** - HTTP client for API requests
- **localStorage** - Client-side storage for user preferences and data
- **TMDb API** - Real-time movie data source

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
- **Movie Details**: `/movie/{movie_id}` - Retrieves comprehensive information about a specific movie

## 🖼️ Screenshots

*Add screenshots of your application here showcasing different features and views*

## 🌐 Live Demo

[View Live Demo](https://movie-explorer-omega-six.vercel.app/login) 

## 🔮 Future Enhancements

- User reviews and ratings
- Social sharing functionality
- Personalized movie recommendations
- Advanced search with cast/crew filtering

## 👤 Author

- Oshadha Pathiraja - [GitHub Profile](https://github.com/oshadha2k01)

## 🙏 Acknowledgements

- [The Movie Database (TMDb)](https://www.themoviedb.org/) for providing the API
- [Material-UI](https://mui.com/) for the component library
- All open-source libraries and tools used in this project
