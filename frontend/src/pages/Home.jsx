import { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const Home = () => {
    const [salons, setSalons] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters & Pagination
    const [search, setSearch] = useState('');
    const [city, setCity] = useState('');
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalSalons, setTotalSalons] = useState(0);

    const fetchSalons = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/salons?page=${page}&limit=2&search=${search}&city=${city}&sort=${sort}`);
            setSalons(res.data.salons);
            setTotalPages(res.data.totalPages);
            setTotalSalons(res.data.totalSalons);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Debounce search or just fetch when input blur/enter? 
    // For simplicity, let's use a "Search" button or useEffect on delay.
    // Let's use useEffect for page change, and submit for search.

    useEffect(() => {
        fetchSalons();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, sort]); // Fetch on page or sort change. For search/city, wait for explicit submit or add here if instant.

    // Animation Effect
    useEffect(() => {
        if (!loading) {
            gsap.fromTo(".salon-card",
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power3.out" }
            );
        }
    }, [loading, salons]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1); // Reset to page 1 on search
        fetchSalons();
    };

    return (
        <div className="container mx-auto p-6 min-h-screen">
            {/* Header Section */}
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4 text-primary tracking-tight">Discover Excellence</h1>
                <p className="text-gray-400 text-lg">Book appointments at the finest salons near you.</p>

                {/* Search & Filter Bar */}
                <form onSubmit={handleSearch} className="mt-8 flex flex-col md:flex-row justify-center max-w-4xl mx-auto gap-4 items-center">
                    <input
                        type="text"
                        placeholder="Search salons..."
                        className="premium-input md:w-1/3"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="City filter..."
                        className="premium-input md:w-1/4"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <select
                        className="premium-input md:w-1/4"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                    <button type="submit" className="premium-btn md:w-auto w-full">Search</button>
                </form>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {salons.map((salon) => (
                            <div key={salon._id} className="salon-card premium-card group">
                                <div className="relative overflow-hidden h-64">
                                    <img
                                        src={salon.images[0] || "https://via.placeholder.com/600x400"}
                                        alt={salon.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-6">
                                        <h2 className="text-2xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{salon.name}</h2>
                                        <p className="text-gray-300 text-sm flex items-center gap-1">📍 {salon.city}</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-400 mb-6 line-clamp-2 h-12">{salon.description}</p>
                                    <div className="flex justify-between items-center">
                                        <Link
                                            to={`/salon/${salon._id}`}
                                            className="w-full text-center border border-gray-600 text-gray-300 py-3 rounded-lg hover:border-primary hover:text-primary hover:bg-gray-800/50 transition-all uppercase text-sm font-bold tracking-widest"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {salons.length === 0 && <p className="text-center text-gray-500 mt-10 text-xl font-serif">No salons found matching your criteria.</p>}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-16 gap-4">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className={`px-4 py-2 rounded-lg border text-sm font-bold uppercase tracking-wider transition-all
                                    ${page === 1 ? 'border-gray-800 text-gray-600 cursor-not-allowed' : 'border-gray-600 text-gray-300 hover:border-primary hover:text-primary'}
                                `}
                            >
                                Previous
                            </button>
                            <span className="flex items-center text-gray-400 font-serif px-2">Page {page} of {totalPages}</span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className={`px-4 py-2 rounded-lg border text-sm font-bold uppercase tracking-wider transition-all
                                    ${page === totalPages ? 'border-gray-800 text-gray-600 cursor-not-allowed' : 'border-gray-600 text-gray-300 hover:border-primary hover:text-primary'}
                                `}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Home;
