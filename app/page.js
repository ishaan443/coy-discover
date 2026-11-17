'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, MessageCircle, Home, Flame, MapPin, Send, ChevronLeft, RotateCcw } from 'lucide-react';

function SwipeCard({ profile, onSwipe }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity = useTransform(x, [30, 110], [0, 1]);
  const nopeOpacity = useTransform(x, [-110, -30], [1, 0]);
  const [imgSrc, setImgSrc] = useState(profile.photo);

  return (
    <motion.div
      style={{ x, rotate }}
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.18 } }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(e, info) => {
        if (info.offset.x > 100) onSwipe(profile.id, 'like');
        else if (info.offset.x < -100) onSwipe(profile.id, 'pass');
      }}
      className="absolute inset-0 bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col cursor-grab active:cursor-grabbing select-none"
    >
      <div className="relative flex-1 w-full overflow-hidden bg-slate-800">
        <img
          src={imgSrc}
          alt={profile.name}
          onError={() => setImgSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=f43f5e&color=fff&size=512`)}
          className="w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />

        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-6 left-6 border-4 border-emerald-400 text-emerald-400 font-extrabold text-2xl px-3 py-1 rounded-xl -rotate-12 tracking-wider uppercase"
        >
          LIKE
        </motion.div>

        <motion.div
          style={{ opacity: nopeOpacity }}
          className="absolute top-6 right-6 border-4 border-rose-500 text-rose-500 font-extrabold text-2xl px-3 py-1 rounded-xl rotate-12 tracking-wider uppercase"
        >
          NOPE
        </motion.div>

        <div className="absolute bottom-0 inset-x-0 p-5">
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">{profile.name}</h2>
            <span className="text-2xl font-normal text-slate-200">{profile.age}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300 text-sm mt-1">
            <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{profile.city}</span>
          </div>
          <p className="text-sm text-slate-200 mt-2.5 line-clamp-2 leading-relaxed">{profile.bio}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {profile.interests.map((interest, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white font-medium border border-white/10"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CoyApp() {
  const [tab, setTab] = useState('discover');
  const [profiles, setProfiles] = useState([]);
  const [matches, setMatches] = useState([]);
  const [activeMatch, setActiveMatch] = useState(null);
  const [chatPartner, setChatPartner] = useState(null);
  const [messages, setMessages] = useState({});
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [feedRes, matchRes] = await Promise.all([
      fetch('/api/feed'),
      fetch('/api/matches')
    ]);
    const feedData = await feedRes.json();
    const matchData = await matchRes.json();
    setProfiles(feedData.profiles || []);
    setMatches(matchData.matches || []);
    setLoading(false);
  };

  const handleSwipe = async (targetId, action) => {
    setProfiles((prev) => prev.slice(1));

    const res = await fetch('/api/swipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetId, action }),
    });
    const data = await res.json();

    if (data.match && data.profile) {
      setActiveMatch(data.profile);
      setMatches((prev) => [data.profile, ...prev]);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!draft.trim() || !chatPartner) return;
    const text = draft.trim();
    setMessages((prev) => ({
      ...prev,
      [chatPartner.id]: [...(prev[chatPartner.id] || []), { sender: 'me', text }]
    }));
    setDraft('');
  };

  const currentProfile = profiles[0];

  return (
    <main className="flex justify-center items-center min-h-screen bg-slate-950 text-slate-100 p-0 sm:p-4 font-sans">
      <div className="w-full max-w-md h-screen sm:h-[820px] bg-slate-900 sm:border sm:border-slate-800 sm:rounded-[2.25rem] shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Clean Header */}
        <header className="px-5 py-4 flex items-center justify-between bg-slate-900 border-b border-slate-800/80 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-md shadow-rose-500/20">
              <Flame className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">coy</span>
          </div>
        </header>

        {/* Main View Area */}
        <div className="flex-1 overflow-y-auto relative flex flex-col">
          
          {/* Blank Home Tab Placeholder */}
          {tab === 'home' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center mb-4 text-slate-500">
                <Home className="w-7 h-7" />
              </div>
              <h2 className="text-base font-semibold text-slate-300">Home</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
                Placeholder tab. Switch to Discover below to meet people.
              </p>
            </div>
          )}

          {/* Discover Swipe Tab */}
          {tab === 'discover' && (
            <div className="flex-1 p-4 flex flex-col">
              {loading ? (
                <div className="flex-1 flex items-center justify-center text-sm text-slate-500 animate-pulse">
                  Finding people near you...
                </div>
              ) : profiles.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-rose-400">
                    <RotateCcw className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-white">You’re all caught up</h3>
                  <p className="text-sm text-slate-400 mt-1.5 max-w-[250px]">
                    You’ve swiped through everyone nearby. Check your Matches tab or come back later!
                  </p>
                  <button
                    onClick={() => setTab('matches')}
                    className="mt-6 px-5 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition"
                  >
                    View Matches ({matches.length})
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 relative">
                    <AnimatePresence>
                      {profiles.slice(0, 2).reverse().map((profile) => (
                        <SwipeCard
                          key={profile.id}
                          profile={profile}
                          onSwipe={handleSwipe}
                        />
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Desktop & Mobile Action Buttons */}
                  <div className="flex items-center justify-center gap-6 pt-5 pb-2">
                    <button
                      aria-label="Pass"
                      onClick={() => handleSwipe(currentProfile.id, 'pass')}
                      className="w-15 h-15 p-4 rounded-full bg-slate-800 border border-slate-700 text-rose-500 hover:bg-slate-700 hover:scale-105 active:scale-95 transition shadow-lg"
                    >
                      <X className="w-7 h-7 stroke-[2.5]" />
                    </button>
                    <button
                      aria-label="Like"
                      onClick={() => handleSwipe(currentProfile.id, 'like')}
                      className="w-15 h-15 p-4 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white hover:opacity-95 hover:scale-105 active:scale-95 transition shadow-lg shadow-rose-500/30"
                    >
                      <Heart className="w-7 h-7 fill-white" />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Mutual Matches & Chat Tab */}
          {tab === 'matches' && !chatPartner && (
            <div className="p-5 flex-1">
              <h2 className="text-lg font-bold text-white mb-1">Matches</h2>
              <p className="text-xs text-slate-400 mb-4">Only mutual likes appear here.</p>

              {matches.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <MessageCircle className="w-10 h-10 mx-auto mb-3 stroke-1 text-slate-600" />
                  <p className="text-sm font-medium text-slate-400">No matches yet</p>
                  <p className="text-xs text-slate-500 mt-1">Swipe right in Discover to connect.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3.5">
                  {matches.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setChatPartner(m)}
                      className="group relative rounded-2xl overflow-hidden h-52 bg-slate-800 border border-slate-700/80 text-left shadow-md"
                    >
                      <img
                        src={m.photo}
                        alt={m.name}
                        onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=f43f5e&color=fff&size=256`; }}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="font-bold text-sm text-white truncate">{m.name}, {m.age}</p>
                        <p className="text-[11px] text-slate-300 truncate">{m.city}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Direct Message View */}
          {tab === 'matches' && chatPartner && (
            <div className="flex-1 flex flex-col bg-slate-900">
              <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-3">
                <button onClick={() => setChatPartner(null)} className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <img src={chatPartner.photo} alt={chatPartner.name} className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <h3 className="text-sm font-bold text-white">{chatPartner.name}</h3>
                  <p className="text-[11px] text-emerald-400">Matched</p>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                <div className="text-center text-xs text-slate-500 my-4">
                  You matched with {chatPartner.name}. Say hello!
                </div>
                {(messages[chatPartner.id] || []).map((msg, idx) => (
                  <div key={idx} className="flex justify-end">
                    <div className="bg-rose-500 text-white text-sm px-4 py-2 rounded-2xl rounded-br-sm max-w-[75%]">
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={sendMessage} className="p-3 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={`Message ${chatPartner.name}...`}
                  className="flex-1 bg-slate-800 text-sm text-white px-4 py-2.5 rounded-full focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
                <button type="submit" className="p-2.5 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* "It's a Match!" Overlay with Both Actions */}
        <AnimatePresence>
          {activeMatch && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-2">Mutual Like</span>
              <h2 className="text-4xl font-black italic bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent mb-2">
                It’s a Match!
              </h2>
              <p className="text-slate-300 text-sm mb-6">
                You and <span className="font-semibold text-white">{activeMatch.name}</span> liked each other.
              </p>

              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-rose-500 shadow-2xl shadow-rose-500/20 mb-8">
                <img
                  src={activeMatch.photo}
                  alt={activeMatch.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full max-w-xs flex flex-col gap-3">
                <button
                  onClick={() => {
                    const partner = activeMatch;
                    setActiveMatch(null);
                    setTab('matches');
                    setChatPartner(partner);
                  }}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 font-semibold text-white shadow-lg shadow-rose-500/25 hover:opacity-95 transition"
                >
                  Send a Message
                </button>
                <button
                  onClick={() => setActiveMatch(null)}
                  className="w-full py-3.5 rounded-full bg-slate-800 border border-slate-700 font-semibold text-slate-200 hover:bg-slate-700 transition"
                >
                  Keep Swiping
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Navigation Bar */}
        <nav className="h-16 border-t border-slate-800 bg-slate-900 flex justify-around items-center px-4 z-10">
          <button
            onClick={() => { setTab('home'); setChatPartner(null); }}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium transition ${tab === 'home' ? 'text-rose-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Home className="w-5 h-5" />
            Home
          </button>
          <button
            onClick={() => { setTab('discover'); setChatPartner(null); }}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium transition ${tab === 'discover' ? 'text-rose-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Flame className="w-5 h-5" />
            Discover
          </button>
          <button
            onClick={() => { setTab('matches'); setChatPartner(null); }}
            className={`relative flex flex-col items-center gap-1 text-[11px] font-medium transition ${tab === 'matches' ? 'text-rose-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <MessageCircle className="w-5 h-5" />
            Matches
            {matches.length > 0 && (
              <span className="absolute -top-1 -right-2.5 bg-rose-500 text-white text-[10px] font-bold px-1.5 rounded-full">
                {matches.length}
              </span>
            )}
          </button>
        </nav>

      </div>
    </main>
  );
}
