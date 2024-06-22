import React from 'react';
import '../styles/about.css';

const About = () => {
    return (
        <div className="about-me">
            <div className="about-container">
                <div className="about-text">
                    <h1>about me</h1>
                    <p>hello! my name is Benjamin Mah and I'm a machine intelligence engineering student at the University of Toronto. I'm passionate about harnessing the potential of machine learning to create impactful solutions, but when I'm not at my computer ...</p>
                    <p>... you can find me collecting records, learning how to produce music, playing basketball (+ watching the raptors), or sleeping</p>
                </div>
                <img src="/icons/me1.png" alt="me" className="about-image" />
            </div>
            <div className="experiences-container">
                <img src="/icons/brain1.png" alt="me" className="experiences-image" />
                <div className="experiences">
                    <h1>experiences</h1>
                    <p>currently, I'm working at <strong><a href="https://www.mozilla.org" target="_blank" rel="noopener noreferrer" className="mozilla">Mozilla</a></strong> as a machine learning intern on the ci and quality tools team!</p>
                    <p>previously:</p>
                    <ul>
                        <li>
                            <p>data specialist at <strong><a href="https://www.cohere.com" target="_blank" rel="noopener noreferrer" className="cohere">Cohere</a></strong></p>
                        </li>
                        <li>
                            <p>machine learning intern at <strong><a href="https://www.rbc.com" target="_blank" rel="noopener noreferrer" className="rbc">RBC</a></strong> </p>
                        </li>
                        <li>
                            <p>co-founder of Flipdoor, backed by <strong><a href="https://hatchery.engineering.utoronto.ca/" target="_blank" rel="noopener noreferrer" className="hatchery">UofT Hatchery</a></strong> </p>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="projects-container">
                <div className="projects">
                    <h1>projects</h1>
                    <p>all my projects can be found on my github page, linked under the contact section of my website ;)</p>
                    <p>here are a few of my favourites:</p>
                    <ul>
                        <li>
                            <p><strong>accent style transfer (<a href="https://github.com/benjaminmah/accent-style-transfer" target="_blank" rel="noopener noreferrer">github repo</a>, <a href="/files/accent-style-transfer.pdf" target="_blank" rel="noopener noreferrer">paper</a>):</strong> researched a new method of style transfer using CNNs (results were surprising!)</p>
                        </li>
                        <li>
                            <p><strong>kidney image segmentation (<a href="https://github.com/benjaminmah/kidney-image-segmentation" target="_blank" rel="noopener noreferrer">github repo</a>, <a href="/files/kidney-image-segmentation.pdf" target="_blank" rel="noopener noreferrer">paper</a>):</strong> used a feature pyramid network to segment vasculature in kidney ct scans</p>
                        </li>
                        <li>
                            <p><strong>dubu chatbot (<a href="https://github.com/benjaminmah/dubu-chatbot" target="_blank" rel="noopener noreferrer">github repo</a>, <a href="https://www.youtube.com/watch?v=aZ_y1hcKdSA" target="_blank" rel="noopener noreferrer">demo</a>):</strong> created a customizable chatbot based on user pdf uploads and tone selection</p>
                        </li>
                    </ul>
                </div>
                <img src="/icons/nerd1.png" alt="me" className="projects-image" />
            </div>
        </div>
    )
}

export default About;
