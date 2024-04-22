import './Nav.css';
import { FaHome, FaChartLine, FaPlus, FaBook, FaUser } from 'react-icons/fa';

function Nav() {
  return (
    <nav className="nav w-full fixed bottom-0 left-0 z-10">
      <a href="#home" className="nav-item">
        <FaHome className="nav-icon" />
        <span>Home</span>
      </a>
      <a href="#stats" className="nav-item">
        <FaChartLine className="nav-icon" />
        <span>Stats</span>
      </a>
      <button className="nav-button">
        <FaPlus />
      </button>
      <a href="#recipes" className="nav-item">
        <FaBook className="nav-icon" />
        <span>Recipes</span>
      </a>
      <a href="#profile" className="nav-item">
        <FaUser className="nav-icon" />
        <span>Profile</span>
      </a>
    </nav>
  );
}

export default Nav;