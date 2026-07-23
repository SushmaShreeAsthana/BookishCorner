import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Coffee, Compass, Feather, Heart } from 'lucide-react';

// Cozy SVG stack of books + steaming coffee mug
const CozyHeroIllustration = () => (
  <svg viewBox="0 0 400 400" className="w-full max-w-sm mx-auto drop-shadow-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background Circle */}
    <circle cx="200" cy="200" r="160" fill="#C6C7A6" fillOpacity="0.25" />
    
    {/* Leaves / Floral Details in Background */}
    <path d="M70 120 C 60 90, 90 70, 110 90 C 130 110, 100 130, 70 120" fill="#838E57" fillOpacity="0.4" />
    <path d="M330 280 C 310 250, 340 230, 360 250 C 380 270, 350 290, 330 280" fill="#838E57" fillOpacity="0.4" />
    
    {/* Steaming Mug of Coffee/Tea */}
    {/* Steam */}
    <path d="M190 80 Q 185 70 190 60 T 190 40" stroke="#838E57" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M205 80 Q 200 70 205 60 T 205 40" stroke="#838E57" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    {/* Mug body */}
    <path d="M170 90 h60 v40 c0 15-12 25-25 25 h-10 c-13 0-25-10-25-25 V90 Z" fill="#384929" />
    <path d="M230 100 c15 0 20 15 10 25 c-5 5-10 5-10 5" stroke="#384929" strokeWidth="6" strokeLinecap="round" fill="none" />
    {/* Mug Line Art Detail */}
    <path d="M185 115 h30" stroke="#F5F1E6" strokeWidth="2" strokeLinecap="round" />
    
    {/* Stack of 3 Books */}
    {/* Book 1 (Top - Green) */}
    <rect x="130" y="160" width="140" height="24" rx="4" fill="#5A6A31" />
    <rect x="125" y="164" width="8" height="16" rx="2" fill="#C6C7A6" />
    <path d="M270 160 v24" stroke="#F5F1E6" strokeWidth="2" />
    
    {/* Book 2 (Middle - Beige) */}
    <rect x="110" y="188" width="180" height="28" rx="4" fill="#C6C7A6" />
    <rect x="105" y="193" width="8" height="18" rx="2" fill="#5A6A31" />
    <path d="M140 188 v28" stroke="#384929" strokeWidth="2" />
    <path d="M145 188 v28" stroke="#384929" strokeWidth="2" />
    
    {/* Book 3 (Bottom - Forest Green) */}
    <rect x="90" y="220" width="220" height="32" rx="4" fill="#1F2D13" />
    <rect x="85" y="226" width="8" height="20" rx="2" fill="#838E57" />
    <path d="M290 220 v32" stroke="#F5F1E6" strokeWidth="3" />
    
    {/* Shelf/Table Base */}
    <line x1="60" y1="252" x2="340" y2="252" stroke="#384929" strokeWidth="8" strokeLinecap="round" />
    <line x1="75" y1="256" x2="325" y2="256" stroke="#838E57" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const LeafDecoration = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 90 Q 50 50 90 10" stroke="#838E57" strokeWidth="2" strokeLinecap="round" />
    <path d="M30 70 Q 15 50 25 40 Q 40 40 50 50" fill="#5A6A31" fillOpacity="0.7" />
    <path d="M50 50 Q 40 25 50 15 Q 65 20 70 30" fill="#838E57" fillOpacity="0.7" />
    <path d="M70 30 Q 65 15 75 10 Q 85 20 80 25" fill="#384929" fillOpacity="0.7" />
  </svg>
);

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 80 }
    }
  };

  return (
    <div className="min-h-screen bg-cream text-pepper flex flex-col relative overflow-hidden">
      
      {/* Decorative Botanical Elements */}
      <LeafDecoration className="absolute w-24 h-24 -top-6 -left-6 opacity-30 pointer-events-none" />
      <LeafDecoration className="absolute w-32 h-32 -bottom-8 -right-8 opacity-25 pointer-events-none transform rotate-90" />
      
      {/* Header */}
      <header className="max-w-6xl mx-auto w-full px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-nettle" />
          <span className="font-serif text-2xl font-bold text-nettle">Bookish Corner</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-4 py-2 text-nettle font-medium hover:text-darkestForest transition">
            Sign In
          </Link>
          <Link to="/register" className="px-5 py-2 bg-nettle hover:bg-darkestForest text-cream font-medium rounded-xl shadow-md transition">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 md:py-24 grid md:grid-cols-2 gap-12 items-center z-10">
        {/* Left Side: Brand Wordmark and Copy */}
        <motion.div 
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-1.5 px-3 py-1 bg-rejuvenate/30 border border-specialOps/20 rounded-full text-xs font-semibold uppercase tracking-wider text-nettle sticker-badge">
            <Feather className="w-3.5 h-3.5" />
            <span>Your Cozy Reading Journal</span>
          </motion.div>
          
          <motion.h2 variants={itemVariants} className="font-serif text-5xl md:text-6xl font-extrabold text-nettle leading-tight">
            Cultivate your personal library, <br/>
            <span className="font-handwriting text-5xl md:text-6xl text-deathworldForest normal-case font-normal">
              one page at a time.
            </span>
          </motion.h2>
          
          <motion.p variants={itemVariants} className="text-lg text-pepper/80 leading-relaxed max-w-lg">
            Welcome to your quiet digital book nook. Track your reading goals, review your favorite stories, organize shelves, and log your thoughts in a warm cottagecore sanctuary.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link 
              to="/register" 
              className="px-8 py-4 bg-nettle hover:bg-darkestForest text-cream font-bold text-center rounded-2xl shadow-cozy hover:shadow-cozyActive transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Begin Your Reading Journey
            </Link>
            <Link 
              to="/login" 
              className="px-8 py-4 bg-rejuvenate/50 hover:bg-rejuvenate text-nettle font-bold text-center rounded-2xl border border-specialOps/30 hover:border-specialOps/60 transition-all duration-300"
            >
              Sign In to Your Nest
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Side: Cozy Illustration */}
        <motion.div 
          className="flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: 'spring', bounce: 0.3 }}
        >
          <CozyHeroIllustration />
        </motion.div>
      </section>

      {/* Quote Banner */}
      <section className="bg-rejuvenate/10 py-16 border-y border-specialOps/10 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="torn-paper p-8 md:p-12 max-w-2xl mx-auto rounded-lg"
          >
            <p className="font-typewriter text-xl md:text-2xl text-pepper/90 italic leading-relaxed">
              "The world belongs to those who read."
            </p>
            <p className="font-serif text-sm tracking-wider uppercase text-deathworldForest font-bold mt-4">
              — Rick Yancey
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 max-w-6xl mx-auto w-full px-6">
        <h3 className="font-serif text-3xl font-bold text-nettle text-center mb-12">
          Everything You Need to Track Your Literary Garden
        </h3>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Compass,
              title: "Discover Stories",
              desc: "Search millions of books using the Open Library database. Filter by title, author, or subject."
            },
            {
              icon: BookOpen,
              title: "Organize Shelves",
              desc: "Maintain default shelves (Currently Reading, Want to Read, Completed) or weave your own custom collections."
            },
            {
              icon: Coffee,
              title: "Mindful Journaling",
              desc: "Track reading progress, log ratings out of five stars, and write quiet reflections for every title."
            }
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                className="bg-cream/40 p-8 rounded-2xl border border-specialOps/20 shadow-cozy hover:shadow-cozyActive transition-all duration-300 flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
              >
                <div className="p-4 bg-nettle/10 text-nettle rounded-xl mb-4">
                  <Icon className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-xl font-bold text-nettle mb-2">{feat.title}</h4>
                <p className="text-pepper/80 text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-specialOps/10 text-center text-sm text-specialOps">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Bookish Corner. Made for tea drinkers, cat lovers, and chronic page-turners.</p>
          <div className="flex items-center gap-1.5 text-xs">
            <span>Cultivated with</span>
            <Heart className="w-3.5 h-3.5 text-red-700 fill-current" />
            <span>for bibliophiles</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
