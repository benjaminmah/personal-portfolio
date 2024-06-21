import React from 'react';
import { useMusicPlayer } from '../MusicPlayerContext';
import { Link } from 'react-router-dom';
import '../styles/home.css';


const Home = () => {
    const { isPlaying, togglePlayPause, restart } = useMusicPlayer();
    const baseUrl = process.env.PUBLIC_URL || '';

    return (
        <div className="home">
            <h1>hi! i'm benjamin</h1>
            <p className="blurb">
                dandelion - oohyo
                <span className={`music-player ${isPlaying ? 'playing' : ''}`} onClick={togglePlayPause}>
                    <img src={isPlaying ? `${baseUrl}/icons/pause1.png` : `${baseUrl}/icons/play1.png`} alt="Music Player" className="music-icon" />
                </span>
                <span className="restart-player" onClick={restart}>
                    <img src={`${baseUrl}/icons/restart1.png`} alt="Restart Player" className="restart-icon" />
                </span>
            </p>
            <p className="blurb2">(care for some music?)</p>
            <nav>
                <Link to="/about">about</Link>
                <Link to="/blog">blog</Link>
                <Link to="/contact">contact</Link>
                <a href={`${baseUrl}/files/Benjamin-Mah-Resume.pdf`} target="_blank" rel="noopener noreferrer">resume</a>
            </nav>
        </div>
    );
}

export default Home;
