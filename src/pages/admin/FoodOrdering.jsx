import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { fetchFoods, createFood, deleteFood, updateFood } from '../../utils/api';
import toast from 'react-hot-toast';

const FoodOrdering = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [newItem, setNewItem] = useState({ name: '', category: 'Signature Dishes & Global Cuisine', price: '', status: 'Available', image: '', description: '' });

    const categories = [
        'Signature Dishes & Global Cuisine', 
        'Fried Rice — Sri Lankan Style', 
        'Kottu — Sri Lanka\'s Iconic Street Food', 
        'Beverages', 
        'Desserts'
    ];

    useEffect(() => {
        loadFoods();
    }, []);

    const loadFoods = async () => {
        try {
            const data = await fetchFoods();
            setMenuItems(data);
        } catch (error) {
            console.error("Failed to load foods", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteFood(id);
                setMenuItems(menuItems.filter(item => item._id !== id));
            } catch (error) {
                console.error("Failed to delete food", error);
            }
        }
    };

    const handleEdit = (item) => {
        setNewItem({
            name: item.name,
            category: item.category,
            price: item.price,
            status: item.status,
            image: item.image,
            description: item.description || ''
        });
        setCurrentId(item._id);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const itemData = {
            ...newItem,
            price: parseFloat(newItem.price),
            image: newItem.image || '🍽️'
        };

        try {
            if (isEditing) {
                const updatedItem = await updateFood(currentId, itemData);
                setMenuItems(menuItems.map(item => item._id === currentId ? updatedItem : item));
            } else {
                const addedItem = await createFood(itemData);
                setMenuItems([...menuItems, addedItem]);
            }
            closeModal();
        } catch (error) {
            console.error("Failed to save food", error);
            toast.error('Failed to save food item');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setCurrentId(null);
        setNewItem({ name: '', category: 'Signature Dishes & Global Cuisine', price: '', status: 'Available', image: '', description: '' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-navy-900">Food Menu Management</h1>
                    <p className="text-navy-500 mt-1">Manage your restaurant menu items and pricing</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
                >
                    <Plus size={20} className="mr-2" />
                    Add New Item
                </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-navy-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-400" />
                    <input
                        type="text"
                        placeholder="Search menu items..."
                        className="w-full pl-10 pr-4 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter size={20} className="text-navy-400" />
                    <select className="border border-navy-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option value="all">All Categories</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {menuItems.map((item) => (
                    <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-navy-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                        <div className={`h-40 flex items-center justify-center overflow-hidden text-6xl bg-gradient-to-br ${item.status === 'Available' ? 'from-blue-50 to-blue-100' : 'from-gray-100 to-gray-200'}`}>
                            {item.image && item.image.startsWith('http') ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                                <span>{item.image}</span>
                            )}
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-navy-50 text-navy-600">
                                    {item.category}
                                </span>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.status === 'Available' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {item.status}
                                </span>
                            </div>
                            <h3 className="font-bold text-navy-900 text-lg">{item.name}</h3>
                            <p className="text-2xl font-bold text-blue-600 mt-2">Rs. {item.price.toFixed(2)}</p>

                            <div className="flex gap-2 mt-4 pt-4 border-t border-navy-50 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => handleEdit(item)}
                                    className="flex-1 py-2 bg-navy-50 text-navy-600 rounded-lg hover:bg-navy-100 flex items-center justify-center font-medium text-sm"
                                >
                                    <Edit2 size={16} className="mr-2" /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="flex-none p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 hover:text-red-600"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Item Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-navy-100 flex-shrink-0">
                            <h2 className="text-2xl font-bold text-navy-900">{isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
                        </div>
                        <div className="overflow-y-auto flex-1">
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-navy-700 mb-1">Item Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={newItem.name}
                                        onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-navy-700 mb-1">Price (Rs.)</label>
                                        <input
                                            required
                                            type="number"
                                            step="0.01"
                                            value={newItem.price}
                                            onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                                            className="w-full px-3 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-navy-700 mb-1">Category</label>
                                        <select
                                            value={newItem.category}
                                            onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                            className="w-full px-3 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        >
                                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-navy-700 mb-1">Status</label>
                                    <select
                                        value={newItem.status}
                                        onChange={e => setNewItem({ ...newItem, status: e.target.value })}
                                        className="w-full px-3 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="Available">Available</option>
                                        <option value="Out of Stock">Out of Stock</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-navy-700 mb-1">Image URL or Emoji</label>
                                    <input
                                        type="text"
                                        value={newItem.image}
                                        onChange={e => setNewItem({ ...newItem, image: e.target.value })}
                                        placeholder="e.g. https://... or 🍕"
                                        className="w-full px-3 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-navy-700 mb-1">Description</label>
                                    <textarea
                                        rows="3"
                                        value={newItem.description}
                                        onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                                        placeholder="Brief description of the dish..."
                                        className="w-full px-3 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-2 border border-navy-200 rounded-lg text-navy-600 hover:bg-navy-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        {isEditing ? 'Save Changes' : 'Add Item'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FoodOrdering;
