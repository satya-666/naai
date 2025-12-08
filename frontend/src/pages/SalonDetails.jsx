import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import AuthContext from '../context/AuthContext';

const SalonDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [salon, setSalon] = useState(null);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const salonRes = await api.get(`/salons/${id}`);
                setSalon(salonRes.data);

                const slotsRes = await api.get(`/timeslots/${id}`);
                setSlots(slotsRes.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleBook = async (slotId) => {
        if (!user) {
            navigate('/login');
            return;
        }
        setBookingLoading(true);
        setMessage('');
        try {
            await api.post('/bookings', { salonId: id, slotId });
            setMessage('Booking successful!');
            // Refresh slots to show updated status
            const slotsRes = await api.get(`/timeslots/${id}`);
            setSlots(slotsRes.data);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <div className="text-center p-10">Loading...</div>;
    if (!salon) return <div className="text-center p-10">Salon not found</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-primary font-serif">{salon.name}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Salon Info */}
                <div>
                    <img
                        src={salon.images[0] || "https://via.placeholder.com/600x400"}
                        alt={salon.name}
                        className="w-full h-80 object-cover rounded-xl shadow-lg mb-6 border border-gray-700"
                    />
                    <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-sm border border-gray-700">
                        <p className="text-lg text-gray-300 mb-2 font-semibold">📍 {salon.address}, {salon.city}</p>
                        <p className="text-gray-400 leading-relaxed">{salon.description}</p>
                    </div>
                </div>

                {/* Booking Section */}
                <div>
                    <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700">
                        <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2 text-white">Book an Appointment</h2>
                        {message && (
                            <div className={`p-3 rounded mb-4 text-center font-medium ${message.includes('successful') ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'
                                }`}>
                                {message}
                            </div>
                        )}

                        <h3 className="text-lg font-semibold mb-3 text-primary">Available Time Slots</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {slots.map(slot => (
                                <button
                                    key={slot._id}
                                    disabled={slot.isBooked || bookingLoading}
                                    onClick={() => handleBook(slot._id)}
                                    className={`py-2 px-1 rounded-lg border text-sm font-medium transition-all duration-200
                                        ${slot.isBooked
                                            ? 'bg-gray-900 text-gray-600 cursor-not-allowed border-gray-800'
                                            : 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-primary hover:text-black hover:border-primary hover:shadow-md'
                                        }
                                    `}
                                >
                                    {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </button>
                            ))}
                        </div>
                        {slots.length === 0 && (
                            <p className="text-gray-500 text-center py-4 italic">No slots available for this salon.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalonDetails;
