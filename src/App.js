
import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Window, WindowHeader, WindowContent, Tabs, Tab, TabBody, Button } from 'react95';
import PlaySvg from 'pixelarticons/svg/play.svg';
import PauseSvg from 'pixelarticons/svg/pause.svg';
import PrevSvg from 'pixelarticons/svg/prev.svg';
import NextSvg from 'pixelarticons/svg/next.svg';

function App() {
  const [activeTab, setActiveTab] = useState(0);
  // playlist
  const [playlist, setPlaylist] = useState([]);
  const [index, setIndex] = useState(0);
  // Music state
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [noAnim, setNoAnim] = useState(false);

  useEffect(() => {
    // load playlist.json so you can add tracks without code changes
    fetch('/media/playlist.json')
      .then((r) => r.json())
      .then((data) => {
        if (data && Array.isArray(data.tracks) && data.tracks.length > 0) {
          setPlaylist(data.tracks);
        } else {
          setPlaylist([
            {
              src: '/media/tracks/song.mp3',
              title: 'Song',
              artist: 'Artist',
              cover: '/media/albums/default.svg',
            },
          ]);
        }
      })
      .catch(() => {
        setPlaylist([
          {
            src: '/media/tracks/song.mp3',
            title: 'Song',
            artist: 'Artist',
            cover: '/media/albums/default.svg',
          },
        ]);
      });
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    const onLoaded = () => {
      setDuration(audio.duration || 0);
      setNoAnim(false);
    };
    const onTime = () => setCurrent(audio.currentTime || 0);
    const onEnded = () => setIndex((i) => i + 1);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  // when index or playlist changes, load the track
  useEffect(() => {
    if (!audioRef.current || playlist.length === 0) return;
    setNoAnim(true);
    const track = playlist[index % playlist.length];
    const a = audioRef.current;
    a.src = track.src;
    a.load();
    setCurrent(0);
    setDuration(0);
    if (playing) {
      a.play().catch(() => setPlaying(false));
    }
  }, [index, playlist]);

  const handleChange = (value) => setActiveTab(value);

  const playPause = () => {
    if (!playlist.length) return;
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  const restart = () => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = 0;
    if (playing) a.play();
  };

  const prev = () => {
    const a = audioRef.current;
    if (!a || playlist.length === 0) return;
    if (a.currentTime > 2) {
      // restart current
      setNoAnim(true);
      a.currentTime = 0;
      if (!playing) {
        a.play().then(() => setPlaying(true)).catch(() => {});
      }
      // allow layout to catch up then re-enable animation
      setTimeout(() => setNoAnim(false), 80);
      return;
    }
    setNoAnim(true);
    setPlaying(true);
    setIndex((i) => (i - 1 + playlist.length) % playlist.length);
  };

  const next = () => {
    if (playlist.length === 0) return;
    setNoAnim(true);
    setPlaying(true);
    setIndex((i) => (i + 1) % playlist.length);
  };

  const percent = duration ? Math.min(100, (current / duration) * 100) : 0;

  return (
    <div className="appRoot">
      <div className="windowWrap">
        <Window style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <WindowHeader>benji's website</WindowHeader>
          <WindowContent style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Tabs value={activeTab} onChange={handleChange}>
              <Tab value={0}>about</Tab>
              <Tab value={1}>music</Tab>
            </Tabs>
            <TabBody style={{ flex: 1, overflow: 'hidden' }}>
              {activeTab === 0 && (
                <div className="stack">
                  <div>about me content goes here.</div>
                  <div>placeholder text for the about tab.</div>
                </div>
              )}
              {activeTab === 1 && (
                <div className="musicCenter">
                  <div className="artArea">
                    <img
                      className="albumArtHuge"
                      src={playlist[index]?.cover || '/media/albums/default.svg'}
                      alt={playlist[index]?.title ? `${playlist[index].title} cover` : 'album cover'}
                    />
                  </div>
                  <div className="bottomArea">
                    <Marquee text={`${playlist[index]?.title || 'Unknown Title'} — ${playlist[index]?.artist || 'Unknown Artist'}`} />
                    <div className="controlsRow">
                      <div className="controlsLeft">
                        <Button className="squareButton" onClick={prev} aria-label="Previous">
                          <img className="icon24" src={PrevSvg} alt="prev" />
                        </Button>
                        <Button className="squareButton" onClick={playPause} aria-label={playing ? 'Pause' : 'Play'}>
                          <img className="icon24" src={playing ? PauseSvg : PlaySvg} alt={playing ? 'pause' : 'play'} />
                        </Button>
                        <Button className="squareButton" onClick={next} aria-label="Next">
                          <img className="icon24" src={NextSvg} alt="next" />
                        </Button>
                      </div>
                      <div className="controlsRight">
                        <div style={{ flex: 1, minWidth: 120 }}>
                          <div className="progressOuter">
                            <div className={`progressInner ${noAnim ? 'noAnim' : ''}`} style={{ transform: `scaleX(${(percent || 0) / 100})` }} />
                          </div>
                        </div>
                        <div style={{ whiteSpace: 'nowrap' }}>
                          {formatTime(current)} / {formatTime(duration)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabBody>
          </WindowContent>
        </Window>
      </div>
    </div>
  );
}

export default App;

function formatTime(sec) {
  if (!sec || !isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

function Marquee({ text, pause = 1200 }) {
  const wrapRef = useRef(null);
  const textRef = useRef(null);
  const [needsScroll, setNeedsScroll] = useState(false);
  const [style, setStyle] = useState({});

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = textRef.current;
    if (!wrap || !inner) return;
    // measure overflow
    const wrapW = wrap.clientWidth;
    const innerW = inner.scrollWidth;
    const overflow = Math.max(0, innerW - wrapW);
    if (overflow <= 0) {
      setNeedsScroll(false);
      setStyle({ transform: 'translateX(0)' });
      return;
    }
    setNeedsScroll(true);
    const pxPerSec = 40; // speed
    const travelSec = overflow / pxPerSec;
    const totalSec = travelSec + pause / 1000 + 0.5; // add small ease time
    setStyle({
      ['--scroll-dist']: `${overflow}px`,
      ['--scroll-time']: `${totalSec}s`,
      ['--pause-time']: `${pause}ms`,
    });
  }, [text, pause]);

  return (
    <div ref={wrapRef} className={`marqueeWrap ${needsScroll ? 'scrolling' : 'centered'}`}>
      <div
        ref={textRef}
        className={`marqueeText ${needsScroll ? 'running' : ''}`}
        style={style}
      >
        {text}
      </div>
    </div>
  );
}

function PauseIcon(props) {
  // simple 16x16 pixel pause using crisp edges
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 -0.5 16 16"
      shapeRendering="crispEdges"
      {...props}
    >
      <path stroke="#000" d="M4 2h3M4 3h1m1 0h1M4 4h1m1 0h1M4 5h1m1 0h1M4 6h1m1 0h1M4 7h1m1 0h1M4 8h1m1 0h1M4 9h1m1 0h1M4 10h1m1 0h1M4 11h3" />
      <path stroke="#000" d="M9 2h3M9 3h1m1 0h1M9 4h1m1 0h1M9 5h1m1 0h1M9 6h1m1 0h1M9 7h1m1 0h1M9 8h1m1 0h1M9 9h1m1 0h1M9 10h1m1 0h1M9 11h3" />
    </svg>
  );
}
