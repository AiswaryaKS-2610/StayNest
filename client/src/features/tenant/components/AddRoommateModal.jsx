import React, { useState } from 'react';
import { auth } from '../../../firebase.config';
import { addRoommateProfile } from '../../../services/roommateService';

const AVAILABLE_TAGS = [
    'Early Bird', 'Night Owl', 'Smoker', 'Non-Smoker', 'Pet Friendly',
    'Vegan', 'Studious', 'Social', 'Gamer', 'Fitness', 'Clean Freak', 'Chill'
];

const LANGUAGE_OPTIONS = [
    'No Preference',
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Malayalam',
    'Tamil', 'Telugu', 'Other'
];

const PLACE_OPTIONS = [
    'No Preference',
    'Ireland', 'UK', 'USA', 'Canada', 'Australia', 'Spain', 'France',
    'Germany', 'Italy', 'Portugal', 'China', 'India', 'Brazil', 'Other'
];

const AddRoommateModal = ({ isOpen, onClose, onProfileAdded, existingProfile }) => {
    const [loading, setLoading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: existingProfile?.name || auth.currentUser?.displayName || '',
        age: existingProfile?.age || '',
        location: existingProfile?.location || '',
        budget: existingProfile?.budget || '',
        bio: existingProfile?.bio || '',
        tags: existingProfile?.tags || [],
        image: existingProfile?.image || auth.currentUser?.photoURL || '',
        languagePreference: existingProfile?.languagePreference || '',
        placePreference: existingProfile?.placePreference || ''
    });

    if (!isOpen) return null;

    const toggleTag = (tag) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag]
        }));
    };

    const handleImageUpload = async (e) => {
        if (!e.target.files || !e.target.files[0]) return;

        setImageUploading(true);
        try {
            const file = e.target.files[0];
            const cloudName = 'daszhocrj';
            const uploadPreset = 'staynest_preset';

            const data = new FormData();
            data.append('file', file);
            data.append('upload_preset', uploadPreset);

            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: data
            });

            if (!response.ok) throw new Error('Upload failed');
            const result = await response.json();

            setFormData(prev => ({ ...prev, image: result.secure_url }));
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setImageUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addRoommateProfile({
                ...formData,
                userId: auth.currentUser?.uid,
                email: auth.currentUser?.email
            });
            onProfileAdded();
            onClose();
        } catch (error) {
            alert('Failed to create profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
        }}>
            <div className="animate-in" style={{
                background: 'white',
                width: '100%', maxWidth: '500px',
                borderRadius: '24px',
                padding: '24px',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: 'var(--color-text-pri)' }}>
                        {existingProfile ? 'Edit Buddy Profile' : 'Create Buddy Profile'}
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <span className="material-icons-round">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* Photo Upload */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                        <div
                            onClick={() => document.getElementById('roommate-photo-input').click()}
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                background: formData.image ? `url(${formData.image}) center/cover` : '#F1F5F9',
                                border: '2px dashed #CBD5E1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                position: 'relative'
                            }}
                        >
                            {imageUploading ? (
                                <span className="material-icons-round animate-spin" style={{ color: '#64748B' }}>sync</span>
                            ) : !formData.image && (
                                <span className="material-icons-round" style={{ color: '#94A3B8', fontSize: '32px' }}>add_a_photo</span>
                            )}

                            <input
                                id="roommate-photo-input"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Name</label>
                            <input
                                required
                                style={inputStyle}
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Your Name"
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Age</label>
                            <input
                                required
                                type="number"
                                style={inputStyle}
                                value={formData.age}
                                onChange={e => setFormData({ ...formData, age: e.target.value })}
                                placeholder="21"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Target Location</label>
                            <input
                                required
                                style={inputStyle}
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                placeholder="e.g. Dublin 4"
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Max Budget (€)</label>
                            <input
                                required
                                type="number"
                                style={inputStyle}
                                value={formData.budget}
                                onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                placeholder="800"
                            />
                        </div>
                    </div>

                    {/* Preferences */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>Language Preference</label>
                            <select
                                style={inputStyle}
                                value={formData.languagePreference}
                                onChange={e => setFormData({ ...formData, languagePreference: e.target.value })}
                            >
                                <option value="">Select language</option>
                                {LANGUAGE_OPTIONS.map(lang => (
                                    <option key={lang} value={lang}>{lang}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Place of Origin</label>
                            <select
                                style={inputStyle}
                                value={formData.placePreference}
                                onChange={e => setFormData({ ...formData, placePreference: e.target.value })}
                            >
                                <option value="">Select country</option>
                                {PLACE_OPTIONS.map(place => (
                                    <option key={place} value={place}>{place}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label style={labelStyle}>About Me</label>
                        <textarea
                            required
                            style={{ ...inputStyle, height: '80px', resize: 'none' }}
                            value={formData.bio}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Briefly describe your lifestyle and what you're looking for..."
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label style={labelStyle}>Lifestyle Tags</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                            {AVAILABLE_TAGS.map(tag => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => toggleTag(tag)}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        border: 'none',
                                        background: formData.tags.includes(tag) ? 'var(--color-brand)' : '#F1F5F9',
                                        color: formData.tags.includes(tag) ? 'white' : '#64748B',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ marginTop: '16px', borderRadius: '12px', padding: '14px' }}
                    >
                        {loading ? (existingProfile ? 'Updating...' : 'Publishing...') : (existingProfile ? 'Update Profile' : 'Publish Profile')}
                    </button>
                </form>
            </div>
        </div>
    );
};

const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--color-text-sec)'
};

const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    fontSize: '14px',
    outline: 'none',
    background: '#F8FAFC'
};

export default AddRoommateModal;
