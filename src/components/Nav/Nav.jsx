import './Nav.css';

function Nav() {
  return (
    <nav className="nav w-full fixed bottom-0 left-0 z-10">
      <a href="#home">Home</a>
      <a href="#stats">Stats</a>
      <button>+</button>
      <a href="#recipes">Recipes</a>
      <a href="#profile">Profile</a>
      
    </nav>
  );
}

export default Nav;