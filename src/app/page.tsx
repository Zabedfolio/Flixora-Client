"use client";

import Footer from "@/components/common/Footer";
import HeroBanner from "@/components/common/Hero-Section";
import React, { useState } from "react";
import { 
  FaPlay, 
  FaPlus, 
  FaSearch, 
  FaStar, 
  FaFilm, 
  FaTv, 
  FaBookmark, 
  FaFire, 
  FaCompass, 
  FaHeart,
  FaChevronRight,
  FaCheck
} from "react-icons/fa";

interface Movie {
  id: number;
  title: string;
  category: string;
  rating: number;
  year: number;
  duration: string;
  imageUrl: string;
  trending: boolean;
  popular: boolean;
}

const MOCK_MOVIES: Movie[] = [
  {
    id: 1,
    title: "Project Zero: Genesis",
    category: "Sci-Fi / Action",
    rating: 8.9,
    year: 2026,
    duration: "2h 15m",
    imageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=600&auto=format&fit=crop",
    trending: true,
    popular: true
  },
  {
    id: 2,
    title: "Shadows in the Neon",
    category: "Thriller / Cyberpunk",
    rating: 8.4,
    year: 2025,
    duration: "1h 58m",
    imageUrl: "https://images.unsplash.com/photo-1542204172-e7052809f852?q=80&w=600&auto=format&fit=crop",
    trending: true,
    popular: false
  },
  {
    id: 3,
    title: "The Silent Cosmos",
    category: "Documentary",
    rating: 9.1,
    year: 2026,
    duration: "1h 42m",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
    trending: true,
    popular: true
  },
  {
    id: 4,
    title: "Chrono Drift",
    category: "Adventure / Fantasy",
    rating: 7.9,
    year: 2025,
    duration: "2h 05m",
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
    trending: false,
    popular: true
  },
  {
    id: 5,
    title: "Echoes of Eternity",
    category: "Drama / Romance",
    rating: 8.2,
    year: 2024,
    duration: "2h 10m",
    imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=600&auto=format&fit=crop",
    trending: false,
    popular: true
  },
  {
    id: 6,
    title: "Rebel Horizon",
    category: "Action / Adventure",
    rating: 8.5,
    year: 2026,
    duration: "2h 22m",
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600&auto=format&fit=crop",
    trending: true,
    popular: true
  }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [myList, setMyList] = useState<number[]>([1, 3]);

  const toggleMyList = (id: number) => {
    if (myList.includes(id)) {
      setMyList(myList.filter(item => item !== id));
    } else {
      setMyList([...myList, id]);
    }
  };

  const filteredMovies = MOCK_MOVIES.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          movie.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (activeTab === "trending") return movie.trending;
    if (activeTab === "popular") return movie.popular;
    if (activeTab === "mylist") return myList.includes(movie.id);
    return true;
  });

  return (
    <div className="min-h-screen bg-neutral text-neutral-content font-sans">
      
      {/* NAVIGATION BAR */}
      <div className="navbar bg-base-300 px-4 md:px-8 border-b border-base-100 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
        <div className="flex-1 gap-2 md:gap-4">
          {/* Brand Logo */}
          <a className="flex items-center gap-2 text-xl font-black text-primary tracking-wider select-none cursor-pointer">
            <FaFilm className="text-2xl text-secondary animate-pulse" />
            FLIXORA
          </a>
          
          {/* Navigation Items */}
          <div className="hidden md:flex gap-1 ml-6">
            <button 
              onClick={() => setActiveTab("all")} 
              className={`btn btn-sm btn-ghost ${activeTab === "all" ? "text-primary font-bold" : ""}`}
            >
              <FaCompass className="mr-1.5" /> Explore
            </button>
            <button 
              onClick={() => setActiveTab("trending")} 
              className={`btn btn-sm btn-ghost ${activeTab === "trending" ? "text-primary font-bold" : ""}`}
            >
              <FaFire className="mr-1.5" /> Trending
            </button>
            <button 
              onClick={() => setActiveTab("mylist")} 
              className={`btn btn-sm btn-ghost ${activeTab === "mylist" ? "text-primary font-bold" : ""}`}
            >
              <FaBookmark className="mr-1.5" /> My List
              {myList.length > 0 && (
                <span className="badge badge-secondary badge-xs py-1.5 px-1 ml-1">{myList.length}</span>
              )}
            </button>
          </div>
        </div>

        {/* Search & Profile */}
        <div className="flex-none gap-4">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered input-sm w-36 sm:w-64 pr-8 focus:input-primary transition-all duration-300"
            />
            <FaSearch className="absolute right-2.5 text-neutral-content/50 pointer-events-none text-xs" />
          </div>

          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar online">
              <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img alt="User profile picture" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" />
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-2xl bg-base-200 rounded-box w-52 border border-base-100">
              <li><a>Profile Settings</a></li>
              <li><a>Preferences</a></li>
              <li><a className="text-error">Logout</a></li>
            </ul>
          </div>
        </div>
      </div>

      <HeroBanner/>

      {/* FILTER TABS FOR MOBILE */}
      <div className="flex md:hidden justify-center gap-1 p-4 bg-base-200">
        <button 
          onClick={() => setActiveTab("all")} 
          className={`btn btn-xs ${activeTab === "all" ? "btn-primary" : "btn-ghost"}`}
        >
          Explore
        </button>
        <button 
          onClick={() => setActiveTab("trending")} 
          className={`btn btn-xs ${activeTab === "trending" ? "btn-primary" : "btn-ghost"}`}
        >
          Trending
        </button>
        <button 
          onClick={() => setActiveTab("mylist")} 
          className={`btn btn-xs ${activeTab === "mylist" ? "btn-primary" : "btn-ghost"}`}
        >
          My List ({myList.length})
        </button>
      </div>

      {/* MOVIE LISTING GRID */}
      <div className="container mx-auto px-4 md:px-8 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight capitalize text-white flex items-center gap-2">
              {activeTab === "all" ? (
                <>
                  <FaCompass className="text-secondary" /> Explore Catalog
                </>
              ) : activeTab === "trending" ? (
                <>
                  <FaFire className="text-error animate-pulse" /> Hot & Trending
                </>
              ) : (
                <>
                  <FaBookmark className="text-info" /> My Personal List
                </>
              )}
            </h2>
            <p className="text-sm text-neutral-content/60 mt-1">
              Showing {filteredMovies.length} movies based on your filter selection
            </p>
          </div>
          <div className="text-sm text-primary flex items-center gap-1 cursor-pointer hover:underline select-none">
            See all <FaChevronRight className="text-xs" />
          </div>
        </div>

        {filteredMovies.length === 0 ? (
          <div className="text-center py-20 bg-base-200 rounded-3xl border border-base-100 flex flex-col items-center justify-center">
            <div className="text-4xl text-neutral-content/40 mb-4">🎬</div>
            <h3 className="text-xl font-bold text-white mb-2">No movies found</h3>
            <p className="text-neutral-content/60 max-w-xs">
              We couldn't find any results matches your search query or tab filters. Try another option!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <div 
                key={movie.id} 
                className="card bg-base-300 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-base-200/50 group"
              >
                {/* Image & Badges */}
                <figure className="relative h-48 overflow-hidden">
                  <img 
                    src={movie.imageUrl} 
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {movie.trending && (
                      <span className="badge badge-error badge-sm font-semibold gap-1 text-white shadow-md">
                        <FaFire className="text-xs" /> Hot
                      </span>
                    )}
                    {movie.rating >= 8.5 && (
                      <span className="badge badge-warning badge-sm font-semibold gap-1 text-black shadow-md">
                        <FaStar className="text-xs" /> {movie.rating}
                      </span>
                    )}
                  </div>
                  
                  {/* Hover Overlay Button */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="btn btn-circle btn-primary shadow-lg scale-75 group-hover:scale-100 transition-all duration-300">
                      <FaPlay className="text-lg ml-0.5" />
                    </button>
                  </div>
                </figure>

                {/* Card Content */}
                <div className="card-body p-5">
                  <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                    {movie.category}
                  </span>
                  <h3 className="card-title text-base font-bold text-white leading-tight min-h-[2.5rem] line-clamp-2">
                    {movie.title}
                  </h3>
                  
                  {/* Movie Stats */}
                  <div className="flex items-center gap-3 text-xs text-neutral-content/60 mt-2">
                    <span>{movie.year}</span>
                    <span>•</span>
                    <span>{movie.duration}</span>
                  </div>

                  {/* Divider */}
                  <div className="divider my-2 opacity-10"></div>

                  {/* Actions */}
                  <div className="card-actions justify-between items-center">
                    <div className="flex items-center gap-1 text-warning">
                      <FaStar className="text-xs" />
                      <span className="font-bold text-sm">{movie.rating}</span>
                    </div>
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => toggleMyList(movie.id)}
                        className={`btn btn-square btn-sm btn-ghost border border-neutral-content/20 hover:bg-neutral-content/10 ${myList.includes(movie.id) ? "text-primary" : ""}`}
                        title="Add to List"
                      >
                        {myList.includes(movie.id) ? <FaBookmark /> : <FaPlus />}
                      </button>
                      <button className="btn btn-square btn-sm btn-ghost border border-neutral-content/20 hover:bg-neutral-content/10 text-error">
                        <FaHeart />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer/>

    </div>
  );
}
