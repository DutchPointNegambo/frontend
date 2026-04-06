import React, { useState, useEffect, useCallback } from 'react';
import {
    UserPlus, Search, Mail, Phone, Shield, Edit2, Trash2, X, Eye, EyeOff,
    User, MapPin, Calendar, CheckCircle, XCircle, Clock, RefreshCw,
} from 'lucide-react';
import { fetchUsers, createUser as apiCreateUser, updateUser as apiUpdateUser, deleteUser as apiDeleteUser } from '../../utils/api';
import Toast from '../../components/admin_components/Toast';
import { useToast } from '../../components/admin_components/useToast';

const ROLE_MAP = { guest: 'Guest', admin: 'Admin', staff: 'Staff' };
const ROLE_TO_API = { 'Guest': 'guest', 'Admin': 'admin', 'Staff': 'staff' };

const normalise = (u) => ({
    id: u._id,
    name: `${u.firstName} ${u.lastName}`,
    email: u.email,
    phone: u.phone || '',
    role: ROLE_MAP[u.role] || 'Guest',
    status: u.status || 'Active',
    joinDate: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : '',
    location: u.location || '',
    totalBookings: u.totalBookings || 0,
    totalSpent: u.totalSpent || 0,
    avatar: `${u.firstName?.[0] || ''}${u.lastName?.[0] || ''}`.toUpperCase(),
    _raw: u,
});

