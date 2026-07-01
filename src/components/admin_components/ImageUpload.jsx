import React, { useState } from 'react';
import { Upload, X, CheckCircle, RefreshCw } from 'lucide-react';

const ImageUpload = ({ onUploadSuccess, currentImage, label }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        console.log('Starting upload for:', file.name, file.size, file.type);

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Calling our own backend instead of Cloudinary directly to bypass network blocks
            const response = await fetch(
                'http://localhost:5000/api/upload/image',
                {
                    method: 'POST',
                    body: formData,
                    // No headers needed for FormData
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error('Backend Upload Error Details:', data);
                throw new Error(data.message || 'Upload failed');
            }

            console.log('Upload successful! URL:', data.url);
            onUploadSuccess(data.url);
            setUploading(false);
        } catch (err) {
            console.error('Final Upload Error:', err);
            setError(err.message);
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1">
                {label || 'Upload Image'}
            </label>
            
            <div className="flex items-center gap-4">
                {currentImage && (currentImage.startsWith('http') || currentImage.startsWith('/')) ? (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-navy-100 shadow-sm group">
                        <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <label className="cursor-pointer p-1.5 bg-white/20 rounded-full hover:bg-white/40 transition-colors">
                                <Upload size={14} className="text-white" />
                                <input type="file" className="hidden" onChange={handleUpload} accept="image/*" disabled={uploading} />
                            </label>
                        </div>
                        {uploading && (
                            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                <RefreshCw size={16} className="text-navy-900 animate-spin" />
                            </div>
                        )}
                    </div>
                ) : (
                    <label className={`flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${error ? 'border-red-200 bg-red-50 hover:bg-red-100' : 'border-navy-100 bg-navy-50 hover:bg-navy-100'}`}>
                        {uploading ? (
                            <RefreshCw size={20} className="text-navy-400 animate-spin" />
                        ) : (
                            <Upload size={20} className="text-navy-300" />
                        )}
                        <input type="file" className="hidden" onChange={handleUpload} accept="image/*" disabled={uploading} />
                    </label>
                )}

                <div className="flex-1">
                    {uploading ? (
                        <p className="text-xs text-navy-400 animate-pulse">Uploading to Cloudinary...</p>
                    ) : currentImage ? (
                        <div className="flex items-center gap-1.5 text-emerald-600">
                            <CheckCircle size={14} />
                            <p className="text-xs font-medium">Image Uploaded</p>
                        </div>
                    ) : (
                        <p className="text-xs text-navy-400">JPG, PNG or WEBP (Max 5MB)</p>
                    )}
                    {error && <p className="text-[10px] text-red-500 mt-1 font-medium">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;
