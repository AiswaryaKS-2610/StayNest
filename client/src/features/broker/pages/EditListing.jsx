import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth } from '../../../firebase.config';
import { fetchListings } from '../../../services/api';

const EditListing = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState(false);
    const [images, setImages] = useState([]); // These are new selected files
    const [existingUrls, setExistingUrls] = useState([]); // These are current URLs
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        location: '',
        description: '',
        amenities: [],
        type: 'Entire Home',
        subType: 'Apartment',
        bedrooms: '1',
        guests: '1',
        billsIncluded: true,
        eircode: ''
    });

    useEffect(() => {
        const loadListing = async () => {
            const data = await fetchListings();
            const listing = data.find(l => l.id === id);
            if (listing) {
                setFormData({
                    title: listing.title || '',
                    price: listing.price || '',
                    location: listing.location || '',
                    description: listing.description || '',
                    amenities: listing.amenities || [],
                    type: listing.type || 'Entire Home',
                    subType: listing.subType || 'Apartment',
                    bedrooms: listing.bedrooms || '1',
                    guests: listing.guests || '1',
                    billsIncluded: listing.billsIncluded ?? true,
                    eircode: listing.eircode || ''
                });
                setExistingUrls(listing.images || []);
            }
            setLoading(false);
        };
        loadListing();
    }, [id]);

    const handleImageChange = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setImages(prev => [...prev, ...files]);
        }
    };

    const removeNewImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => {
        setExistingUrls(existingUrls.filter((_, i) => i !== index));
    };

    const uploadImages = async () => {
        if (images.length === 0) return [];

        const cloudName = 'daszhocrj';
        const uploadPreset = 'staynest_preset';

        const uploadPromises = images.map(async (image) => {
            const data = new FormData();
            data.append('file', image);
            data.append('upload_preset', uploadPreset);

            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: data
            });

            if (!response.ok) throw new Error('Cloudinary upload failed');
            const result = await response.json();
            return result.secure_url;
        });

        return Promise.all(uploadPromises);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const allImages = [...existingUrls];
        if (allImages.length === 0 && images.length === 0) {
            return alert('Please have at least one photo');
        }

        setPublishing(true);
        try {
            const user = auth.currentUser;
            if (!user) {
                alert("You must be logged in.");
                setPublishing(false);
                return;
            }
            const token = await user.getIdToken();

            // 1. Upload new images if any
            const newUrls = await uploadImages();
            const finalImageUrls = [...existingUrls, ...newUrls];

            // Geocode using Eircode for precision with fallback
            let lat = formData.lat || 53.3498, lng = formData.lng || -6.2603;
            try {
                // Try 1: Eircode (Most precise)
                let geoRes = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.eircode + ', Ireland')}`,
                    { headers: { 'User-Agent': 'StayNest-App' } }
                );
                let geoData = await geoRes.json();

                // Try 2: Eircode + Location (More context)
                if (!geoData || geoData.length === 0) {
                    geoRes = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.eircode + ', ' + formData.location + ', Ireland')}`,
                        { headers: { 'User-Agent': 'StayNest-App' } }
                    );
                    geoData = await geoRes.json();
                }

                // Try 3: Location only (Fallback)
                if (!geoData || geoData.length === 0) {
                    geoRes = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.location + ', Ireland')}`,
                        { headers: { 'User-Agent': 'StayNest-App' } }
                    );
                    geoData = await geoRes.json();
                }

                if (geoData && geoData.length > 0) {
                    lat = parseFloat(geoData[0].lat);
                    lng = parseFloat(geoData[0].lon);
                }
            } catch (err) {
                console.error("Geocoding failed:", err);
            }

            // 2. Update via our backend
            const response = await fetch(`https://staynest-6vsv.onrender.com/api/listings/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    images: finalImageUrls,
                    lat,
                    lng
                })
            });

            if (response.ok) {
                alert('Listing Updated Successfully!');
                navigate('/broker/dashboard');
            } else {
                const errorData = await response.json();
                alert(`Failed to update: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Update Error:", error);
            alert('Error during update.');
        } finally {
            setPublishing(false);
        }
    };

    const handleTagChange = (tag) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(tag)
                ? prev.amenities.filter(t => t !== tag)
                : [...prev.amenities, tag]
        }));
    };

    if (loading) return (
        <>
            <div style={{ textAlign: 'center', padding: '100px' }}>
                <div className="spinner-small" style={{ margin: '0 auto' }}></div>
            </div>
        </>
    );

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', color: 'var(--color-brand)', letterSpacing: '-0.5px' }}>Edit Listing</h1>
                    <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '15px' }}>Modify your property details</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #E2E8F0' }}>
                <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '700' }}>Manage Photos</h3>

                {/* Existing Photos */}
                {existingUrls.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#64748B', marginBottom: '8px' }}>Current Photos</p>
                        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px' }}>
                            {existingUrls.map((url, index) => (
                                <div key={index} style={{ position: 'relative', minWidth: '100px', height: '100px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #F1F5F9' }}>
                                    <img src={url} alt="existing" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(index)}
                                        style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                    >
                                        <span className="material-icons-round" style={{ fontSize: '14px' }}>delete</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* New Photo Upload */}
                <div style={{
                    border: '1.5px dashed var(--color-brand)',
                    padding: '32px',
                    borderRadius: '20px',
                    textAlign: 'center',
                    marginBottom: '24px',
                    background: 'var(--color-brand-light)'
                }}>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                        id="photo-upload"
                    />
                    <label htmlFor="photo-upload" style={{ cursor: 'pointer', color: 'var(--color-brand)', fontWeight: '700' }}>
                        <span className="material-icons-round" style={{ fontSize: '40px', display: 'block', marginBottom: '8px' }}>add_photo_alternate</span>
                        Add more photos
                    </label>
                </div>

                {images.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#64748B', marginBottom: '8px' }}>New Photos to Upload</p>
                        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px' }}>
                            {images.map((img, index) => (
                                <div key={index} style={{ position: 'relative', minWidth: '100px', height: '100px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #F1F5F9' }}>
                                    <img src={URL.createObjectURL(img)} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(index)}
                                        style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                    >
                                        <span className="material-icons-round" style={{ fontSize: '14px' }}>close</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '700', marginTop: '32px' }}>Property Details</h3>

                <div style={{ marginBottom: '24px' }}>
                    <label style={labelStyle}>Accommodation Category</label>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                        {['Sharing', 'Entire Home'].map(type => (
                            <div
                                key={type}
                                onClick={() => setFormData({ ...formData, type })}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    textAlign: 'center',
                                    borderRadius: '16px',
                                    border: `2.5px solid ${formData.type === type ? 'var(--color-brand)' : '#F1F5F9'}`,
                                    background: formData.type === type ? 'var(--color-brand-light)' : 'white',
                                    color: formData.type === type ? 'var(--color-brand)' : '#64748B',
                                    cursor: 'pointer',
                                    fontWeight: '800',
                                    fontSize: '14px',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '6px',
                                    boxShadow: formData.type === type ? '0 8px 20px rgba(30,58,138,0.1)' : 'none'
                                }}
                            >
                                <span className="material-icons-round" style={{ fontSize: '24px' }}>
                                    {type === 'Sharing' ? 'groups' : 'home'}
                                </span>
                                {type}
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Sub-type</label>
                        <select
                            value={formData.subType}
                            onChange={(e) => setFormData({ ...formData, subType: e.target.value })}
                            style={inputStyle}
                        >
                            <option value="Apartment">Apartment</option>
                            <option value="Flat">Flat</option>
                            <option value="Studio">Studio</option>
                            <option value="House">House</option>
                            <option value="Room">Single Room</option>
                            <option value="Shared Room">Shared Room</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Bedrooms</label>
                        <input
                            type="number"
                            min="0"
                            style={inputStyle}
                            value={formData.bedrooms}
                            onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Max Guests</label>
                        <input
                            type="number"
                            min="1"
                            style={inputStyle}
                            value={formData.guests}
                            onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Headline</label>
                    <input
                        type="text"
                        style={inputStyle}
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Monthly Rent (€)</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        style={inputStyle}
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value.replace(/[^0-9]/g, '') })}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Location</label>
                    <input
                        type="text"
                        style={inputStyle}
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Description</label>
                    <textarea
                        style={{ ...inputStyle, minHeight: '120px', resize: 'none' }}
                        rows="4"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                </div>

                <h3 style={{ marginBottom: '16px', marginTop: '32px', fontSize: '18px', fontWeight: '700' }}>What this place offers</h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: '12px',
                    marginBottom: '24px'
                }}>
                    {[
                        { name: 'Wifi', icon: 'wifi' },
                        { name: 'Heating', icon: 'wb_sunny' },
                        { name: 'Bins', icon: 'delete_outline' },
                        { name: 'Parking', icon: 'local_parking' },
                        { name: 'Ensuite', icon: 'bathtub' },
                        { name: 'Kitchen', icon: 'restaurant' },
                        { name: 'Laundry', icon: 'local_laundry_service' },
                        { name: 'Gym', icon: 'fitness_center' },
                        { name: 'Desk Space', icon: 'desktop_mac' },
                        { name: 'Elevator', icon: 'elevator' },
                        { name: 'Security', icon: 'security' },
                        { name: 'Fridge', icon: 'kitchen' },
                        { name: 'Microwave', icon: 'microwave' },
                        { name: 'TV', icon: 'tv' },
                        { name: 'Diswasher', icon: 'flatware' }
                    ].map(amenity => {
                        const isSelected = formData.amenities.includes(amenity.name);
                        return (
                            <div
                                key={amenity.name}
                                onClick={() => handleTagChange(amenity.name)}
                                style={{
                                    padding: '16px',
                                    borderRadius: '16px',
                                    border: `2px solid ${isSelected ? 'var(--color-success)' : '#F1F5F9'}`,
                                    background: isSelected ? '#F0FDF4' : 'white',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'all 0.2s ease',
                                    boxShadow: isSelected ? '0 4px 12px rgba(34,197,94,0.1)' : 'none'
                                }}
                            >
                                <span className="material-icons-round" style={{
                                    fontSize: '24px',
                                    color: isSelected ? 'var(--color-success)' : '#64748B'
                                }}>
                                    {amenity.icon}
                                </span>
                                <span style={{
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    color: isSelected ? '#166534' : '#64748B'
                                }}>
                                    {amenity.name}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div style={{ marginTop: '32px', marginBottom: '40px' }}>
                    <label style={labelStyle}>Rent Specifics</label>
                    <div
                        onClick={() => setFormData({ ...formData, billsIncluded: !formData.billsIncluded })}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '20px',
                            background: formData.billsIncluded ? '#F0FDF4' : '#F8FAFC',
                            border: `2px solid ${formData.billsIncluded ? '#22C55E' : '#F1F5F9'}`,
                            borderRadius: '20px',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '8px',
                            border: `2px solid ${formData.billsIncluded ? '#22C55E' : '#CBD5E1'}`,
                            background: formData.billsIncluded ? '#22C55E' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {formData.billsIncluded && <span className="material-icons-round" style={{ color: 'white', fontSize: '18px' }}>check</span>}
                        </div>
                        <div>
                            <span style={{ display: 'block', fontSize: '16px', fontWeight: '700', color: formData.billsIncluded ? '#166534' : '#64748B' }}>
                                All Bills Included
                            </span>
                            <span style={{ fontSize: '13px', color: '#64748B' }}>Electricity, Wifi, Water, and Bins</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                        className="btn-primary"
                        type="submit"
                        disabled={publishing}
                        style={{
                            flex: 1,
                            padding: '18px',
                            fontSize: '16px',
                            fontWeight: '800',
                            gap: '12px',
                            background: publishing ? '#86EFAC' : 'var(--color-brand)',
                            borderRadius: '18px'
                        }}
                    >
                        {publishing && <div className="spinner-small" style={{ borderTopColor: 'white' }}></div>}
                        {publishing ? 'Saving Changes...' : 'Update Listing'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/broker/dashboard')}
                        style={{
                            padding: '18px 32px',
                            fontSize: '16px',
                            fontWeight: '700',
                            background: '#F1F5F9',
                            color: '#64748B',
                            border: 'none',
                            borderRadius: '18px',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    );
};

const labelStyle = {
    display: 'block',
    fontSize: '14px',
    color: '#64748B',
    fontWeight: '700',
    marginBottom: '8px'
};

const inputStyle = {
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    padding: '16px 20px',
    fontSize: '15px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    background: '#F8FAFC',
    transition: 'border-color 0.2s ease',
    ':focus': {
        borderColor: 'var(--color-brand)'
    }
};

export default EditListing;
