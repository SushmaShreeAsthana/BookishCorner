import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { BookOpen, FolderOpen, Plus, Trash2, ArrowLeft, Loader } from 'lucide-react';

export default function MyBooksPage() {
  const [shelves, setShelves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShelf, setSelectedShelf] = useState(null);
  const [shelfBooks, setShelfBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newShelfName, setNewShelfName] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchShelves();
  }, []);

  const fetchShelves = () => {
    setLoading(true);
    client.get('/shelves/')
      .then((res) => {
        setShelves(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSelectShelf = (shelf) => {
    setSelectedShelf(shelf);
    setBooksLoading(true);
    client.get(`/shelves/${shelf.id}/books/`)
      .then((res) => {
        setShelfBooks(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setBooksLoading(false);
      });
  };

  const handleCreateShelf = async (e) => {
    e.preventDefault();
    if (!newShelfName.trim()) return;

    setCreateLoading(true);
    try {
      await client.post('/shelves/', { name: newShelfName });
      setNewShelfName('');
      setShowCreateModal(false);
      fetchShelves();
    } catch (err) {
      console.error(err);
      alert('Could not create shelf. Make sure the name is unique.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleRemoveBook = async (bookId, e) => {
    e.stopPropagation(); // Avoid navigating
    if (!confirm('Are you sure you want to remove this book from the shelf?')) return;

    try {
      await client.delete(`/shelves/${selectedShelf.id}/books/${bookId}/`);
      // Update local books list
      setShelfBooks(shelfBooks.filter((sb) => sb.book.open_library_id !== bookId));
      
      // Update shelves list count in background
      client.get('/shelves/').then((res) => setShelves(res.data));
    } catch (err) {
      console.error(err);
      alert('Could not remove the book.');
    }
  };

  if (loading && shelves.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-nettle animate-pulse">
        <BookOpen className="w-12 h-12 mb-3" />
        <p className="font-handwriting text-xl">Dusting off the bookshelves...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Detail Shelf View */}
      {selectedShelf ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-specialOps/20 pb-4">
            <button
              onClick={() => setSelectedShelf(null)}
              className="inline-flex items-center gap-1.5 text-specialOps hover:text-nettle transition font-semibold text-sm self-start"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Shelves</span>
            </button>
            <div className="flex items-baseline gap-2">
              <h2 className="font-serif text-3xl font-extrabold text-nettle">{selectedShelf.name}</h2>
              <span className="text-sm font-semibold text-specialOps">({shelfBooks.length} books)</span>
            </div>
          </div>

          {booksLoading ? (
            <div className="py-12 flex justify-center text-nettle">
              <Loader className="w-8 h-8 animate-spin" />
            </div>
          ) : shelfBooks.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {shelfBooks.map((sb) => (
                <div
                  key={sb.id}
                  onClick={() => navigate(`/book/${sb.book.open_library_id}`)}
                  className="flex gap-4 p-4 bg-cream/40 border border-specialOps/15 hover:border-specialOps/40 rounded-2xl shadow-cozy hover:shadow-cozyActive cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 relative group"
                >
                  <div className="w-20 h-28 shrink-0 rounded-xl overflow-hidden bg-rejuvenate/30 border border-specialOps/10 relative shadow-sm">
                    {sb.book.cover_url ? (
                      <img
                        src={sb.book.cover_url}
                        alt={sb.book.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-rejuvenate/20">
                        <BookOpen className="w-5 h-5 text-specialOps/65 mb-1" />
                        <span className="text-[9px] font-serif font-bold text-nettle line-clamp-2">{sb.book.title}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                    <div>
                      <h4 className="font-serif font-bold text-nettle text-base line-clamp-2 pr-6">
                        {sb.book.title}
                      </h4>
                      <p className="text-xs text-specialOps font-semibold truncate mt-0.5">
                        {sb.book.author}
                      </p>
                    </div>

                    <button
                      onClick={(e) => handleRemoveBook(sb.book.open_library_id, e)}
                      className="absolute top-4 right-4 p-1.5 rounded-lg text-specialOps hover:text-red-700 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Remove from Shelf"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <p className="text-[10px] text-specialOps/60 mt-2 font-medium">
                      Added {new Date(sb.added_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-16 max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-rejuvenate/15 border border-specialOps/20 flex items-center justify-center text-specialOps/60 shadow-inner">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-nettle">No Books on this Shelf</h4>
                <p className="text-sm text-specialOps mt-1 leading-relaxed">
                  Go to search to discover books and add them to this shelf.
                </p>
              </div>
              <button
                onClick={() => navigate('/search')}
                className="px-5 py-2.5 bg-nettle hover:bg-darkestForest text-cream font-bold rounded-xl shadow-sm transition"
              >
                Search Books
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Shelves List View */
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-specialOps/20 pb-4">
            <h2 className="font-serif text-3xl font-extrabold text-nettle flex items-center gap-2">
              <FolderOpen className="w-8 h-8 text-deathworldForest" />
              <span>My Bookshelves</span>
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 bg-nettle hover:bg-darkestForest text-cream font-bold rounded-xl shadow-sm transition flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Shelf</span>
            </button>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {shelves.map((shelf) => (
              <div
                key={shelf.id}
                onClick={() => handleSelectShelf(shelf)}
                className="bg-cream/40 border border-specialOps/20 hover:border-specialOps/50 rounded-3xl p-6 shadow-cozy hover:shadow-cozyActive cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 flex flex-col justify-between h-48 relative"
              >
                {/* Decorative Tape effect */}
                <div className="absolute -top-3 left-6 w-16 h-5 bg-rejuvenate/30 border border-specialOps/15 opacity-60 transform -rotate-2"></div>
                
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-bold text-nettle truncate">{shelf.name}</h3>
                  <p className="text-xs text-specialOps font-bold tracking-wide uppercase">
                    {shelf.book_count} {shelf.book_count === 1 ? 'book' : 'books'}
                  </p>
                </div>

                {/* Cover Thumbnails */}
                {shelf.covers && shelf.covers.length > 0 ? (
                  <div className="flex -space-x-4 overflow-hidden py-1">
                    {shelf.covers.map((coverUrl, idx) => (
                      <div
                        key={idx}
                        className="inline-block h-16 w-12 rounded-lg border-2 border-cream object-cover overflow-hidden bg-rejuvenate/40 shadow-sm"
                      >
                        <img src={coverUrl} alt="Cover" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-16 flex items-center text-xs text-specialOps/70 italic">
                    Empty shelf
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Shelf Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-darkestForest/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateShelf}
            className="bg-cream border-2 border-specialOps/40 max-w-sm w-full rounded-3xl p-6 shadow-cozyActive relative"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-rejuvenate/50 border border-specialOps/30 opacity-80 transform -rotate-1"></div>
            
            <h3 className="font-serif text-2xl font-bold text-nettle mb-1">New Bookshelf</h3>
            <p className="text-xs text-specialOps font-medium mb-4">Create a custom collection for your stories</p>

            <div className="mb-5">
              <label className="block text-xs font-bold text-nettle uppercase tracking-wider mb-1.5">
                Shelf Name
              </label>
              <input
                type="text"
                placeholder="e.g. Cozy Winter Reads, High Fantasy"
                value={newShelfName}
                onChange={(e) => setNewShelfName(e.target.value)}
                required
                maxLength={50}
                className="w-full px-4 py-3 bg-cream border border-specialOps/30 focus:border-nettle rounded-2xl outline-none transition text-sm text-pepper font-medium"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 bg-rejuvenate/30 hover:bg-rejuvenate/50 text-nettle font-bold rounded-2xl transition border border-specialOps/20"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createLoading}
                className="flex-1 py-3 bg-nettle hover:bg-darkestForest disabled:bg-nettle/60 text-cream font-bold rounded-2xl transition shadow-sm flex items-center justify-center gap-1.5"
              >
                {createLoading ? (
                  <div className="w-5 h-5 border-2 border-cream border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Create Shelf'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
