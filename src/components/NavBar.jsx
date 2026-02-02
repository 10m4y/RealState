import { Link, useLocation } from "react-router-dom";
import "../styling/Navbar.css";

export default function Navbar({ userName = "John Doe", userImage = null }) {
    const location = useLocation();

    // "Add Property" removed from here, as it is now in the top header
    const navItems = [
        { name: "Home", path: "/" },
        { name: "Property Listing", path: "/properties" },
        { name: "My Properties", path: "/my-properties" },
    ];

    const isActive = (path) => {
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };

    return (
        <>
            {/* Desktop Navbar - Unchanged */}
            <nav className="navbar desktop-nav">
                <div className="nav-left">
                    <div className="user-profile">
                        <div className="profile-image">
                            {userImage ? (
                                <img src={userImage} alt={userName} />
                            ) : (
                                <div className="profile-placeholder">
                                    {userName.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="user-info">
                            <span className="greeting">Good day,</span>
                            <span className="user-name">{userName}</span>
                        </div>
                    </div>
                </div>

                <div className="nav-center">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${isActive(item.path) ? "active" : ""}`}
                        >
                            <span className="nav-label">{item.name}</span>
                        </Link>
                    ))}
                    {/* Desktop Add Link */}
                    <Link to="/add" className={`nav-item ${isActive("/add") ? "active" : ""}`}>
                         <span className="nav-label">Add Property</span>
                    </Link>
                </div>

                <div className="nav-right"></div>
            </nav>

            {/* Mobile Header (Top) */}
            <div className="mobile-header">
                {/* Left: User Profile */}
                <div className="user-profile mobile-profile">
                    <div className="profile-image">
                        {userImage ? (
                            <img src={userImage} alt={userName} />
                        ) : (
                            <div className="profile-placeholder">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="user-info">
                        <span className="greeting">Hello,</span>
                        <span className="user-name">{userName}</span>
                    </div>
                </div>

                {/* Right: Add Property Button */}
                <Link to="/add" className="mobile-header-add-btn">
                    <span className="plus-icon">+</span>
                    <span>Add</span>
                </Link>
            </div>

            {/* Mobile Navbar (Bottom Center) - Unchanged */}
            <nav className="navbar mobile-nav">
                <div className="mobile-nav-content">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`mobile-nav-item ${isActive(item.path) ? "active" : ""}`}
                        >
                            <span className="mobile-nav-dot"></span>
                            <span className="mobile-nav-label">
                                {item.name.split(' ')[0]}
                            </span>
                        </Link>
                    ))}
                </div>
            </nav>
        </>
    );
}