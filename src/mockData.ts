export interface MoviesOrsereisOrAnime{
    id: string;
    title: string;
    thumbnail: string;
    poster?: string;
    progress?: number;
    genres?: string[];
    genres_ids?: string[];
    year: string;
    rating: number;
    description?: string;
    director?: string;
    cast?: string[];
    episodes?: number;
    season?: number;
    media_type: 'movie' | 'series' | 'anime';
}

export interface UserData{
    userId: string;
    userName: string;
    userEmail: string;
    userProfilePicture?: string;
    watchlist: MoviesOrsereisOrAnime[];
    continueWatching: MoviesOrsereisOrAnime[];
    favorites: MoviesOrsereisOrAnime[];
    trending: MoviesOrsereisOrAnime[];
    popular: MoviesOrsereisOrAnime[];
    featuredMovies: MoviesOrsereisOrAnime[];
    recentlyUpdated: MoviesOrsereisOrAnime[];
}

export const getPlaceholderImage = (width: number, height: number, text: string = "No Image", bgColor: string = '000', textColor: string = 'fff') => 
  `https://placehold.co/${width}x${height}/${bgColor}/${textColor}?text=${text.replace(/ /g, '+')}`;

