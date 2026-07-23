import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import client from '../api/client';
import { BookOpen, Star, FolderPlus, ArrowLeft, Check, Plus, MessageSquare } from 'lucide-react';

export default function BookDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  
  // Try to load initial minimal state passed during navigation, to prevent empty page load
  const stateData = location.state || {};
  const [book, setBook] = useState(null);
  const [rating, setRating] = useState(0);
  const [shelves, setShelves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shelvesLoading, setShelvesLoading] = useState(true);
  const [showShelfModal, setShowShelfModal] = useState(false);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [notes, setNotes] = useState('');
  
  useEffect(() => {
    // 1. Fetch book details (hydrated with OL details and local cache)
    client.get(`/books/${id}/`, {
      params: {
        title: stateData.title,
        author: stateData.author,
        cover_url: stateData.cover_url
      }
    })
      .then((res) => {
        setBook(res.data);
      })
      .catch((err) => {
        console.error(err);
        // Fallback to state data if request fails
        setBook({
          open_library_id: id,
          title: stateData.title || 'Untitled Book',
          author: stateData.author || 'Unknown Author',
          cover_url: stateData.cover_url,
          description: 'Could not load details from Open Library.'
        });
      })
      .finally(() => {
        setLoading(false);
      });

    // 2. Fetch rating for this book
    client.get('/ratings/', { params: { open_library_id: id } })
      .then((res) => {
        if (res.data.length > 0) {
          setRating(res.data[0].stars);
        }
      })
      .catch((err) => console.error(err));

    // 3. Fetch user's shelves and check if book is present
    fetchShelves();
  }, [id]);

  const fetchShelves = () => {
    setShelvesLoading(true);
    client.get('/shelves/', { params: { open_library_id: id } })
      .then((res) => {
        setShelves(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setShelvesLoading(false);
      });
  };

  const handleRate = async (stars) => {
    setRatingSubmitting(true);
    try {
      const response = await client.post('/ratings/', {
        open_library_id: id,
        stars,
        title: book?.title,
        author: book?.author,
        cover_url: book?.cover_url
      });
      setRating(stars);
    } catch (err) {
      console.error(err);
      alert('Could not submit rating. Please try again.');
    } finally {
      setRatingSubmitting(false);
    }
  };

  const toggleShelfAssignment = async (shelf) => {
    try {
      if (shelf.has_book) {
        // Remove from shelf
        await client.delete(`/shelves/${shelf.id}/books/${id}/`);
      } else {
        // Add to shelf
        await client.post(`/shelves/${shelf.id}/books/`, {
          open_library_id: id,
          title: book?.title,
          author: book?.author,
          cover_url: book?.cover_url,
          description: book?.description,
          status_notes: notes
        });
      }
      // Refresh shelves state
      fetchShelves();
    } catch (err) {
      console.error(err);
      alert('Failed to update shelf assignments.');
    }
  };

  if (loading && !book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-nettle animate-pulse">
        <BookOpen className="w-12 h-12 mb-3" />
        <p className="font-handwriting text-xl">Opening the pages...</p>
      </div>
    );
  }

  // Determine current active shelves names
  const activeShelves = shelves.filter(s => s.has_book).map(s => s.name);

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Link to="/home" className="inline-flex items-center gap-1.5 text-specialOps hover:text-nettle transition font-semibold text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library</span>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Book Cover and Actions */}
        <div className="space-y-6 flex flex-col items-center md:items-stretch">
          <div className="relative aspect-[2/3] w-52 md:w-full bg-rejuvenate/30 border-2 border-specialOps/30 rounded-3xl overflow-hidden shadow-cozy">
            {book?.cover_url ? (
              <img 
                src={book.cover_url} 
                alt={book.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                <BookOpen className="w-16 h-16 text-specialOps/70 mb-3" />
                <span className="text-lg font-serif font-bold text-nettle">{book?.title}</span>
              </div>
            )}
          </div>

          {/* Shelves indicator and Edit button */}
          <div className="w-full space-y-3">
            <button
              onClick={() => setShowShelfModal(true)}
              className="w-full py-3.5 bg-nettle hover:bg-darkestForest text-cream font-bold rounded-2xl shadow-sm transition flex items-center justify-center gap-2.5"
            >
              <FolderPlus className="w-5 h-5" />
              <span>{activeShelves.length > 0 ? 'Edit Shelves' : 'Add to My Books'}</span>
            </button>

            {activeShelves.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                {activeShelves.map((shelfName, idx) => (
                  <span key={idx} className="text-[10px] font-bold uppercase tracking-wider bg-rejuvenate text-nettle px-2.5 py-1 rounded-full border border-specialOps/30 shadow-sm sticker-badge">
                    {shelfName}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Star Rating Section */}
          <div className="w-full p-5 bg-cream/50 rounded-2xl border border-specialOps/20 text-center">
            <p className="text-xs uppercase font-bold tracking-wider text-specialOps mb-2.5">Your Rating</p>
            <div className="flex justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  disabled={ratingSubmitting}
                  className="transition duration-150 transform hover:scale-110"
                >
                  <Star 
                    className={`w-8 h-8 ${
                      star <= rating 
                        ? 'text-yellow-600 fill-yellow-600' 
                        : 'text-specialOps/40 hover:text-yellow-600'
                    }`} 
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-xs text-specialOps font-semibold mt-2">You rated this {rating} stars</p>
            )}
          </div>
        </div>

        {/* Right Column: Book Details */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-nettle leading-tight">
              {book?.title}
            </h1>
            <p className="text-lg text-deathworldForest font-serif italic mt-1.5">
              by {book?.author}
            </p>
          </div>

          {/* Bio / Description */}
          <div className="space-y-3">
            <h3 className="font-serif text-xl font-bold text-nettle border-b border-specialOps/20 pb-1.5">Description</h3>
            <p className="text-sm text-pepper/85 leading-relaxed whitespace-pre-line font-serif">
              {book?.description || "No description is available for this title."}
            </p>
          </div>
        </div>
      </div>

      {/* Shelf Assignment Modal */}
      {showShelfModal && (
        <div className="fixed inset-0 bg-darkestForest/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-cream border-2 border-specialOps/40 max-w-sm w-full rounded-3xl p-6 shadow-cozyActive relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-rejuvenate/50 border border-specialOps/30 opacity-80 transform rotate-1"></div>
            
            <h3 className="font-serif text-2xl font-bold text-nettle mb-1">Shelve Book</h3>
            <p className="text-xs text-specialOps font-medium mb-4">Choose which shelves contain this story</p>

            {shelvesLoading ? (
              <div className="py-6 flex justify-center text-nettle">
                <div className="w-6 h-6 border-2 border-nettle border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto mb-6">
                {shelves.map((shelf) => (
                  <button
                    key={shelf.id}
                    onClick={() => toggleShelfAssignment(shelf)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left font-medium transition ${
                      shelf.has_book
                        ? 'bg-rejuvenate/30 border-nettle/40 text-nettle font-bold'
                        : 'bg-cream/20 border-specialOps/20 hover:bg-rejuvenate/15 text-pepper/80'
                    }`}
                  >
                    <span>{shelf.name}</span>
                    {shelf.has_book ? (
                      <div className="w-5 h-5 bg-nettle text-cream rounded-full flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 border border-specialOps/40 rounded-full flex items-center justify-center">
                        <Plus className="w-3 h-3 text-specialOps" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowShelfModal(false)}
              className="w-full py-3 bg-nettle hover:bg-darkestForest text-cream font-bold rounded-2xl transition shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
