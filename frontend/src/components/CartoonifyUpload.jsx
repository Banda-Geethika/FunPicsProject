import { useState } from "react";

function CartoonifyUpload() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const res = await fetch("http://localhost:8000/cartoonify", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Backend error: " + res.status);
      }

      const data = await res.json();
      setOutput(`http://localhost:8000${data.output_image}`);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", textAlign: "center" }}>
      <h2>Cartoonify Your Image 🎨</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <>
          <h3>Before</h3>
          <img
            src={preview}
            alt="preview"
            style={{ width: "100%", borderRadius: "10px", marginTop: "10px" }}
          />
        </>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        {loading ? "Processing..." : "Cartoonify"}
      </button>

      {output && (
        <>
          <h3>After</h3>
          <img
            src={output}
            alt="cartoonified"
            style={{
              width: "100%",
              borderRadius: "10px",
              marginTop: "10px",
              border: "2px solid #444",
            }}
          />

          <a
            href={output}
            download="cartoonified.png"
            style={{
              display: "inline-block",
              marginTop: "15px",
              padding: "10px 20px",
              background: "#4CAF50",
              color: "white",
              borderRadius: "5px",
              textDecoration: "none",
            }}
          >
            Download Output
          </a>
        </>
      )}
    </div>
  );
}

export default CartoonifyUpload;
