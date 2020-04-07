import React from 'react'
import '../style/CameraButton.style.css';

export const CameraButton = ({ image, onPhoto }) => {

    return (
        <div onClick={onPhoto} className="cameraButton">
            <img className="cameraButtonImage" src={image} alt="Camera" />
        </div>
    )
}