const UserManagement = () => {
    const { toast, showToast, clearToast } = useToast();
    const [users, setUsers] = useState([]);
    const [apiLoading, setApiLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [saving, setSaving] = useState(false);
    const [newUser, setNewUser] = useState({
        firstName: '', lastName: '', email: '', phone: '', role: 'Guest', status: 'Active', location: '', password: '',
    });

    const roles = ['Guest', 'Staff', 'Admin'];
    const statuses = ['Active', 'Inactive', 'Suspended'];

    const loadUsers = useCallback(async () => {
        setApiLoading(true);
        try {
            const data = await fetchUsers({ limit: 100 });
            setUsers(data.users.map(normalise));
        } catch (e) {
            console.warn('API error:', e.message);
        } finally {
            setApiLoading(false);
        }
    }, []);

    useEffect(() => { loadUsers(); }, [loadUsers]);

    const openAddModal = () => {
        setIsEditing(false);
        setNewUser({ firstName: '', lastName: '', email: '', phone: '', role: 'Guest', status: 'Active', location: '', password: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setIsEditing(true);
        setSelectedUser(user);
        const [firstName, ...rest] = user.name.split(' ');
        setNewUser({
            firstName: firstName || '',
            lastName: rest.join(' ') || '',
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status,
            location: user.location || '',
            password: '',
        });
        setIsModalOpen(true);
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        
        if (newUser.password && newUser.password.length < 8) {
            showToast('Password must be at least 8 characters', 'error');
            return;
        }

        if (newUser.phone && newUser.phone.length !== 10) {
            showToast('Phone number must be exactly 10 digits', 'error');
            return;
        }

        setSaving(true);
        try {
            const payload = {
                firstName: newUser.firstName, 
                lastName: newUser.lastName, 
                email: newUser.email, 
                phone: newUser.phone,
                role: ROLE_TO_API[newUser.role] || 'guest',
                location: newUser.location,
                status: newUser.status
            };
            if (newUser.password) payload.password = newUser.password;

            if (isEditing && selectedUser) {
                const userId = selectedUser._raw?._id || selectedUser.id;
                const updated = await apiUpdateUser(userId, payload);
                setUsers(prev => prev.map(u => (u.id === selectedUser.id ? normalise(updated) : u)));
                showToast('User updated successfully');
            } else {
                const created = await apiCreateUser(payload);
                setUsers(prev => [normalise(created), ...prev]);
                showToast('User created successfully');
            }
            setIsModalOpen(false);
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleStatusChange = async (user, newStatus) => {
        try {
            const userId = user._raw?._id || user.id;
            const updated = await apiUpdateUser(userId, { status: newStatus });
            const normalised = normalise(updated);
            setUsers(prev => prev.map(u => (u.id === user.id ? normalised : u)));
            if (selectedUser?.id === user.id) setSelectedUser(normalised);
            showToast(`Status updated to ${newStatus}`);
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const handleDelete = async (id) => {
        const user = users.find(u => u.id === id);
        if (!user) return;
        if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) return;
        try {
            const userId = user._raw?._id || user.id;
            if (typeof userId === 'string' && userId.length > 20) {
                await apiDeleteUser(userId);
            }
            setUsers(prev => prev.filter(u => u.id !== id));
            showToast('User deleted successfully');
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone.includes(searchQuery);
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const getStatusConfig = (status) => {
        switch (status) {
            case 'Active': return { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-600/20', icon: CheckCircle };
            case 'Inactive': return { bg: 'bg-gray-50', text: 'text-gray-600', ring: 'ring-gray-500/20', icon: Clock };
            case 'Suspended': return { bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-600/20', icon: XCircle };
            default: return { bg: 'bg-gray-50', text: 'text-gray-600', ring: 'ring-gray-500/20', icon: Clock };
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'Admin': return 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20';
            case 'Staff': return 'bg-purple-50 text-purple-700 ring-1 ring-purple-600/20';
            default: return 'bg-navy-50 text-navy-600 ring-1 ring-navy-500/20';
        }
    };

    const getAvatarGradient = (id) => {
        const gradients = ['from-blue-400 to-blue-600', 'from-purple-400 to-purple-600', 'from-teal-400 to-teal-600', 'from-pink-400 to-pink-600', 'from-amber-400 to-amber-600', 'from-emerald-400 to-emerald-600'];
        const index = typeof id === 'string' ? id.charCodeAt(0) : id;
        return gradients[index % gradients.length];
    };

    return (
        <div className="space-y-6">
            {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-navy-900">User Management</h1>
                    <p className="text-navy-400 mt-0.5 text-sm">Manage guests and user accounts</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={loadUsers} disabled={apiLoading} className="flex items-center gap-2 px-3 py-2 bg-white border border-navy-200 text-navy-600 rounded-xl hover:bg-navy-50 transition-colors text-sm font-medium shadow-sm disabled:opacity-50">
                        <RefreshCw size={14} className={apiLoading ? 'animate-spin' : ''} /> Refresh
                    </button>
                    <button onClick={openAddModal} className="bg-navy-900 text-white px-5 py-2.5 rounded-xl flex items-center hover:bg-teal-700 transition-all duration-300 shadow-sm">
                        <UserPlus size={18} className="mr-2" />
                        Add New User
                    </button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-navy-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-400" />
                    <input type="text" placeholder="Search by name, email, or phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="border border-navy-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm">
                        <option value="all">All Roles</option>
                        {roles.map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border border-navy-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm">
                        <option value="all">All Status</option>
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-navy-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-navy-50 text-navy-600 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
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
                                                    <div className="font-semibold text-navy-900 text-sm">{user.name}</div>
                                                    <div className="text-xs text-navy-400">{user.location}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-navy-700 flex items-center"><Mail size={12} className="mr-1.5 text-navy-400" />{user.email}</div>
                                            <div className="text-xs text-navy-400 flex items-center mt-1"><Phone size={12} className="mr-1.5" />{user.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getRoleBadge(user.role)}`}>{user.role}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${statusConfig.bg} ${statusConfig.text} ring-1 ${statusConfig.ring}`}>
                                                <StatusIcon size={10} /> {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => { setSelectedUser(user); setIsDetailOpen(true); }} className="p-2 hover:bg-blue-50 rounded-lg text-navy-400 hover:text-blue-600 transition-colors"><Eye size={16} /></button>
                                                <button onClick={() => openEditModal(user)} className="p-2 hover:bg-navy-100 rounded-lg text-navy-400 hover:text-navy-600 transition-colors"><Edit2 size={16} /></button>
                                                <button onClick={() => handleDelete(user.id)} className="p-2 hover:bg-red-50 rounded-lg text-navy-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-navy-900">{isEditing ? 'Edit User' : 'Add New User'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-navy-50 rounded-lg text-navy-400 hover:text-navy-600 transition-colors"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSaveUser} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-navy-700 mb-1">First Name</label>
                                    <input required type="text" value={newUser.firstName} onChange={e => setNewUser({ ...newUser, firstName: e.target.value })} className="w-full px-4 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-navy-700 mb-1">Last Name</label>
                                    <input type="text" value={newUser.lastName} onChange={e => setNewUser({ ...newUser, lastName: e.target.value })} className="w-full px-4 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-navy-700 mb-1">Email</label>
                                    <input required type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="w-full px-4 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-navy-700 mb-1">Phone</label>
                                    <input required type="tel" pattern="[0-9]{10}" title="Ten digits only" value={newUser.phone} onChange={e => setNewUser({ ...newUser, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} className="w-full px-4 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-navy-700 mb-1">Password</label>
                                <div className="relative">
                                    <input required={!isEditing} type={showPassword ? 'text' : 'password'} minLength={8} value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} placeholder={isEditing ? 'Leave blank to keep current' : ''} className="w-full px-4 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-navy-700 mb-1">Role</label>
                                    <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} className="w-full px-4 py-2 border border-navy-200 rounded-lg bg-white">
                                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-navy-700 mb-1">Status</label>
                                    <select value={newUser.status} onChange={e => setNewUser({ ...newUser, status: e.target.value })} className="w-full px-4 py-2 border border-navy-200 rounded-lg bg-white">
                                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-navy-700 mb-1">Location</label>
                                <input type="text" value={newUser.location} onChange={e => setNewUser({ ...newUser, location: e.target.value })} className="w-full px-4 py-2 border border-navy-200 rounded-lg" />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-navy-200 rounded-lg">Cancel</button>
                                <button type="submit" disabled={saving} className="flex-1 bg-navy-900 text-white rounded-lg py-2 flex items-center justify-center gap-2 disabled:opacity-50">
                                    {saving && <RefreshCw size={14} className="animate-spin" />}
                                    {isEditing ? 'Save Changes' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDetailOpen && selectedUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end z-50">
                    <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 space-y-6 overflow-y-auto">
                        <div className="flex justify-between items-center border-b border-navy-100 pb-4">
                            <h2 className="text-xl font-bold">User Details</h2>
                            <button onClick={() => setIsDetailOpen(false)}><X size={20} /></button>
                        </div>
                        <div className="text-center">
                            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getAvatarGradient(selectedUser.id)} flex items-center justify-center text-white text-2xl font-bold mx-auto`}>{selectedUser.avatar}</div>
                            <h3 className="text-xl font-bold mt-3">{selectedUser.name}</h3>
                            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(selectedUser.role)}`}>{selectedUser.role}</span>
                        </div>
                        <div className="bg-navy-50 rounded-xl p-4 space-y-3 text-sm">
                            <div className="flex items-center"><Mail size={16} className="text-navy-400 mr-3" />{selectedUser.email}</div>
                            <div className="flex items-center"><Phone size={16} className="text-navy-400 mr-3" />{selectedUser.phone}</div>
                            <div className="flex items-center"><MapPin size={16} className="text-navy-400 mr-3" />{selectedUser.location}</div>
                            <div className="flex items-center"><Calendar size={16} className="text-navy-400 mr-3" />Joined {selectedUser.joinDate}</div>
                        </div>
                        <div>
                            <p className="text-sm font-semibold mb-2">Account Status</p>
                            <select value={selectedUser.status} onChange={(e) => handleStatusChange(selectedUser, e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white">
                                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="flex gap-3 pt-6">
                            <button onClick={() => openEditModal(selectedUser)} className="flex-1 bg-navy-900 text-white rounded-lg py-2.5 flex items-center justify-center gap-2"><Edit2 size={16} /> Edit</button>
                            <button onClick={() => { handleDelete(selectedUser.id); setIsDetailOpen(false); }} className="flex-1 bg-red-50 text-red-600 rounded-lg py-2.5 flex items-center justify-center gap-2"><Trash2 size={16} /> Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
