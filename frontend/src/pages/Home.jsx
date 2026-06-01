import { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { BackgroundPaths } from '@/components/ui/background-paths';
import FlowArt, { FlowSection } from '@/components/ui/story-scroll';

const Home = () => {
    const [salons, setSalons] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSalons = async () => {
        try {
            const res = await api.get(`/salons?limit=3&sort=newest`);
            setSalons(res.data.salons);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSalons();
    }, []);

    useEffect(() => {
        if (!loading) {
            gsap.fromTo(".fade-in-up",
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, stagger: 0.2, duration: 0.8, ease: "power2.out" }
            );
        }
    }, [loading]);

    return (
        <div className="pb-20">
            {/* Hero Section */}
            <BackgroundPaths title="Find Your Perfect Barber">
                <p className="text-xl text-gray-600 mb-10 max-w-2xl fade-in-up">
                    Discover and book the best local professionals on the leading booking platform.
                </p>
                <div className="fade-in-up">
                    <Link to="/signup" className="btn-primary text-lg px-10 py-4">Get Started</Link>
                </div>
                <p className="mt-6 text-sm text-gray-500 fade-in-up">Book in seconds. No waiting in line.</p>
            </BackgroundPaths>

            <FlowArt>
                {/* Feature Section 1 */}
                <FlowSection style={{ backgroundColor: '#f8f9fa' }}>
                    <div className="container-custom grid md:grid-cols-2 gap-16 items-center w-full">
                        <div className="order-2 md:order-1">
                            <div className="bg-white p-8 rounded-2xl shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="bg-white p-4 rounded-2xl shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-500 max-w-sm mx-auto">
                                    <img src="/booking-preview.png" alt="Booking Interface Preview" className="w-full h-auto rounded-xl object-cover shadow-inner" />
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Experience Premium Service</h2>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Intuitive search and booking tools. Effortlessly find salons, check availability, and book appointments in seconds.
                            </p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-gray-700 font-medium">
                                    <span className="text-primary text-xl">→</span> Instant Booking Confirmation
                                </li>
                                <li className="flex items-center gap-3 text-gray-700 font-medium">
                                    <span className="text-primary text-xl">→</span> Real-time Availability
                                </li>
                                <li className="flex items-center gap-3 text-gray-700 font-medium">
                                    <span className="text-primary text-xl">→</span> Verified Reviews
                                </li>
                            </ul>
                            <Link to="/signup" className="btn-secondary">Details</Link>
                        </div>
                    </div>
                </FlowSection>

                {/* Salons / Templates Section */}
                <FlowSection style={{ backgroundColor: '#ffffff' }}>
                    <div className="py-12 container-custom w-full">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Choose a professional</h2>
                            <p className="text-lg text-gray-600">Top rated salons and stylists ready for you.</p>
                        </div>

                        {loading ? (
                            <div className="flex justify-center p-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-3 gap-8">
                                {salons.map((salon) => (
                                    <div key={salon._id} className="card-minimal group cursor-pointer">
                                        <div className="h-64 overflow-hidden rounded-xl mb-6 relative">
                                            <img
                                                src={salon.images?.[0] || "/salon-placeholder.png"}
                                                alt={salon.name}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => { e.target.onerror = null; e.target.src = "/salon-placeholder.png" }}
                                            />
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                                {salon.city}
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{salon.name}</h3>
                                        <p className="text-gray-500 line-clamp-2 mb-6">{salon.description}</p>
                                        <Link to={`/salon/${salon._id}`} className="text-primary font-bold hover:underline underline-offset-4 flex items-center gap-2">
                                            View Details <span>→</span>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="text-center mt-12">
                            <Link to="/search" className="btn-secondary">View All Professionals</Link>
                        </div>
                    </div>
                </FlowSection>

                {/* CTA Section */}
                <FlowSection style={{ backgroundColor: '#116bf0' }} className="text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)' }}></div>
                    <div className="container-custom w-full">
                        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10 py-8 md:py-16">
                            <div className="text-left">
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">Elevate Your Style. <br/><span className="text-blue-200">Book Today.</span></h2>
                                <p className="text-lg md:text-xl text-blue-50 mb-10 max-w-lg leading-relaxed">
                                    Join thousands of others who have already booked their next appointment with ease. Experience premium service at your fingertips.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Link to="/signup" className="bg-white text-primary font-bold py-4 px-8 rounded-full hover:bg-gray-100 transition-all shadow-xl hover:-translate-y-1">Start Booking Now</Link>
                                    <Link to="/search" className="bg-transparent border border-blue-200 text-white font-bold py-4 px-8 rounded-full hover:bg-blue-700/50 transition-all">Explore Salons</Link>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500 border-4 border-white/20">
                                    <img src="/cta-image.png" alt="Premium Salon Experience" className="w-full h-[400px] object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </FlowSection>
            </FlowArt>
        </div>
    );
};

export default Home;
