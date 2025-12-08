import { useEffect, useState } from 'react';
import api from '../api';

const AdminDashboard = () => {
    const [salons, setSalons] = useState([]);

    useEffect(() => {
        const fetchSalons = async () => {
            const res = await api.get('/salons');
            setSalons(res.data);
        };
        fetchSalons();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this salon?')) {
            try {
                await api.delete(`/salons/${id}`);
                setSalons(salons.filter(s => s._id !== id));
            } catch (error) {
                alert('Error deleting salon');
            }
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="bg-white rounded shadowoverflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salon Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Barber</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {salons.map(s => (
                            <tr key={s._id}>
                                <td className="px-6 py-4">{s.name}</td>
                                <td className="px-6 py-4">{s.barberId ? s.barberId.name : 'Unknown'}</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleDelete(s._id)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
