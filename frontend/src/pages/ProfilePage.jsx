import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { User, Calendar, Award, RefreshCw, Quote, BookOpen, Layers, CheckCircle } from 'lucide-react';

const BOOKISH_QUOTES = [
  { text: "Grow through what you go through.", author: "Botanical Accent" },
  { text: "Quiet moments, warm tea, and one more chapter.", author: "Bibliophile Creed" },
  { text: "There is no friend as loyal as a book.", author: "Ernest Hemingway" },
  { text: "Books are a uniquely portable magic.", author: "Stephen King" },
  { text: "We read to know we are not alone.", author: "C.S. Lewis" },
  { text: "A room without books is like a body without a soul.", author: "Cicero" },
  { text: "I have always imagined that Paradise will be a kind of library.", author: "Jorge Luis Borges" },
  { text: "Reading is a conversation. All books talk. But a good book listens as well.", author: "Mark Haddon" }
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState(BOOKISH_QUOTES[0]);

  useEffect(() => {
    // Fetch profile stats
    client.get('/profile/')
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
      });

    // Pick a random quote
    rotateQuote();
  }, []);

  const rotateQuote = () => {
    const randomIndex = Math.floor(Math.random() * BOOKISH_QUOTES.length);
    setQuote(BOOKISH_QUOTES[randomIndex]);
  };

  const getJoinDate = (dateStr) => {
    if (!dateStr) return 'Joined recently';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-nettle animate-pulse">
        <User className="w-12 h-12 mb-3" />
        <p className="font-handwriting text-xl">Opening your profile diary...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Header Diary look */}
      <div className="bg-cream/40 border border-specialOps/20 rounded-3xl p-6 sm:p-8 shadow-cozy relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        {/* Tape decoration */}
        <div className="absolute -top-3 left-10 w-20 h-5 bg-rejuvenate/30 border border-specialOps/15 opacity-60 transform rotate-1"></div>
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-nettle text-cream flex items-center justify-center shadow">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-serif text-3xl font-extrabold text-nettle">
              {profile?.display_name || user?.display_name || 'Bibliophile'}
            </h2>
            <p className="text-sm text-specialOps font-semibold mt-0.5">@{profile?.username || user?.username}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-specialOps/90 uppercase tracking-wider bg-cream border border-specialOps/20 px-3 py-1.5 rounded-full shadow-sm">
          <Calendar className="w-3.5 h-3.5" />
          <span>Joined {getJoinDate(profile?.date_joined)}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Stats */}
        <div className="md:col-span-2 space-y-6">
          <h3 className="font-serif text-2xl font-bold text-nettle border-b border-specialOps/20 pb-2">
            Your Library Garden
          </h3>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                label: 'Unique Books',
                value: profile?.stats?.total_books_tracked || 0,
                icon: BookOpen,
                color: 'text-nettle'
              },
              {
                label: 'Total Shelves',
                value: profile?.stats?.total_shelves || 0,
                icon: Layers,
                color: 'text-deathworldForest'
              },
              {
                label: 'Completed',
                value: profile?.stats?.completed_books || 0,
                icon: CheckCircle,
                color: 'text-hinterlands'
              }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-cream/50 border border-specialOps/15 rounded-2xl p-5 flex flex-col justify-between h-32 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs uppercase font-bold tracking-wider text-specialOps">{stat.label}</span>
                    <Icon className={`w-5 h-5 ${stat.color} opacity-75`} />
                  </div>
                  <span className="font-serif text-4xl font-extrabold text-nettle">
                    {stat.value}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Shelves Breakdowns */}
          <div className="bg-cream/40 border border-specialOps/15 rounded-2xl p-6 space-y-4">
            <h4 className="font-serif text-lg font-bold text-nettle">Shelf Stats</h4>
            <div className="space-y-3">
              {[
                { name: 'Currently Reading', count: profile?.stats?.currently_reading_books || 0 },
                { name: 'Want to Read', count: profile?.stats?.want_to_read_books || 0 },
                { name: 'Completed', count: profile?.stats?.completed_books || 0 }
              ].map((s, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm font-medium">
                  <span className="text-pepper/80">{s.name}</span>
                  <div className="flex items-center gap-3 flex-1 max-w-[60%] ml-4">
                    <div className="h-2 bg-rejuvenate/30 rounded-full flex-1 overflow-hidden border border-specialOps/10">
                      <div
                        className="h-full bg-nettle rounded-full"
                        style={{
                          width: `${
                            profile?.stats?.total_books_tracked 
                              ? (s.count / profile.stats.total_books_tracked) * 100 
                              : 0
                          }%`
                        }}
                      ></div>
                    </div>
                    <span className="w-6 text-right font-bold text-nettle">{s.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Ticket stub & Quotes */}
        <div className="space-y-6 flex flex-col items-center">
          {/* Ticket-Stub Reading Streak Badge */}
          <div className="w-full flex justify-center">
            <div className="ticket-stub w-60 h-28 flex flex-col justify-between p-4 rounded-xl relative overflow-hidden select-none">
              {/* Ticket Jagged Circles Cutouts */}
              <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 bg-cream rounded-full border-r border-specialOps/30"></div>
              <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-cream rounded-full border-l border-specialOps/30"></div>
              
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold tracking-widest uppercase">Bookish Corner</span>
                <Award className="w-4 h-4 text-cream" />
              </div>
              <div className="text-center py-1">
                <span className="font-typewriter text-xl font-bold uppercase tracking-wider block">One More Chapter</span>
              </div>
              <div className="flex justify-between items-end border-t border-cream/20 pt-1.5 text-[9px] uppercase font-bold tracking-wider">
                <span>Milestone Badge</span>
                <span>Active Member</span>
              </div>
            </div>
          </div>

          {/* Rotating Cozy Quote Card */}
          <div className="torn-paper w-full p-6 rounded-2xl relative flex flex-col justify-between min-h-48 text-center group">
            {/* Quote details */}
            <div>
              <Quote className="w-6 h-6 text-specialOps/30 mx-auto mb-2" />
              <p className="font-handwriting text-xl text-pepper/90 leading-relaxed italic">
                "{quote.text}"
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-specialOps/15 flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-deathworldForest">
                — {quote.author}
              </span>
              <button
                onClick={rotateQuote}
                className="p-1 text-specialOps hover:text-nettle hover:bg-rejuvenate/30 rounded-lg transition-colors"
                title="Rotate Quote"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
