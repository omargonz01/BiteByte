import React, { useState } from 'react';

function ImageUpload({ onImageSelected }) {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            onImageSelected(file); // This callback is where you might handle the file, such as uploading it or reading its data
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {selectedImage && (
                <img src={URL.createObjectURL(selectedImage)} alt="Preview" style={{ width: '100px', height: '100px' }} />
            )}
        </div>
    );
}

export default ImageUpload;
