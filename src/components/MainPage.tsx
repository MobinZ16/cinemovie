import React, {useState, useEffect, useCallback} from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { getPlaceholderImage, type MoviesOrsereisOrAnime, type UserData } from "../mockData";

interface MainPageProps {
   userName: string;
   userEmail: string;
   onLogout: () => void;
   loggedInUserId: number | null;
}

const MainPage: React.FC<MainPageProps> = ({ userName, userEmail, onLogout, loggedInUserId }) => {
    const navigate = useNavigate();

    const [featuredMovie, setFeaturedMovie] = useState<MoviesOrsereisOrAnime | null>(null);
    const [trendingContent, setTrendingContent] = useState<MoviesOrsereisOrAnime[]>([]);
    const [popularContent, setPopularContent] = useState<MoviesOrsereisOrAnime[]>([]);
    const [recentlyUpdatedMovies, setRecentlyUpdatedMovies] = useState<MoviesOrsereisOrAnime[]>([]);
    const [recentlyUpdatedSeries, setRecentlyUpdatedSeries] = useState<MoviesOrsereisOrAnime[]>([]);
    const [recentlyUpdatedAnime, setRecentlyUpdatedAnime] = useState<MoviesOrsereisOrAnime[]>([]);
    const [continueWatching, setContinueWatching] = useState<MoviesOrsereisOrAnime[]>([]);
    const [myWatchlist, setMyWatchlist] = useState<MoviesOrsereisOrAnime[]>([]);

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<MoviesOrsereisOrAnime[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const watchlistIds = new Set(myWatchlist.map(item => `${item.id}-${item.media_type}`));
    
    const fetchUserList = useCallback(async () => {
        if (loggedInUserId) {
            try {
                const WatchlistResponse = await axios.get(`http://127.0.0.1:5000/api/watchlist/${loggedInUserId}`);
                setMyWatchlist(WatchlistResponse.data.map((item: any) => ({
                    id: item.user,
                    media_type: item.media_type,
                title: item.title,
                thumbnail: item.thumbnail_url,
            })));
        } catch (err) {
            console.error("Failed to fetch user list:", err);
        } else {
            setMyWatchlist([]);
        }
    }
    }, [loggedInUserId]);

    useEffect(() => {
        const fetchMainData = async () => {
            setIsLoading(true);
            setSearchError(null);

            await fetchUserList();

            const trendingContentResponse = await axios.get('http://127.0.0.1:5000/api/trending');
            const mappedTrending: MoviesOrsereisOrAnime[] = trendingContentResponse.data.map((item: any) => ({
                id: String(item.id),
                title: item.title || item.name || 'N/A',
                thumbnail: getTmdbImageUrl(item.poster_path, 'w300', 300, 180),
                genre: mapGenreIdsToNames(item.genre_ids, item.media_type),
                year: new Date(item.release_date || item.first_air_date).getFullYear(),
                rating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : 0,
                description: item.media_type || 'No description available',
            }));
            setTrendingContent(mappedTrending.filter(item => item.year > 2024));

            const popularContentResponse = await axios.get('http://127.0.0.1:5000/api/popular');
            const mappedPopular: MoviesOrsereisOrAnime[] = popularContentResponse.data.map((item: any) => ({
                id: String(item.id),
                title: item.title || item.name || 'N/A',
                thumbnail: getTmdbImageUrl(item.poster_path, 'w300', 300, 180),
                genre: mapGenreIdsToNames(item.genre_ids, item.media_type),
                year: new Date(item.release_date || item.first_air_date).getFullYear(),
                rating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : 0,
                description: item.media_type || 'No description available',
            }));
            setPopularContent(mappedPopular.filter(item => item.year > 0));

            const recentlyUpdatedMovieResponse = await axios.get('http://127.0.0.1:5000/api/recently_updated');
            const mappedRecentlyUpdatedMovies: MoviesOrsereisOrAnime[] = recentlyUpdatedMovieResponse.data.map((item: any) => ({
                id: String(item.id),
                title: item.title || item.name || 'N/A',
                thumbnail: getTmdbImageUrl(item.poster_path, 'w300', 300, 180),
                genre: mapGenreIdsToNames(item.genre_ids, item.media_type),
                year: new Date(item.release_date || item.first_air_date).getFullYear(),
                rating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : 0,
                description: item.media_type || 'No description available',
                media_type: 'movie',
            }));
            setRecentlyUpdatedMovies(mappedRecentlyUpdatedMovies.filter(item => item.year >= 2025));

            const recentlyUpdatedSerieResponse = await axios.get('http://127.0.0.1:5000/api/recently_updated');
            const mappedRecentlyUpdateSeries: MoviesOrsereisOrAnime[] = recentlyUpdatedSerieResponse.data.map((item: any) => ({
                id: String(item.id),
                title: item.title || item.name || "N/A",
                thumbnail: getTmdbImageUrl(item.poster_path, 'w300', 300, 180),
                genre: mapGenreIdsToNames(item.genre_ids, item.media_type),
                year: new Date(item.release_date || item.first_air_date).getFullYear(),
                rating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : 0,
                description: item.media_type || "No description available",
                media_type: 'series',
            }));
            setRecentlyUpdatedSeries(mappedRecentlyUpdateSeries.filter(item => item.year >= 2025));
            const recentlyUpdatedAnimeResponse = await axios.get('http://127.0.0.1:5000/api/recently_updated');
            const mappedRecentlyUpdatedAnime: MoviesOrsereisOrAnime[] = recentlyUpdatedAnimeResponse.data.map((item: any) => ({
                id: String(item.id),
                title: item.title || item.name || "N/A",
                thumbnail: getTmdbImageUrl(item.poster_path, 'w300', 300, 180),
                genre: mapGenreIdsToNames(item.genre_ids, item.media_type),
                year: new Date(item.release_date || item.first_air_date).getFullYear(),
                rating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : 0,
                description: item.media_type || "No description available",
                media_type: 'anime',
            }));
            setRecentlyUpdatedAnime(mappedRecentlyUpdatedAnime.filter(item => item.year >= 2025));

            if (mappedTrending.length > 0) {
                const featured = mappedTrending[0];
                const featuredDetailResponse = await axios.get(`http://127.0.0.1:5000/api/details/${featured.id}`);
                const featuredDetail = featuredDetailResponse.data;
                setFeaturedMovie({
                    id: String(featuredDetail.id),
                    title: featuredDetail.title || featuredDetail.name || 'N/A',
                    thumbnail: getTmdbImageUrl(featuredDetail.poster_path, 'w300', 300, 180),
                    genre: mapGenreIdsToNames(featuredDetail.genre_ids, featuredDetail.media_type),
                    year: new Date(featuredDetail.release_date || featuredDetail.first_air_date).getFullYear(),
                    rating: featuredDetail.vote_average ? parseFloat(featuredDetail.vote_average.toFixed(1)) : 0,
                    description: featuredDetail.media_type || 'خلاصه داستانی موجود نیست',
                    media_type: featured.media_type,
                });
            }
        };

        fetchMainData();
    }, [fetchUserList]);

    return (
        <div>
            <h1>Welcome, {userName}!</h1>
            <button onClick={onLogout}>Logout</button>

            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            <h2>Trending Content</h2>
            <ul>
                {trendingContent.map(item => (
                    <li key={item.id}>
                        <h3>{item.title}</h3>
                        <img src={item.thumbnail} alt={item.title} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MainPage;
