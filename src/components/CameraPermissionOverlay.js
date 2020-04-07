import React from "react";
import style from "../style/CameraPermissionOverlay.style.css"

export default function CameraPermissionOverlay ({display, onClose}) {

  const renderPage = () => {
  return (
    <div className="overlay">
      
      <div className="logo"><h1>Facemesh + TFJS</h1></div>

      {/* Close button */}
      <input
        type="submit"
        value="BEGIN"
        className="initCamera"
        onClick={e => {
          onClose(e);
        }}
      />

    </div>
  );
}

return display ? renderPage() : null
   
}


