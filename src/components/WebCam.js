// components/WebcamCapture.js
import { useEffect, useRef, useState } from 'react';

const WebcamCapture = () => {
    const videoRef = useRef(null);
    const [mediaDevices, setMediaDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState('');
    const [isWebcamActive, setIsWebcamActive] = useState(false); // New state for toggle

    useEffect(() => {
        const getMediaDevices = async () => {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            setMediaDevices(videoDevices);
            if (videoDevices.length > 0) {
                setSelectedDeviceId(videoDevices[0].deviceId); // Set the first device as default
            }
        };

        getMediaDevices();
    }, []);

    useEffect(() => {
        let stream;

        const getWebcam = async () => {
            if (!selectedDeviceId) return; // If no device is selected

            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined },
                });
                videoRef.current.srcObject = stream;
            } catch (err) {
                console.error("Error accessing the webcam: ", err);
            }
        };

        if (isWebcamActive) {
            getWebcam();
        } else {
            // Stop the webcam feed if it's inactive
            if (videoRef.current) {
                const tracks = videoRef.current.srcObject?.getTracks();
                tracks?.forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
        }

        return () => {
            // Cleanup function to stop the webcam
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, [selectedDeviceId, isWebcamActive]); // Run when device or toggle changes

    const handleDeviceChange = (event) => {
        setSelectedDeviceId(event.target.value);
    };

    const handleToggle = () => {
        setIsWebcamActive(prev => !prev); // Toggle the webcam active state
    };

    return (
        <div className="text-center">
            <h2>Webcam Feed</h2>
            <select onChange={handleDeviceChange} value={selectedDeviceId} className="form-select mb-3">
                {mediaDevices.map(device => (
                    <option key={device.deviceId} value={device.deviceId}>
                        {device.label}
                    </option>
                ))}
            </select>
            <div className="mb-3">
                <label className="form-check-label">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        checked={isWebcamActive}
                        onChange={handleToggle}
                    />
                    {isWebcamActive ? ' Stop Webcam' : ' Start Webcam'}
                </label>
            </div>
            <video
                ref={videoRef}
                autoPlay
                className="border rounded"
                style={{ width: '90%', maxWidth: '600px', height: '80%', maxHeight: '400px' }}
            />
        </div>
    );
};

export default WebcamCapture;
