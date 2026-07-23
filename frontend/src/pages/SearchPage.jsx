import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { BookOpen, Compass, Search } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);
    
    try {
      const response = await client.get(`/books/search/`, { params: { q: query } });
      setResults(response.data);
    } catch (err) {
      console.error(err);
      setError('A storm blew away our carrier pigeon. Please check your connection and search again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (book) => {
    navigate(`/book/${book.open_library_id}`, {
      state: {
        title: book.title,
        author: book.author,
        cover_url: book.cover_url
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="font-serif text-3xl font-extrabold text-nettle flex items-center gap-2">
          <Compass className="w-8 h-8 text-deathworldForest" />
          <span>Discover New Stories</span>
        </h2>
        <p className="text-sm text-specialOps font-medium">Search millions of books on the Open Library database</p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-specialOps" />
          <input
            type="text"
            placeholder="Search by title, author, or subject..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-cream border-2 border-specialOps/30 focus:border-nettle rounded-2xl outline-none transition text-sm text-pepper font-medium shadow-sm focus:shadow"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3.5 bg-nettle hover:bg-darkestForest text-cream font-bold rounded-2xl transition duration-300 shadow-sm shrink-0"
        >
          Search
        </button>
      </form>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-sm max-w-2xl">
          {error}
        </div>
      )}

      {/* Loading Skeleton state */}
      {loading && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex gap-4 p-4 bg-cream/40 border border-specialOps/15 rounded-2xl animate-pulse">
              <div className="w-20 h-28 bg-rejuvenate/25 rounded-xl shrink-0"></div>
              <div className="flex-1 space-y-2.5 py-1">
                <div className="h-4 bg-rejuvenate/25 rounded w-5/6"></div>
                <div className="h-3 bg-rejuvenate/25 rounded w-1/2"></div>
                <div className="h-3 bg-rejuvenate/25 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results grid */}
      {!loading && searched && (
        <>
          {results.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {results.map((book) => (
                <div
                  key={book.open_library_id}
                  onClick={() => handleBookClick(book)}
                  className="flex gap-4 p-4 bg-cream/40 border border-specialOps/15 hover:border-specialOps/40 rounded-2xl shadow-cozy hover:shadow-cozyActive cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <div className="w-20 h-28 shrink-0 rounded-xl overflow-hidden bg-rejuvenate/30 border border-specialOps/10 relative shadow-sm">
                    {book.cover_url ? (
                      <img
                        src={book.cover_url}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-rejuvenate/20">
                        <BookOpen className="w-5 h-5 text-specialOps/65 mb-1" />
                        <span className="text-[9px] font-serif font-bold text-nettle line-clamp-2">{book.title}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between py-1 overflow-hidden">
                    <div>
                      <h4 className="font-serif font-bold text-nettle text-base line-clamp-2 hover:text-darkestForest transition">
                        {book.title}
                      </h4>
                      <p className="text-xs text-specialOps font-semibold truncate mt-0.5">
                        {book.author}
                      </p>
                      {book.publish_year && (
                        <p className="text-[10px] text-specialOps/80 font-bold mt-0.5">
                          Published: {book.publish_year}
                        </p>
                      )}
                    </div>

                    {/* Sticker style subjects */}
                    {book.genres && book.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {book.genres.slice(0, 2).map((genre, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-bold uppercase tracking-wider bg-rejuvenate/30 text-deathworldForest px-2 py-0.5 rounded-full border border-specialOps/20 sticker-badge truncate max-w-[80px]"
                            title={genre}
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-12 max-w-md mx-auto space-y-3">
              <BookOpen className="w-12 h-12 text-specialOps/50" />
              <h4 className="font-serif text-lg font-bold text-nettle">No Books Found</h4>
              <p className="text-sm text-specialOps">
                We couldn't find any books matching "{query}". Try checking the spelling or using broader keywords.
              </p>
            </div>
          )}
        </>
      )}

      {/* Initial state placeholder */}
      {!searched && !loading && (
        <div className="flex flex-col items-center justify-center text-center p-16 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-rejuvenate/15 border border-specialOps/20 flex items-center justify-center text-specialOps/60 shadow-inner">
            <Search className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-serif text-lg font-bold text-nettle">Start Exploring</h4>
            <p className="text-sm text-specialOps mt-1 leading-relaxed">
              Find your next favorite story by searching titles, authors, or literary subjects.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
