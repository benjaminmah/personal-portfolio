import React from 'react';
import '../styles/contact.css';

const Contact = () => {
    return (
        <div className="contact">
            <h1>contact me!</h1>
            <div className="contact-links">
                <a href="https://www.linkedin.com/in/benjaminmahh/" target="_blank" rel="noopener noreferrer">
                    <img src="/icons/linkedin1.png" alt="LinkedIn" className="linkedin-icon" />
                </a>
                <a href="https://github.com/benjaminmah" target="_blank" rel="noopener noreferrer">
                    <img src="/icons/github1.png" alt="GitHub" className="github-icon" />
                </a>
                <a href="mailto:benjaminmah.bm@gmail.com">
                    <img src="/icons/email1.png" alt="Email" className="email-icon" />
                </a>
                <a href="https://open.spotify.com/user/b8og4r9gr9jql088ihzux4lx7?si=8629db0f44894b29" target="_blank" rel="noopener noreferrer">
                    <img src="/icons/spotify1.png" alt="Spotify" className="spotify-icon" />
                </a>
                <a href="https://soundcloud.com/hyounbin" target="_blank" rel="noopener noreferrer">
                    <img src="/icons/soundcloud1.png" alt="SoundCloud" className="soundcloud-icon" />
                </a>
            </div>
            <p>(ps my email address is benjaminmah.bm@gmail.com)</p>
        </div>
    );
}

export default Contact;
