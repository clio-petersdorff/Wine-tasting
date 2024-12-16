import Footer from "../components/Footer";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <>
            <div className="header">
                <Header/>
            </div>

            <div className="main-container">
                <h1>404 - Page Not Found</h1>
                <p >
                    Oops! The page you're looking for doesn't exist. It might have been removed, or the URL might be incorrect.
                </p>
                <button onClick={() => navigate("/")}>Back to Home</button>
            </div>
            <div className='footer'>
                <Footer />
            </div>

        </>
    );
}
