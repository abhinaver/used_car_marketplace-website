import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditCar.css";
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";

const EditCar = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [carData, setCarData] = useState({
        name: "",
        model: "",
        year_of_production: "",
        kilometers_driven: "",
        previous_owners: "",
        color: "",
        extra_fittings: false,
        price: "",
        phone: "",
        location: "",
        description: "",
        image_url: "",
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    // Fetch car details
    useEffect(() => {
        fetch(`http://localhost:8081/get-item/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    setCarData(data);
                    setImagePreview(data.image_url);
                }
            })
            .catch((err) => console.error("❌ Error fetching item:", err));
    }, [id]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setCarData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Remove selected image
    const removeImage = () => {
        setImageFile(null);
        setImagePreview(""); // Reset preview
    };

    // Submit the form
    const handleSubmit = async (e) => {
        e.preventDefault();

        let imageUrl = carData.image_url;
        if (imageFile) {
            const formData = new FormData();
            formData.append("image", imageFile);

            try {
                const uploadResponse = await fetch("http://localhost:8081/upload-image", {
                    method: "POST",
                    body: formData,
                });

                const uploadData = await uploadResponse.json();
                if (uploadResponse.ok) {
                    imageUrl = uploadData.imageUrl;
                } else {
                    console.error("❌ Image upload failed:", uploadData.error);
                    return;
                }
            } catch (error) {
                console.error("❌ Error uploading image:", error);
                return;
            }
        }

        const updatedCar = { ...carData, image_url: imageUrl };

        try {
            const response = await fetch(`http://localhost:8081/update-item/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedCar),
            });

            const data = await response.json();
            if (response.ok) {
                alert("✅ Car updated successfully!");
                navigate("/");
            } else {
                console.error("❌ Failed to update car:", data.error);
            }
        } catch (error) {
            console.error("❌ Error updating item:", error);
        }
    };

    return (
        <div className="sell-car-container">
            <h2>Edit Your Car</h2>
            <form onSubmit={handleSubmit} className="sell-car-form">
                <div className="horizontal">
                    <label className="file-input">
                        {imagePreview ? (
                            <div className="image-preview-container">
                                <img
                                    src={imagePreview}
                                    alt="Car Preview"
                                    className="preview-image"
                                    onClick={() => document.getElementById("file-upload").click()}
                                />
                                <button type="button" className="delete-image-btn" onClick={removeImage}>
                                    <AiOutlineDelete size={20} color="white" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <input
                                    className="upload-button"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: "none" }}
                                    id="file-upload"
                                />
                                <button
                                    type="button"
                                    className="icon-button"
                                    onClick={() => document.getElementById("file-upload").click()}
                                >
                                    <AiOutlinePlus size={24} />
                                </button>
                            </>
                        )}
                    </label>

                    <div className="vertical">
                        <input type="text" name="name" placeholder="Car Name" value={carData.name} onChange={handleChange} required />
                        <input type="text" name="model" placeholder="Car Model" value={carData.model} onChange={handleChange} required />
                        <input type="number" name="year_of_production" placeholder="Year of Production" value={carData.year_of_production} onChange={handleChange} required />
                        <input type="number" name="kilometers_driven" placeholder="Kilometers Driven" value={carData.kilometers_driven} onChange={handleChange} required />
                        <input type="number" name="previous_owners" placeholder="Previous Owners" value={carData.previous_owners} onChange={handleChange} required />
                    </div>
                </div>

                <div className="horizontal1">
                    <input type="text" name="color" placeholder="Color" value={carData.color} onChange={handleChange} required />
                    <input type="number" name="price" placeholder="Price (₹)" value={carData.price} onChange={handleChange} required />
                </div>

                <div className="checkbox-container">
                    <label>
                        <input type="checkbox" name="extra_fittings" checked={carData.extra_fittings} onChange={handleChange} />
                        Extra Fittings
                    </label>
                </div>

                <div className="horizontal2">
                    <input type="tel" name="phone" placeholder="Phone Number" value={carData.phone} onChange={handleChange} required />
                    <input type="text" name="location" placeholder="Location" value={carData.location} onChange={handleChange} required />
                </div>

                <textarea name="description" placeholder="Description" value={carData.description} onChange={handleChange} required></textarea>

                <button type="submit" className="submit-button">Update Car</button>
            </form>
        </div>
    );
};

export default EditCar;
