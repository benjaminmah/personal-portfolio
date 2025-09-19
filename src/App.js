
import './App.css';

function App() {
  return (
    <div className="minimal-home">
      <main className="content">
        <h1 className="bitmap-blue">hello, i'm benjamin</h1>
        <nav className="nav" aria-label="Primary">
          <ul className="nav-links">
            <li><a className="btn" href="/about">about</a></li>
            <li><a className="btn" href="/blog">blog</a></li>
            <li><a className="btn" href="/contact">contact</a></li>
            <li><a className="btn" href="/resume">resume</a></li>
          </ul>
        </nav>
      </main>
    </div>
  );
}

export default App;
