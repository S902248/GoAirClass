import React, { useState, useEffect } from 'react';
import { Search, Filter, Ban, CheckCircle, Trash2, MoreVertical, ShieldAlert, Loader2 } from 'lucide-react';
import { getAllUsers } from '../../api/adminApi';

const UserManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBlock = (id) => {
        // Implement block API call here
        setUsers(users.map(user =>
            user._id === id ? { ...user, status: user.status === 'Active' ? 'Blocked' : 'Active' } : user
        ));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            // Implement delete API call here
            setUsers(users.filter(user => user._id !== id));
        }
    };

    const filteredUsers = users.filter(user =>
        (user.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.mobileNumber || '').includes(searchQuery) ||
        (user.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-96 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 text-[#d84e55] animate-spin" />
                <p className="text-gray-400 font-black uppercase text-xs tracking-[0.2em]">Loading Users Data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-deep-navy uppercase tracking-tight mb-2">User Management</h1>
                    <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.2em]">Manage and monitor all platform users</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-[#d84e55] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name or mobile..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border-2 border-gray-100 rounded-2xl py-3 pl-12 pr-6 text-sm font-medium focus:border-[#d84e55] focus:ring-4 focus:ring-red-50 transition-all w-80 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-50">
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">User Details</th>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined Date</th>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-[#d84e55] uppercase tracking-tighter shrink-0 border-2 border-white shadow-sm">
                                            {(user.fullName || 'UN').substring(0, 2)}
                                        </div>
                                        <div>
                                            <p className="font-black text-deep-navy uppercase tracking-tight mb-1">{user.fullName || 'Unknown User'}</p>
                                            <p className="text-xs font-bold text-gray-400 tracking-wide">{user.mobileNumber} {user.email ? `• ${user.email}` : ''}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${user.status !== 'Blocked' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                        }`}>
                                        {user.status || 'Active'}
                                    </span>
                                </td>
                                <td className="px-10 py-8 text-sm font-bold text-gray-500 uppercase tracking-tighter">
                                    {new Date(user.createdAt).toLocaleDateString('en-CA')}
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleBlock(user._id)}
                                            className={`p-3 rounded-xl transition-all hover:scale-110 active:scale-95 ${user.status !== 'Blocked' ? 'bg-gray-50 text-amber-500 hover:bg-amber-50' : 'bg-emerald-50 text-emerald-600'
                                                }`}
                                            title={user.status !== 'Blocked' ? 'Block User' : 'Unblock User'}
                                        >
                                            {user.status !== 'Blocked' ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="p-3 bg-gray-50 text-red-500 hover:bg-red-50 rounded-xl transition-all hover:scale-110 active:scale-95"
                                            title="Delete User"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredUsers.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="h-8 w-8 text-gray-200" />
                        </div>
                        <p className="text-lg font-black text-gray-300 uppercase tracking-tighter">No users found matching your search</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
