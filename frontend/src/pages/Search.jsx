import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Search = () => {
    const [salons, setSalons] = useState([]);
    const [search, setSearch] = useState('');
    const [city, setCity] = useState('');
    const [sort, setSort] = useState('newest');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const params = useMemo(() => {
        const query = new URLSearchParams({ limit: '24', sort });
        if (search.trim()) query.set('search', search.trim());
        if (city.trim()) query.set('city', city.trim());
        return query.toString();
    }, [city, search, sort]);

    useEffect(() => {
        let cancelled = false;

        const fetchSalons = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await api.get(`/salons?${params}`);
                if (!cancelled) {
                    setSalons(res.data.salons || []);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.response?.data?.message || 'Unable to load salons right now.');
                    setSalons([]);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchSalons();
        return () => {
            cancelled = true;
        };
    }, [params]);

    return (
        <main className="min-h-screen bg-bg-light">
            <section className="border-b border-gray-100 bg-white">
                <div className="container-custom py-14">
                    <p className="text-sm font-bold uppercase tracking-widest text-primary">Browse professionals</p>
                    <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-4xl font-black text-gray-950 md:text-6xl">Find the right chair.</h1>
                            <p className="mt-4 max-w-2xl text-lg text-gray-600">Search local salons, compare details, and reserve an available slot without waiting around.</p>
                        </div>
                        <Link to="/signup" className="btn-primary w-fit">List your salon</Link>
                    </div>
                </div>
            </section>

            <section className="container-custom py-8">
                <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_180px]">
                    <input
                        type="search"
                        placeholder="Search by salon or service"
                        className="premium-input bg-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <input
                        type="search"
                        placeholder="City"
                        className="premium-input bg-white"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <select className="premium-input bg-white" value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                    </select>
                </div>

                {error && (
                    <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-5 text-red-700">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="grid gap-6 py-10 md:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="h-80 animate-pulse rounded-2xl bg-white shadow-sm" />
                        ))}
                    </div>
                ) : salons.length === 0 && !error ? (
                    <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-950">No salons found</h2>
                        <p className="mt-2 text-gray-600">Try a different search term or city.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 py-10 md:grid-cols-2 lg:grid-cols-3">
                        {salons.map((salon) => (
                            <article key={salon._id} className="card-minimal group flex flex-col">
                                <div className="relative mb-5 h-56 overflow-hidden rounded-xl bg-gray-100">
                                    <img
                                        src={salon.images?.[0] || 'https://via.placeholder.com/600x400'}
                                        alt={salon.name}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wide text-gray-700 shadow-sm">
                                        {salon.city}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-950">{salon.name}</h2>
                                <p className="mt-2 line-clamp-2 flex-1 text-gray-600">{salon.description || 'Professional grooming and styling appointments.'}</p>
                                <Link to={`/salon/${salon._id}`} className="mt-6 font-bold text-primary hover:text-primary-dark">
                                    View availability
                                </Link>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};

export default Search;
