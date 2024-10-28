// pages/index.js
import { useRouter } from 'next/navigation';
import WebcamCapture from '../components/WebCam';

export default function Home() {
    const router = useRouter();

    return (
        <div className="container">
            <h1 className="text-primary">Home Page</h1>
            <button
                className="btn btn-primary"
                onClick={() => router.push('/inst')}
            >
                Go to About
            </button>
            <WebcamCapture />
        </div>
    );
}
