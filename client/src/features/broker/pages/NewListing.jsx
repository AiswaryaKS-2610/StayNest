import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase.config';
import PlacesAutocomplete from '../../common/components/PlacesAutocomplete';

const NewListing = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        location: '',
        lat: null, // Add lat
        lng: null, // Add lng
        description: '',
        amenities: [],
        type: 'Entire Home', // Main category
        subType: 'Apartment', // Specific type
        bedrooms: '1',
        guests: '1',
        billsIncluded: true,
        eircode: ''
    });

    const handleImageChange = (e) => {
        // ... existing image logic ...
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const validFiles = files.filter(file => {
                const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
                if (!isValidSize) {
                    alert(`File ${file.name} is too large. Max size is 10MB.`);
                }
                return isValidSize;
            });
            setImages(prev => [...prev, ...validFiles]);
        }
    };
    // ... existing takePhoto ... 
    const takePhoto = () => {
        if (navigator.camera) {
            navigator.camera.getPicture(
                (imageData) => {
                    fetch(`data:image/jpeg;base64,${imageData}`)
                        .then(res => res.blob())
                        .then(blob => {
                            const file = new File([blob], `camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
                            setImages(prev => [...prev, file]);
                        });
                },
                (error) => {
                    console.error("Camera error:", error);
                },
                {
                    quality: 50,
                    destinationType: navigator.camera.DestinationType.DATA_URL,
                    sourceType: navigator.camera.PictureSourceType.CAMERA,
                    encodingType: navigator.camera.EncodingType.JPEG,
                    mediaType: navigator.camera.MediaType.PICTURE,
                    allowEdit: true,
                    correctOrientation: true
                }
            );
        } else {
            alert("Camera not available on this device/browser.");
        }
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const uploadImages = async () => {
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

            if (!response.ok) {
                const errorDetails = await response.json();
                console.error("Cloudinary Error Details:", errorDetails);
                throw new Error(errorDetails.error?.message || 'Cloudinary upload failed');
            }
            const result = await response.json();
            return result.secure_url;
        });

        return Promise.all(uploadPromises);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (images.length === 0) return alert('Please upload at least one photo');

        setLoading(true);
        try {
            const user = auth.currentUser;
            if (!user) {
                alert("You must be logged in to publish.");
                setLoading(false);
                return;
            }
            const token = await user.getIdToken();

            // Store in Cloudinary first
            let uploadedUrls = [];
            try {
                uploadedUrls = await uploadImages();
            } catch (err) {
                throw new Error(`Cloudinary Upload Failed: ${err.message || err}`);
            }

            // Determine Lat/Lng
            let lat = formData.lat || 53.3498;
            let lng = formData.lng || -6.2603;

            // If smart search wasn't used/didn't provide coords, try fallback geocoding
            if (!formData.lat || !formData.lng) {
                try {
                    // Ireland bounding box validation
                    const isInIreland = (latitude, longitude) => {
                        return latitude >= 51.4 && latitude <= 55.4 &&
                            longitude >= -10.5 && longitude <= -5.5;
                    };

                    // Try 1: Eircode (Most precise)
                    let geoRes = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=ie&q=${encodeURIComponent(formData.eircode + ', Ireland')}`,
                        { headers: { 'User-Agent': 'StayNest-App' } }
                    );
                    let geoData = await geoRes.json();

                    // Try 2: Location provided (Fallback)
                    if (!geoData || geoData.length === 0) {
                        geoRes = await fetch(
                            `https://nominatim.openstreetmap.org/search?format=json&countrycodes=ie&q=${encodeURIComponent(formData.location + ', Dublin, Ireland')}`,
                            { headers: { 'User-Agent': 'StayNest-App' } }
                        );
                        geoData = await geoRes.json();
                    }

                    if (geoData && geoData.length > 0) {
                        const tempLat = parseFloat(geoData[0].lat);
                        const tempLng = parseFloat(geoData[0].lon);

                        if (isInIreland(tempLat, tempLng)) {
                            lat = tempLat;
                            lng = tempLng;
                            console.log(`✅ Geocoded to: ${lat}, ${lng}`);
                        }
                    }
                } catch (err) {
                    console.error("Geocoding failed:", err);
                }
            }

            // Then send to our backend
            try {
                const response = await fetch('http://localhost:5000/api/listings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        ...formData,
                        images: uploadedUrls,
                        ownerUid: user.uid,
                        lat,
                        lng
                    })
                });

                if (response.ok) {
                    alert('Listing submitted! It will be live once an administrator approves it.');
                    navigate('/broker/dashboard');
                } else {
                    const errorData = await response.json();
                    throw new Error(`Backend Error: ${errorData.message || response.statusText}`);
                }
            } catch (err) {
                if (err.message === 'Failed to fetch') {
                    throw new Error('Backend Connection Failed. Is the server running on port 5000?');
                }
                throw err;
            }

        } catch (error) {
            console.error("Upload Error:", error);
            alert(`Error during upload: ${error.message || error}`);
        } finally {
            setLoading(false);
        }
    };

    // ... handleTagChange ...
    const handleTagChange = (tag) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(tag)
                ? prev.amenities.filter(t => t !== tag)
                : [...prev.amenities, tag]
        }));
    };

    // ... Render ...
    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', color: 'var(--color-brand)', letterSpacing: '-0.5px' }}>Post New Listing</h1>
                    <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '15px' }}>Fill in the details to reach potential tenants</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #E2E8F0' }}>

                {/* ... Add Photos section ... */}
                <h3 style={{ marginBottom: '12px', fontSize: '18px', fontWeight: '700' }}>Add Photos</h3>
                <div style={{
                    border: '1.5px dashed var(--color-brand)',
                    padding: '24px',
                    borderRadius: '20px',
                    textAlign: 'center',
                    marginBottom: '16px',
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
                    <label htmlFor="photo-upload" style={{ cursor: 'pointer', color: 'var(--color-primary)', fontWeight: '700' }}>
                        <span className="material-icons-round" style={{ fontSize: '40px', display: 'block', marginBottom: '4px' }}>add_a_photo</span>
                        Select photos
                    </label>
                </div>
                {/* ... Take Photo Button ... */}
                <button
                    type="button"
                    onClick={takePhoto}
                    style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '16px',
                        background: 'white',
                        border: '2px solid var(--color-brand)',
                        color: 'var(--color-brand)',
                        fontWeight: '800',
                        fontSize: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        marginBottom: '24px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'var(--color-brand-light)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                >
                    <span className="material-icons-round">photo_camera</span>
                    Take a Photo
                </button>

                {/* ... Image Preview Carosel ... */}
                {images.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
                        {images.map((img, index) => (
                            <div key={index} style={{ position: 'relative', minWidth: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f0f0f0' }}>
                                <img src={URL.createObjectURL(img)} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                >
                                    <span className="material-icons-round" style={{ fontSize: '12px' }}>close</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <h3 style={{ marginBottom: '12px', fontSize: '18px', fontWeight: '700' }}>Property Information</h3>
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

                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
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

                {/* ... Bed/Guests ... */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
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

                <h3 style={{ marginBottom: '12px', fontSize: '18px', fontWeight: '700' }}>Details</h3>
                <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Headline</label>
                    <input
                        type="text"
                        placeholder="eg 23 auburn street"
                        className="input-field"
                        style={inputStyle}
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Monthly Rent (€)</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="eg 1800"
                        className="input-field"
                        style={inputStyle}
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value.replace(/[^0-9]/g, '') })}
                    />
                </div>

                {/* REPLACED LOCATION INPUT */}
                <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Location</label>
                    <PlacesAutocomplete
                        value={formData.location}
                        onChange={(val) => setFormData(prev => ({ ...prev, location: val }))}
                        onSelect={(place) => {
                            setFormData(prev => ({
                                ...prev,
                                location: place.address,
                                lat: place.lat,
                                lng: place.lng
                            }));
                        }}
                        placeholder="Search for area (e.g. Smithfield, Dublin 7)"
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Eircode (Postcode)</label>
                    <input
                        type="text"
                        placeholder="D01 FE34"
                        className="input-field"
                        style={inputStyle}
                        value={formData.eircode}
                        onChange={(e) => setFormData({ ...formData, eircode: e.target.value.toUpperCase() })}
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Description</label>
                    <textarea
                        className="input-field"
                        style={{ ...inputStyle, minHeight: '100px', resize: 'none' }}
                        rows="4"
                        placeholder="Tell students what makes your home special..."
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

                <div style={{ marginBottom: '24px' }}>
                    <label style={labelStyle}>Rent Specifics</label>
                    <div
                        onClick={() => setFormData({ ...formData, billsIncluded: !formData.billsIncluded })}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '16px',
                            background: formData.billsIncluded ? '#EFFDF4' : 'white',
                            border: `2px solid ${formData.billsIncluded ? '#22C55E' : '#F1F5F9'}`,
                            borderRadius: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '6px',
                            border: `2px solid ${formData.billsIncluded ? '#22C55E' : '#CBD5E1'}`,
                            background: formData.billsIncluded ? '#22C55E' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {formData.billsIncluded && <span className="material-icons-round" style={{ color: 'white', fontSize: '18px' }}>check</span>}
                        </div>
                        <div>
                            <span style={{ display: 'block', fontSize: '15px', fontWeight: '700', color: formData.billsIncluded ? '#166534' : '#64748B' }}>
                                All Bills Included
                            </span>
                            <span style={{ fontSize: '12px', color: '#64748B' }}>Electricity, Wifi, Water, and Bins</span>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '32px' }}>
                    <button
                        className="btn-primary"
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '16px',
                            fontSize: '16px',
                            fontWeight: '800',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            background: loading ? '#86EFAC' : 'var(--color-success)',
                            borderRadius: '16px',
                            boxShadow: '0 4px 12px rgba(34,197,94,0.2)'
                        }}
                    >
                        {loading && <div className="spinner-small" style={{ borderTopColor: 'white' }}></div>}
                        {loading ? 'Publishing...' : 'Publish Listing'}
                    </button>
                </div>
            </form>
        </>
    );
};

const labelStyle = {
    display: 'block',
    fontSize: '13px',
    color: '#717171',
    fontWeight: '600',
    marginBottom: '6px'
};

const inputStyle = {
    borderRadius: '16px',
    border: '1px solid #eee',
    padding: '14px 16px',
    fontSize: '15px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
};

export default NewListing;
