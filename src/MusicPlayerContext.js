import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

const MusicPlayerContext = createContext();

export const MusicPlayerProvider = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const baseUrl = process.env.PUBLIC_URL || '';
    const audioRef = useRef(new Audio(`${baseUrl}/easy.mp3`));

    useEffect(() => {
        const audio = audioRef.current;

        const handleEnded = () => {
            setIsPlaying(false);
        };

        audio.addEventListener('ended', handleEnded);

        if (isPlaying) {
            audio.play().catch(error => console.log('Error playing audio:', error));
        } else {
            audio.pause();
        }

        return () => {
            audio.removeEventListener('ended', handleEnded);
            audio.pause();
        };
    }, [isPlaying]);

    const togglePlayPause = () => {
        setIsPlaying(prevState => !prevState);
    };

    const restart = () => {
        const audio = audioRef.current;
        audio.currentTime = 0;
        audio.play().catch(error => console.log('Error restarting audio:', error));
        setIsPlaying(true);
    };

    return (
        <MusicPlayerContext.Provider value={{ isPlaying, togglePlayPause, restart }}>
            {children}
        </MusicPlayerContext.Provider>
    );
};

export const useMusicPlayer = () => useContext(MusicPlayerContext);
