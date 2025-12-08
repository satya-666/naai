import { useEffect, useState, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';

const BarberDashboard = () => {
    const { user } = useContext(AuthContext);
    const [salon, setSalon] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [newSlotTime, setNewSlotTime] = useState('');
    const [newSlotDate, setNewSlotDate] = useState(new Date().toISOString().split('T')[0]); const [salonData, setSalonData] = useState({ name: '', address: '', city: '', description: '', image: '' });
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const { data } = await api.post('/upload', formData, config);
            // Result is like "/uploads/image.jpg"
            // Since backend runs on 5001 and frontend on 5173, we need to ensure the path is full URL or handled by proxy
            // But typically MERN setup: store path, and when displaying, prepend backend URL if needed.
            // However, our image src often expects full URL.
            // Let's store the relative path and assume we prepend API_URL constant or similar if needed, 
            // OR store full local URL. For simplicity, let's prepend backend URL here if we can knowing it, but hardcoding is bad.
            // Actually, let's just save the relative path "/uploads/..." and standardise on that.
            // BUT our existing images are absolute https:// URLs or /default-salon.jpg.
            // So we should probably prepend backend base URL.

            // Hack for dev: Assume localhost:5001
            setSalonData({ ...salonData, image: `http://localhost:5001${data}` });
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
            setMessage('File upload failed');
        }
    };

    const handleUpdateSalon = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...salonData };
            // If image is empty/default-salon.jpg, ensure we keep it consistent or allow updating
            if (!payload.image) {
                payload.images = ['/default-salon.jpg'];
            } else {
                payload.images = [payload.image];
            }
            delete payload.image; // Cleanup before sending

            const res = await api.put(`/salons/${salon._id}`, payload);
            setSalon(res.data);
            setMessage('Salon updated successfully!');
            setIsEditing(false);
        } catch (error) {
            setMessage('Error updating salon');
        }
    };

    const startEditing = () => {
        setSalonData({
            name: salon.name,
            address: salon.address,
            city: salon.city,
            description: salon.description,
            image: salon.images && salon.images.length > 0 ? salon.images[0] : ''
        });
        setIsEditing(true);
    };

    const fetchData = async () => {
        try {
            const res = await api.get('/salons?limit=500');
            // Better to have /api/salons/mine endpoint, but finding by barberId works for now
            const mySalon = res.data.salons.find(s => s.barberId._id === user._id || s.barberId === user._id);
            setSalon(mySalon);

            if (mySalon) {
                const bookingRes = await api.get(`/bookings/salon/${mySalon._id}`);
                setBookings(bookingRes.data);

                const slotsRes = await api.get(`/timeslots/${mySalon._id}`);
                setSlots(slotsRes.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user._id]);

    const handleCreateSalon = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...salonData };
            if (!payload.image) {
                payload.images = ['/default-salon.jpg'];
            } else {
                payload.images = [payload.image];
            }
            delete payload.image;

            await api.post('/salons', payload);
            setMessage('Salon created successfully!');
            fetchData();
        } catch (error) {
            setMessage('Error creating salon');
        }
    };

    const handleDeleteSalon = async () => {
        if (!window.confirm("Are you sure? This will delete your salon and all bookings permanently.")) return;
        try {
            await api.delete(`/salons/${salon._id}`);
            setSalon(null);
            setMessage('Salon deleted successfully.');
            setBookings([]);
        } catch (error) {
            setMessage('Failed to delete salon');
        }
    }

    const handleAddSlot = async (e) => {
        e.preventDefault();
        if (!salon || !newSlotTime || !newSlotDate) return;

        try {
            const date = new Date(`${newSlotDate}T${newSlotTime}`);

            await api.post('/timeslots', {
                salonId: salon._id,
                startTime: date.toISOString()
            });
            setMessage('Slot added!');
            // Refresh slots
            const slotsRes = await api.get(`/timeslots/${salon._id}`);
            setSlots(slotsRes.data);
        } catch (error) {
            setMessage('Error adding slot');
        }
    };

    const handleDeleteSlot = async (slotId) => {
        if (!window.confirm("Delete this slot?")) return;
        try {
            await api.delete(`/timeslots/${slotId}`);
            setSlots(slots.filter(s => s._id !== slotId));
            setMessage('Slot deleted');
        } catch (error) {
            setMessage('Error deleting slot');
        }
    };

    // Group slots by date for calendar view
    const groupedSlots = slots.reduce((acc, slot) => {
        const date = new Date(slot.startTime).toLocaleDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(slot);
        return acc;
    }, {});

    if (loading) return <div className="p-10 text-center text-primary">Loading...</div>;

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-primary font-serif">Manage Your Salon</h1>

            {message && <div className="p-4 bg-gray-800 border border-primary text-primary rounded-lg mb-6 shadow-lg shadow-yellow-900/10 animate-pulse">{message}</div>}

            {!salon ? (
                <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-2xl max-w-xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6 text-white font-serif">Establish Your Brand</h2>
                    <form onSubmit={handleCreateSalon} className="space-y-5">
                        <input type="text" placeholder="Salon Name" className="premium-input"
                            value={salonData.name} onChange={e => setSalonData({ ...salonData, name: e.target.value })} required />
                        <input type="text" placeholder="Address" className="premium-input"
                            value={salonData.address} onChange={e => setSalonData({ ...salonData, address: e.target.value })} required />
                        <input type="text" placeholder="City" className="premium-input"
                            value={salonData.city} onChange={e => setSalonData({ ...salonData, city: e.target.value })} required />

                        <div className="space-y-2">
                            <label className="text-gray-400 text-sm ml-1">Salon Image</label>
                            <div className="flex gap-2">
                                <input type="text" placeholder="Enter URL" className="premium-input flex-1"
                                    value={salonData.image} onChange={e => setSalonData({ ...salonData, image: e.target.value })} />
                                <div className="relative">
                                    <input type="file" onChange={uploadFileHandler} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    <button type="button" className="premium-btn px-4 h-full flex items-center justify-center whitespace-nowrap bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white shadow-none">
                                        {uploading ? 'Uploading...' : 'Upload'}
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 ml-1">Or leave empty for default</p>
                        </div>

                        <textarea placeholder="Description" className="premium-input h-32"
                            value={salonData.description} onChange={e => setSalonData({ ...salonData, description: e.target.value })}></textarea>
                        <button type="submit" className="premium-btn w-full">Create Salon</button>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Salon Management */}
                    <div className="space-y-8">
                        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-lg relative group">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={startEditing} className="text-blue-500 hover:text-blue-400 text-sm uppercase font-bold tracking-widest border border-blue-900 px-3 py-1 rounded hover:bg-blue-900/20 transition-all">
                                    Edit
                                </button>
                                <button onClick={handleDeleteSalon} className="text-red-500 hover:text-red-400 text-sm uppercase font-bold tracking-widest border border-red-900 px-3 py-1 rounded hover:bg-red-900/20 transition-all">
                                    Delete
                                </button>
                            </div>

                            {isEditing ? (
                                <form onSubmit={handleUpdateSalon} className="space-y-4 mb-4">
                                    <input type="text" placeholder="Salon Name" className="premium-input"
                                        value={salonData.name} onChange={e => setSalonData({ ...salonData, name: e.target.value })} required />
                                    <input type="text" placeholder="Address" className="premium-input"
                                        value={salonData.address} onChange={e => setSalonData({ ...salonData, address: e.target.value })} required />
                                    <input type="text" placeholder="City" className="premium-input"
                                        value={salonData.city} onChange={e => setSalonData({ ...salonData, city: e.target.value })} required />

                                    <div className="space-y-2">
                                        <label className="text-gray-400 text-sm ml-1">Salon Image</label>
                                        <div className="flex gap-2">
                                            <input type="text" placeholder="Enter URL" className="premium-input flex-1"
                                                value={salonData.image} onChange={e => setSalonData({ ...salonData, image: e.target.value })} />
                                            <div className="relative">
                                                <input type="file" onChange={uploadFileHandler} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                                <button type="button" className="premium-btn px-4 h-full flex items-center justify-center whitespace-nowrap bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white shadow-none">
                                                    {uploading ? '...' : 'Upload'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <textarea placeholder="Description" className="premium-input h-24"
                                        value={salonData.description} onChange={e => setSalonData({ ...salonData, description: e.target.value })}></textarea>
                                    <div className="flex gap-2">
                                        <button type="submit" className="premium-btn flex-1">Save Changes</button>
                                        <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border border-gray-600 text-gray-300 rounded-full hover:bg-gray-700">Cancel</button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <img src={salon.images[0]} alt={salon.name} className="w-full h-48 object-cover rounded-lg mb-4 border border-gray-700" />
                                    <h2 className="text-2xl font-bold mb-2 text-white font-serif">{salon.name}</h2>
                                    <p className="text-gray-400 mb-4">{salon.address}, {salon.city}</p>
                                    <p className="text-gray-500 text-sm mb-6">{salon.description}</p>
                                </>
                            )}

                            <div className="border-t border-gray-700 pt-6">
                                <h3 className="font-semibold mb-4 text-primary tracking-wide uppercase text-sm">Add Time Slot</h3>
                                <form onSubmit={handleAddSlot} className="flex gap-4">
                                    <input type="date" className="premium-input w-1/3"
                                        value={newSlotDate} onChange={e => setNewSlotDate(e.target.value)} required />
                                    <input type="time" className="premium-input flex-1"
                                        value={newSlotTime} onChange={e => setNewSlotTime(e.target.value)} required />
                                    <button type="submit" className="premium-btn">Add Slot</button>
                                </form>
                            </div>
                        </div>

                        {/* Calendar / Slot List */}
                        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-lg">
                            <h2 className="text-xl font-bold mb-4 text-white font-serif">Manage Slots</h2>
                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                {Object.keys(groupedSlots).length === 0 ? <p className="text-gray-500">No slots created.</p> :
                                    Object.entries(groupedSlots).map(([date, daySlots]) => (
                                        <div key={date}>
                                            <h4 className="text-primary font-bold mb-2">{date}</h4>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                {daySlots.map(slot => (
                                                    <div key={slot._id} className={`p-2 rounded border text-center relative group
                                                        ${slot.isBooked ? 'bg-red-900/20 border-red-900 text-red-400' : 'bg-green-900/20 border-green-900 text-green-400'}
                                                    `}>
                                                        <span className="text-sm font-semibold">
                                                            {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        {!slot.isBooked && (
                                                            <button
                                                                onClick={() => handleDeleteSlot(slot._id)}
                                                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                ×
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                    {/* Bookings */}
                    <div>
                        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-lg">
                            <h2 className="text-xl font-bold mb-6 text-white font-serif border-b border-gray-700 pb-4">Upcoming Appointments</h2>
                            {bookings.length === 0 ? <p className="text-gray-500 italic">No appointments scheduled yet.</p> : (
                                <ul className="space-y-4">
                                    {bookings.map(b => (
                                        <li key={b._id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold text-gray-200">{b.userId ? b.userId.name : 'Guest User'}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{b.userId?.email}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-primary font-bold">
                                                        {new Date(b.slotId.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(b.slotId.startTime).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BarberDashboard;
