import React, { useState } from 'react';
import {
    UserPlus,
    Search,
    MoreVertical,
    Mail,
    Phone,
    Shield,
    Edit2,
    Trash2,
    X,
    Eye,
    EyeOff,
    User,
    MapPin,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
} from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([
        {
            id: 1,
            name: 'John Anderson',
            email: 'john@dutchpoint.com',
            phone: '+1 234-567-8901',
            role: 'Guest',
            status: 'Active',
            joinDate: '2024-01-15',
            location: 'New York, USA',
            totalBookings: 12,
            totalSpent: 3450.00,
            avatar: 'JA',
        },
        {
            id: 2,
            name: 'Maria Garcia',
            email: 'maria@gmail.com',
            phone: '+1 345-678-9012',
            role: 'VIP Guest',
            status: 'Active',
            joinDate: '2023-08-22',
            location: 'Los Angeles, USA',
            totalBookings: 28,
            totalSpent: 12800.50,
            avatar: 'MG',
        },
        {
            id: 3,
            name: 'Robert Chen',
            email: 'robert.chen@outlook.com',
            phone: '+1 456-789-0123',
            role: 'Guest',
            status: 'Inactive',
            joinDate: '2024-03-10',
            location: 'San Francisco, USA',
            totalBookings: 3,
            totalSpent: 890.00,
            avatar: 'RC',
        },
        {
            id: 4,
            name: 'Sophie Williams',
            email: 'sophie.w@yahoo.com',
            phone: '+44 789-012-3456',
            role: 'VIP Guest',
            status: 'Active',
            joinDate: '2023-05-18',
            location: 'London, UK',
            totalBookings: 45,
            totalSpent: 22400.75,
            avatar: 'SW',
        },
        {
            id: 5,
            name: 'Ahmed Hassan',
            email: 'ahmed.h@gmail.com',
            phone: '+971 50-123-4567',
            role: 'Guest',
            status: 'Suspended',
            joinDate: '2024-06-01',
            location: 'Dubai, UAE',
            totalBookings: 1,
            totalSpent: 250.00,
            avatar: 'AH',
        },
        {
            id: 6,
            name: 'Lisa Park',
            email: 'lisa.park@hotmail.com',
            phone: '+82 10-1234-5678',
            role: 'Guest',
            status: 'Active',
            joinDate: '2024-02-28',
            location: 'Seoul, South Korea',
            totalBookings: 7,
            totalSpent: 1950.25,
            avatar: 'LP',
        },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'Guest',
        status: 'Active',
        location: '',
        password: '',
    });

    const roles = ['Guest', 'VIP Guest', 'Corporate', 'Admin'];
    const statuses = ['Active', 'Inactive', 'Suspended'];

    // Filtered users
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone.includes(searchQuery);
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });

    // Stats
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'Active').length;
    const vipUsers = users.filter(u => u.role === 'VIP Guest').length;
    const suspendedUsers = users.filter(u => u.status === 'Suspended').length;

    const handleAddUser = (e) => {
        e.preventDefault();
        const user = {
            id: users.length + 1,
            ...newUser,
            joinDate: new Date().toISOString().split('T')[0],
            totalBookings: 0,
            totalSpent: 0,
            avatar: newUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        };
        setUsers([...users, user]);
        setIsModalOpen(false);
        setNewUser({ name: '', email: '', phone: '', role: 'Guest', status: 'Active', location: '', password: '' });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setIsDetailOpen(true);
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'Active':
                return { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-600/20', icon: CheckCircle };
            case 'Inactive':
                return { bg: 'bg-gray-50', text: 'text-gray-600', ring: 'ring-gray-500/20', icon: Clock };
            case 'Suspended':
                return { bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-600/20', icon: XCircle };
            default:
                return { bg: 'bg-gray-50', text: 'text-gray-600', ring: 'ring-gray-500/20', icon: Clock };
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'VIP Guest':
                return 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20';
            case 'Corporate':
                return 'bg-purple-50 text-purple-700 ring-1 ring-purple-600/20';
            case 'Admin':
                return 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20';
            default:
                return 'bg-navy-50 text-navy-600 ring-1 ring-navy-500/20';
        }
    };

    const getAvatarGradient = (id) => {
        const gradients = [
            'from-blue-400 to-blue-600',
            'from-purple-400 to-purple-600',
            'from-teal-400 to-teal-600',
            'from-pink-400 to-pink-600',
            'from-amber-400 to-amber-600',
            'from-emerald-400 to-emerald-600',
        ];
        return gradients[id % gradients.length];
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-navy-900">User Management</h1>
                    <p className="text-navy-500 mt-1">Manage guests, VIPs, and user accounts</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                >
                    <UserPlus size={20} className="mr-2" />
                    Add New User
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-5 border border-navy-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-navy-500 text-sm font-medium">Total Users</p>
                            <h3 className="text-2xl font-bold text-navy-900 mt-1">{totalUsers}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <User size={22} />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-navy-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-navy-500 text-sm font-medium">Active Users</p>
                            <h3 className="text-2xl font-bold text-emerald-600 mt-1">{activeUsers}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                            <CheckCircle size={22} />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-navy-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-navy-500 text-sm font-medium">VIP Members</p>
                            <h3 className="text-2xl font-bold text-amber-600 mt-1">{vipUsers}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                            <Shield size={22} />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-navy-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-navy-500 text-sm font-medium">Suspended</p>
                            <h3 className="text-2xl font-bold text-red-600 mt-1">{suspendedUsers}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                            <XCircle size={22} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-navy-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="border border-navy-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                    >
                        <option value="all">All Roles</option>
                        {roles.map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border border-navy-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                    >
                        <option value="all">All Status</option>
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-navy-500">
                    Showing <span className="font-semibold text-navy-900">{filteredUsers.length}</span> of {totalUsers} users
                </p>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-navy-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-navy-50 text-navy-600 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Bookings</th>
                                <th className="px-6 py-4 text-right">Total Spent</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-navy-50">
                            {filteredUsers.map((user) => {
                                const statusConfig = getStatusConfig(user.status);
                                const StatusIcon = statusConfig.icon;
                                return (
                                    <tr key={user.id} className="hover:bg-navy-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(user.id)} flex items-center justify-center text-white font-bold text-sm mr-3 shadow-sm`}>
                                                    {user.avatar}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-navy-900">{user.name}</div>
                                                    <div className="text-xs text-navy-400 flex items-center mt-0.5">
                                                        <MapPin size={12} className="mr-1" />
                                                        {user.location}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-navy-700 flex items-center">
                                                <Mail size={14} className="mr-1.5 text-navy-400" />
                                                {user.email}
                                            </div>
                                            <div className="text-xs text-navy-400 flex items-center mt-1">
                                                <Phone size={12} className="mr-1.5" />
                                                {user.phone}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getRoleBadge(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} ring-1 ${statusConfig.ring}`}>
                                                <StatusIcon size={12} />
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-sm font-medium text-navy-700">
                                            {user.totalBookings}
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-sm font-bold text-navy-900">
                                            ${user.totalSpent.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => handleViewDetails(user)}
                                                    className="p-2 hover:bg-blue-50 rounded-lg text-navy-400 hover:text-blue-600 transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    className="p-2 hover:bg-navy-100 rounded-lg text-navy-400 hover:text-navy-600 transition-colors"
                                                    title="Edit User"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 hover:bg-red-50 rounded-lg text-navy-400 hover:text-red-500 transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <User size={48} className="mx-auto text-navy-200 mb-3" />
                        <h3 className="text-lg font-semibold text-navy-700">No users found</h3>
                        <p className="text-navy-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>

            {/* Add User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-navy-900">Add New User</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-navy-50 rounded-lg text-navy-400 hover:text-navy-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-navy-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                                    <input
                                        required
                                        type="text"
                                        value={newUser.name}
                                        onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                        placeholder="e.g. John Doe"
                                        className="w-full pl-10 pr-4 py-2.5 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-navy-700 mb-1">Email</label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                                        <input
                                            required
                                            type="email"
                                            value={newUser.email}
                                            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                            placeholder="user@email.com"
                                            className="w-full pl-10 pr-4 py-2.5 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-navy-700 mb-1">Phone</label>
                                    <div className="relative">
                                        <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                                        <input
                                            required
                                            type="tel"
                                            value={newUser.phone}
                                            onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
                                            placeholder="+1 234-567-8901"
                                            className="w-full pl-10 pr-4 py-2.5 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-navy-700 mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        required
                                        type={showPassword ? 'text' : 'password'}
                                        value={newUser.password}
                                        onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                        placeholder="Create a password"
                                        className="w-full px-4 py-2.5 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-navy-700 mb-1">Role</label>
                                    <select
                                        value={newUser.role}
                                        onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        {roles.map(role => <option key={role} value={role}>{role}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-navy-700 mb-1">Status</label>
                                    <select
                                        value={newUser.status}
                                        onChange={e => setNewUser({ ...newUser, status: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-navy-700 mb-1">Location</label>
                                <div className="relative">
                                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                                    <input
                                        type="text"
                                        value={newUser.location}
                                        onChange={e => setNewUser({ ...newUser, location: e.target.value })}
                                        placeholder="e.g. New York, USA"
                                        className="w-full pl-10 pr-4 py-2.5 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 border border-navy-200 rounded-lg text-navy-600 hover:bg-navy-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-500/30"
                                >
                                    Create User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* User Detail Drawer */}
            {isDetailOpen && selectedUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end z-50">
                    <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl animate-slide-in">
                        <div className="p-6 border-b border-navy-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-navy-900">User Details</h2>
                            <button
                                onClick={() => setIsDetailOpen(false)}
                                className="p-2 hover:bg-navy-50 rounded-lg text-navy-400 hover:text-navy-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Profile Header */}
                            <div className="text-center">
                                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getAvatarGradient(selectedUser.id)} flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg`}>
                                    {selectedUser.avatar}
                                </div>
                                <h3 className="text-xl font-bold text-navy-900 mt-3">{selectedUser.name}</h3>
                                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(selectedUser.role)}`}>
                                    {selectedUser.role}
                                </span>
                            </div>

                            {/* Contact Info */}
                            <div className="bg-navy-50 rounded-xl p-4 space-y-3">
                                <div className="flex items-center text-sm">
                                    <Mail size={16} className="text-navy-400 mr-3" />
                                    <span className="text-navy-700">{selectedUser.email}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <Phone size={16} className="text-navy-400 mr-3" />
                                    <span className="text-navy-700">{selectedUser.phone}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <MapPin size={16} className="text-navy-400 mr-3" />
                                    <span className="text-navy-700">{selectedUser.location}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <Calendar size={16} className="text-navy-400 mr-3" />
                                    <span className="text-navy-700">Joined {selectedUser.joinDate}</span>
                                </div>
                            </div>

                            {/* Activity Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 rounded-xl p-4 text-center">
                                    <p className="text-sm text-blue-600 font-medium">Total Bookings</p>
                                    <h4 className="text-2xl font-bold text-blue-700 mt-1">{selectedUser.totalBookings}</h4>
                                </div>
                                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                                    <p className="text-sm text-emerald-600 font-medium">Total Spent</p>
                                    <h4 className="text-2xl font-bold text-emerald-700 mt-1">${selectedUser.totalSpent.toLocaleString()}</h4>
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <h4 className="text-sm font-semibold text-navy-700 mb-2">Account Status</h4>
                                <div className="flex items-center justify-between bg-white border border-navy-100 rounded-xl p-4">
                                    {(() => {
                                        const config = getStatusConfig(selectedUser.status);
                                        const Icon = config.icon;
                                        return (
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
                                                <Icon size={14} />
                                                {selectedUser.status}
                                            </span>
                                        );
                                    })()}
                                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                        Change Status
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button className="flex-1 px-4 py-2.5 bg-navy-900 text-white rounded-lg hover:bg-navy-800 transition-colors font-medium flex items-center justify-center">
                                    <Edit2 size={16} className="mr-2" />
                                    Edit User
                                </button>
                                <button
                                    onClick={() => {
                                        handleDelete(selectedUser.id);
                                        setIsDetailOpen(false);
                                    }}
                                    className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium flex items-center"
                                >
                                    <Trash2 size={16} className="mr-2" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
