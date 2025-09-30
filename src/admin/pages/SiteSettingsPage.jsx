import React, { useState, useEffect } from "react";
import "../../Styles/SiteSettings.css";

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState({
    sliderImages: []
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load settings from API
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/site-settings/");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        setFiles(new Array(data.sliderImages.length).fill(null));
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Save settings
  const saveSettings = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("numSlides", settings.sliderImages.length.toString());
      settings.sliderImages.forEach((slide, i) => {
        formData.append(`sliderImages[${i}][title]`, slide.title);
        formData.append(`sliderImages[${i}][description]`, slide.description);
        formData.append(`sliderImages[${i}][link]`, slide.link);
        formData.append(`sliderImages[${i}][image]`, slide.image);
        if (files[i]) {
          formData.append("images", files[i]);
        }
      });
      const response = await fetch("/api/site-settings/", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Settings updated successfully!");
        fetchSettings(); // Reload
      } else {
        alert("Failed to update settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSlideChange = (index, field, value) => {
    const newSlides = [...settings.sliderImages];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setSettings((prev) => ({ ...prev, sliderImages: newSlides }));
  };

  const handleFileChange = (index, file) => {
    const newFiles = [...files];
    newFiles[index] = file;
    setFiles(newFiles);
  };

  const addSlide = () => {
    setSettings((prev) => ({
      ...prev,
      sliderImages: [...prev.sliderImages, { image: "", title: "", description: "", link: "" }]
    }));
    setFiles((prev) => [...prev, null]);
  };

  const removeSlide = (index) => {
    setSettings((prev) => ({
      ...prev,
      sliderImages: prev.sliderImages.filter((_, i) => i !== index)
    }));
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading) return <div>Loading slider settings...</div>;

  return (
    <div className="site-settings-container" style={{height:"100vh"}}>
      <h1>Slider Images Management</h1>
      <button onClick={addSlide}>Add Slide</button>
      
      {settings.sliderImages.map((slide, index) => (
        <div key={index} className="slide-settings">
          <h2>Slide {index + 1}</h2>
          <button onClick={() => removeSlide(index)}>Remove</button>

          <div className="form-group">
            {slide.image && <img src={slide.image} alt="Current" style={{width: "100px", height: "auto"}} />}
            <input
              type="file"
              onChange={(e) => handleFileChange(index, e.target.files[0])}
            />
            <textarea
              placeholder="Description"
              value={slide.description || ""}
              onChange={(e) =>
                handleSlideChange(index, "description", e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Title"
              value={slide.title || ""}
              onChange={(e) => handleSlideChange(index, "title", e.target.value)}
            />
            <input
              type="text"
              placeholder="Link"
              value={slide.link || ""}
              onChange={(e) => handleSlideChange(index, "link", e.target.value)}
            />
          </div>
        </div>
      ))}
      <button onClick={saveSettings} disabled={saving}>
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}
