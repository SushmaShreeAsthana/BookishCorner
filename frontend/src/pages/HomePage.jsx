import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Coffee, Flame, Heart, Sparkles } from 'lucide-react';

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    // Navigate and pass state as fallback data for get-or-create details on the backend
    navigate(`/book/${book.open_library_id}`, {
      state: {
        title: book.title,
        author: book.author,
        cover_url: book.cover_url
      }
    });
  };

  return (
    <div 
      onClick={handleCardClick}
      className="flex-shrink-0 w-36 sm:w-40 cursor-pointer group"
    >
      <div className="relative rounded-2xl overflow-hidden shadow-cozy hover:shadow-cozyActive transition-all duration-300 transform group-hover:-translate-y-1 aspect-[2/3] bg-rejuvenate/30 border border-specialOps/10">
        {book.cover_url ? (
          <img 
            src={book.cover_url} 
            alt={book.title} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-rejuvenate/20 text-center">
            <BookOpen className="w-8 h-8 text-specialOps/70 mb-2" />
            <span className="text-xs font-serif font-bold text-nettle line-clamp-3">{book.title}</span>
          </div>
        )}
      </div>
      <div className="mt-3">
        <h4 className="font-serif font-bold text-sm text-nettle truncate group-hover:text-darkestForest transition">
          {book.title}
        </h4>
        <p className="text-xs text-specialOps font-semibold truncate mt-0.5">
          {book.author}
        </p>
        
        {/* Subjects as stickers */}
        {book.genres && book.genres.length > 0 && (
          <div className="flex gap-1 mt-1.5 overflow-hidden">
            <span className="text-[9px] font-bold uppercase tracking-wider bg-cream text-deathworldForest px-1.5 py-0.5 rounded-full border border-specialOps/20 sticker-badge truncate">
              {book.genres[0]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const ShelfRowSkeleton = () => (
  <div className="flex gap-5 overflow-x-auto pb-4 hide-scrollbar">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="flex-shrink-0 w-36 sm:w-40 animate-pulse">
        <div className="aspect-[2/3] bg-rejuvenate/25 rounded-2xl border border-specialOps/10"></div>
        <div className="mt-3 space-y-2">
          <div className="h-4 bg-rejuvenate/25 rounded w-3/4"></div>
          <div className="h-3 bg-rejuvenate/25 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function HomePage() {
  const { user } = useAuth();
  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    client.get('/home/feed/')
      .then((res) => {
        setFeed(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError('Could not retrieve your cozy feed. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-10">
      {/* Welcome Greeting Banner */}
      <div className="torn-paper p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-extrabold text-nettle">
            {getGreeting()}, {user?.display_name || user?.username || 'Reader'}
          </h2>
          <p className="text-sm text-pepper/80 max-w-md leading-relaxed">
            Pour yourself a warm cup of chamomile tea, settle into your favorite armchair, and find your next story.
          </p>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-center bg-cream/80 p-3 rounded-xl border border-specialOps/20 shadow-sm">
          <Coffee className="w-6 h-6 text-deathworldForest" />
          <span className="text-xs font-bold text-nettle tracking-wider uppercase">Happy Reading!</span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-sm">
          {error}
        </div>
      )}

      {/* Rows of Books */}
      <div className="space-y-8">
        {/* Row 1: Latest Releases */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-specialOps/15 pb-2">
            <Sparkles className="w-5 h-5 text-deathworldForest" />
            <h3 className="font-serif text-2xl font-bold text-nettle">Latest Releases</h3>
          </div>
          {loading ? (
            <ShelfRowSkeleton />
          ) : feed?.latest_releases?.length > 0 ? (
            <div className="flex gap-5 overflow-x-auto pb-4 hide-scrollbar">
              {feed.latest_releases.map((book) => (
                <BookCard key={book.open_library_id} book={book} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-specialOps italic">No new releases found at this time.</p>
          )}
        </section>

        {/* Row 2: BookTok Sensations */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-specialOps/15 pb-2">
            <Flame className="w-5 h-5 text-deathworldForest" />
            <h3 className="font-serif text-2xl font-bold text-nettle">BookTok Sensations</h3>
          </div>
          {loading ? (
            <ShelfRowSkeleton />
          ) : feed?.booktok_sensations?.length > 0 ? (
            <div className="flex gap-5 overflow-x-auto pb-4 hide-scrollbar">
              {feed.booktok_sensations.map((book) => (
                <BookCard key={book.open_library_id} book={book} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-specialOps italic">No trending books found at this time.</p>
          )}
        </section>

        {/* Row 3: You Would Like */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-specialOps/15 pb-2">
            <Heart className="w-5 h-5 text-deathworldForest" />
            <h3 className="font-serif text-2xl font-bold text-nettle">You Would Like</h3>
          </div>
          {loading ? (
            <ShelfRowSkeleton />
          ) : feed?.you_would_like?.length > 0 ? (
            <div className="flex gap-5 overflow-x-auto pb-4 hide-scrollbar">
              {feed.you_would_like.map((book) => (
                <BookCard key={book.open_library_id} book={book} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-specialOps italic">No recommendations found.</p>
          )}
        </section>
      </div>
    </div>
  );
}
