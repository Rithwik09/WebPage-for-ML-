// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
    return <Component {...pageProps} />;
}
