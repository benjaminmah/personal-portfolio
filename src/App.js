
import { useEffect, useRef, useState } from 'react';
import './App.css';
import { ThemeProvider } from 'styled-components';
import original from 'react95/dist/themes/original';
import honey from 'react95/dist/themes/honey';
import lilac from 'react95/dist/themes/lilac';
import rose from 'react95/dist/themes/rose';
import vaporTeal from 'react95/dist/themes/vaporTeal';
import spruce from 'react95/dist/themes/spruce';
import { Window, WindowHeader, WindowContent, Tabs, Tab, TabBody, Button, Anchor, GroupBox, Tooltip, ScrollView, Frame, Radio, Avatar } from 'react95';
import { ReactComponent as PlayIcon } from 'pixelarticons/svg/play.svg';
import { ReactComponent as PauseIcon } from 'pixelarticons/svg/pause.svg';
import { ReactComponent as PrevIcon } from 'pixelarticons/svg/prev.svg';
import { ReactComponent as NextIcon } from 'pixelarticons/svg/next.svg';
import { ReactComponent as GithubIcon } from 'pixelarticons/svg/github.svg';
import { ReactComponent as MusicIcon } from 'pixelarticons/svg/music.svg';
import { ReactComponent as MailIcon } from 'pixelarticons/svg/mail.svg';
import { ReactComponent as FileIcon } from 'pixelarticons/svg/file-alt.svg';

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [smallScreen, setSmallScreen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 600 || window.innerHeight < 600;
  });
  // theme
  const themeOptions = [
    { key: 'original', label: 'default', theme: original },
    { key: 'dalgona', label: 'honey', theme: honey },
    { key: 'lavender', label: 'lavender', theme: lilac },
    { key: 'roseQuartz', label: 'rose', theme: rose },
    { key: 'vaporwave', label: 'pacific', theme: vaporTeal },
    { key: 'matcha', label: 'matcha', theme: spruce },
  ];
  const [themeKey, setThemeKey] = useState(() => {
    try {
      return localStorage.getItem('themeKey') || 'original';
    } catch {
      return 'original';
    }
  });
  const currentTheme = themeOptions.find(t => t.key === themeKey)?.theme || original;

  // Sync CRT-style background with selected theme
  useEffect(() => {
    const baseByTheme = {
      original: '#0b1226',
      dalgona: '#1a1308', // warm brown
      lavender: '#120e1a', // soft purple tint
      roseQuartz: '#140e12', // rosy tint
      pastelDaydream: '#111318', // muted dark base for pastels
      vaporwave: '#0a1820', // teal/cyan tint
      midnightVista: '#0a1129', // deep midnight blue
      matcha: '#0d140f', // deep green tea
    };
    const base = baseByTheme[themeKey] || '#0b1226';
    const body = document.body;
    if (!body) return;
    body.style.backgroundColor = base;
    body.style.backgroundImage = 'none';
  }, [themeKey]);
  // blog posts (loaded from public/blog/posts.json)
  const [blogPosts, setBlogPosts] = useState([]);
  const [blogLoading, setBlogLoading] = useState(false);
  const [blogError, setBlogError] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null); // id or null
  const [postBody, setPostBody] = useState('');
  const [postLoading, setPostLoading] = useState(false);
  // playlist
  const [playlist, setPlaylist] = useState([]);
  const [index, setIndex] = useState(0);
  // Music state
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  // displaySec is a clamped, once-per-second counter for retro feel
  const [displaySec, setDisplaySec] = useState(0);
  const [noAnim, setNoAnim] = useState(false);

  useEffect(() => {
    // load playlist.json so you can add tracks without code changes
    fetch(publicUrl('/media/playlist.json'))
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
    const onEnded = () => setIndex((i) => i + 1);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current || playlist.length === 0) return;
    setNoAnim(true);
    const track = playlist[index % playlist.length];
    const a = audioRef.current;
    a.src = publicUrl(track.src);
    a.load();
    
    setDuration(0);
    setDisplaySec(0);
  }, [index, playlist]);

  // control playback when 'playing' changes (or when new src is set)
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.play().catch(() => setPlaying(false));
    } else {
      a.pause();
    }
  }, [playing, index]);

  const handleChange = (value) => setActiveTab(value);

  const openBlog = (id) => setSelectedBlog(id);
  const closeBlog = () => setSelectedBlog(null);

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

  const prev = () => {
    const a = audioRef.current;
    if (!a || playlist.length === 0) return;
    if (a.currentTime > 2) {
      // restart current
      setNoAnim(true);
      a.currentTime = 0;
      
      setDisplaySec(0);
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

  // Stepwise progress (update once per whole second for Win95 feel)
  const percent = duration ? Math.min(100, (displaySec / duration) * 100) : 0;

  // Keep displaySec ticking at most +1 per second, synced to audio time
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    // sync immediately when toggling play/pause
    setDisplaySec(Math.floor(a.currentTime || 0));
    let id;
    if (playing) {
      id = setInterval(() => {
        const now = Math.floor(a.currentTime || 0);
        setDisplaySec((prev) => (now > prev ? prev + 1 : prev));
      }, 1000);
    }
    return () => { if (id) clearInterval(id); };
  }, [playing]);

  // load blog index
  useEffect(() => {
    const onResize = () => {
      setSmallScreen(window.innerWidth < 600 || window.innerHeight < 600);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    setBlogLoading(true);
    setBlogError(null);
    fetch(publicUrl('/blog/posts.json'))
      .then((r) => {
        if (!r.ok) throw new Error('failed to load posts');
        return r.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.posts)) {
          setBlogPosts(data.posts);
        } else {
          setBlogPosts([]);
        }
      })
      .catch((e) => setBlogError(e.message || 'error'))
      .finally(() => setBlogLoading(false));
  }, []);

  // load post body when selected
  useEffect(() => {
    if (selectedBlog === null) {
      setPostBody('');
      return;
    }
    const post = blogPosts.find((p) => p.id === selectedBlog);
    if (!post || !post.body) return;
    setPostLoading(true);
    fetch(publicUrl(post.body))
      .then((r) => r.text())
      .then((txt) => setPostBody(txt))
      .finally(() => setPostLoading(false));
  }, [selectedBlog, blogPosts]);

  // CSS variables for theming UI pieces
  const headerBg = currentTheme.headerBackground;
  const computedFill = themeKey === 'dalgona'
    ? 'rgb(255, 255, 0)'
    : (headerBg || currentTheme.progress || currentTheme.anchor || currentTheme.flatDark || currentTheme.borderDark);

  const styleVars = {
    '--progress-bg': currentTheme.canvas,
    '--progress-fill': computedFill,
    '--progress-border': currentTheme.borderDarkest,
    '--progress-w': '260px',
    '--icon-color': currentTheme.materialText || currentTheme.canvasText,
    '--album-bg': currentTheme.canvas,
    '--bevel-lightest': currentTheme.borderLightest,
    '--bevel-light': currentTheme.borderLight,
    '--bevel-dark': currentTheme.borderDark,
    '--bevel-darkest': currentTheme.borderDarkest,
  };

  if (smallScreen) {
    return (
      <div className="appRoot">
        <ThemeProvider theme={currentTheme}>
          <div className="windowWrap" style={styleVars}>
            <Window style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <WindowHeader>benjamin's website</WindowHeader>
              <WindowContent style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                unfortunately your screen is too small to display my website :( <br /><br />
                revisit on a larger device?
              </WindowContent>
            </Window>
          </div>
        </ThemeProvider>
      </div>
    );
  }

  return (
    <div className="appRoot">
      <ThemeProvider theme={currentTheme}>
      <div className="windowWrap" style={styleVars}>
        <Window style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <WindowHeader>benjamin's website</WindowHeader>
          <WindowContent style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Tabs value={activeTab} onChange={handleChange}>
              <Tab value={0}>about</Tab>
              <Tab value={1}>blog</Tab>
              <Tab value={2}>music</Tab>
              <Tab value={3}>themes</Tab>
            </Tabs>
            <TabBody style={{ flex: 1, overflow: 'hidden' }}>
              {activeTab === 0 && (
                <div className="aboutWrap">
                  <div className="stack">
                    <div>
                      hey! i'm benjamin and i'm a final year engineering student at the{' '}
                      <Tooltip text="engineering science" enterDelay={100} leaveDelay={0}>
                      <Anchor href="https://www.utoronto.ca" target="_blank" rel="noreferrer noopener">university of toronto</Anchor>
                      </Tooltip>
                      ,{' '}currently doing research at the{' '}
                      <Tooltip text="third space group" enterDelay={100} leaveDelay={0}>
                        <Anchor href="https://dgp.toronto.edu" target="_blank" rel="noreferrer noopener">dgp lab</Anchor>
                      </Tooltip>
                    </div>
                    <div>
                      i've worked at companies like{' '}
                      <Tooltip text="data science intern" enterDelay={100} leaveDelay={0}>
                        <Anchor href="https://asana.com" target="_blank" rel="noreferrer noopener">asana</Anchor>
                      </Tooltip>
                      ,{' '}
                      <Tooltip text="ml intern" enterDelay={100} leaveDelay={0}>
                        <Anchor href="https://www.mozilla.org" target="_blank" rel="noreferrer noopener">mozilla</Anchor>
                      </Tooltip>
                      ,{' '}
                      <Tooltip text="data specialist" enterDelay={100} leaveDelay={0}>
                        <Anchor href="https://cohere.com" target="_blank" rel="noreferrer noopener">cohere</Anchor>
                      </Tooltip>
                      , and{' '}
                      <Tooltip text="ml intern" enterDelay={100} leaveDelay={0}>
                        <Anchor href="https://www.rbc.com" target="_blank" rel="noreferrer noopener">rbc</Anchor>
                      </Tooltip>
                    </div>
                    <div>
                      in my free time, i like to collect records, journal, and sleep (zzz)
                    </div>
                  </div>
                  <div style={{ marginTop: 'auto' }}>
                    <GroupBox label="contact me :)">
                      <div className="iconsRow">
                        <Tooltip text="linkedin" enterDelay={100} leaveDelay={0}>
                          <Anchor href="https://www.linkedin.com/in/benjaminmahh/" title="LinkedIn" rel="noreferrer noopener" target="_blank">
                            <span className="iconMask linkedinMask" aria-hidden="true" />
                            <span className="sr-only" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>LinkedIn</span>
                          </Anchor>
                        </Tooltip>
                        <Tooltip text="github" enterDelay={100} leaveDelay={0}>
                          <Anchor href="https://github.com/benjaminmah" title="GitHub" rel="noreferrer noopener" target="_blank">
                            <GithubIcon className="icon24SvgLg" />
                          </Anchor>
                        </Tooltip>
                        <Tooltip text="spotify" enterDelay={100} leaveDelay={0}>
                          <Anchor href="https://open.spotify.com/user/b8og4r9gr9jql088ihzux4lx7?si=5b748481b9274b48" title="Spotify" rel="noreferrer noopener" target="_blank">
                            <MusicIcon className="icon24SvgLg" />
                          </Anchor>
                        </Tooltip>
                        <Tooltip text="email" enterDelay={100} leaveDelay={0}>
                          <Anchor href="mailto:benjaminmah.bm@gmail.com" title="Email">
                            <MailIcon className="icon24SvgLg" />
                          </Anchor>
                        </Tooltip>
                        <Tooltip text="resume" enterDelay={100} leaveDelay={0}>
                          <Anchor href="/files/Benjamin-Mah-Resume.pdf" title="Resume" rel="noreferrer noopener" target="_blank">
                            <FileIcon className="icon24SvgLg" />
                          </Anchor>
                        </Tooltip>
                      </div>
                    </GroupBox>
                  </div>
                </div>
              )}
              {activeTab === 1 && (
                <div className="stack">
                  {selectedBlog === null ? (
                    <div>
                      {blogLoading && <div>loading…</div>}
                      {blogError && <div>error: {blogError}</div>}
                      {blogPosts.map((p) => (
                        <div key={p.id}>
                          <Anchor href="#" onClick={(e) => { e.preventDefault(); openBlog(p.id); }}>
                            {p.date} — {p.title}
                          </Anchor>
                        </div>
                      ))}
                    </div>
                  ) : (
                    (() => {
                      const post = blogPosts.find((bp) => bp.id === selectedBlog);
                      if (!post) return null;
                      return (
                        <div className="stack" style={{ height: '100%' }}>
                          <div className="row">
                            <Button onClick={closeBlog}>back</Button>
                            <strong style={{ marginLeft: 8, fontWeight: 'bold'}}>{post.title}</strong>
                          </div>
                          <div style={{ flex: 1, minHeight: 0 }}>

                            <Frame variant='field'>
                              <ScrollView>
                            <div
                              style={{
                                padding: '0.5rem',
                                maxHeight: '290px',
                                overflowY: 'auto',
                              }}
                            >
                              <div style={{ whiteSpace: 'pre-wrap' }}>{postLoading ? 'loading…' : postBody}</div>
                            </div>
                            </ScrollView>
                            </Frame>
                            

                          </div>
                        </div>
                      );
                    })()
                  )}
                </div>
              )}
              {activeTab === 2 && (
                <div className="musicCenter">
                  <div className="artArea">
                      <Avatar square size={250}>
                      <img
                        className="albumArtHuge"
                        src={publicUrl(playlist[index]?.cover || '/media/albums/default.svg')}
                        alt={playlist[index]?.title ? `${playlist[index].title} cover` : 'album cover'}
                      />
                      </Avatar>
                  </div>
                  <div className="bottomArea">
                    <Marquee text={`${playlist[index]?.title || 'Unknown Title'} - ${playlist[index]?.artist || 'Unknown Artist'}`} />
                    <div className="controlsBlock">
                      <div className="progressRow">
                        <div className="progressWrap">
                          <div className="progressOuter">
                            <div className={`progressInner ${noAnim ? 'noAnim' : ''}`} style={{ transform: `scaleX(${(percent || 0) / 100})` }} />
                          </div>
                        </div>
                        <div className="timeText">
                          {formatTime(displaySec)} / {formatTime(duration)}
                        </div>
                      </div>
                      <div className="controlsLeft">
                        <Button variant='thin' className="squareButton" onClick={prev} aria-label="Previous">
                          <PrevIcon className="icon24Svg" />
                        </Button>
                        <Button variant='thin' className="squareButton" onClick={playPause} aria-label={playing ? 'Pause' : 'Play'}>
                          {playing ? (
                            <PauseIcon className="icon24Svg" />
                          ) : (
                            <PlayIcon className="icon24Svg" />
                          )}
                        </Button>
                        <Button variant='thin' className="squareButton" onClick={next} aria-label="Next">
                          <NextIcon className="icon24Svg" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 3 && (
                <div className="stack">
                  <div className="stack">
                    {themeOptions.map((opt) => (
                      <Radio
                        key={opt.key}
                        name="theme-radio"
                        label={opt.label}
                        checked={themeKey === opt.key}
                        onChange={() => {
                          setThemeKey(opt.key);
                          try { localStorage.setItem('themeKey', opt.key); } catch {}
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </TabBody>
          </WindowContent>
        </Window>
      </div>
      </ThemeProvider>
    </div>
  );
}

export default App;

function publicUrl(p) {
  const base = process.env.PUBLIC_URL || '';
  if (!p) return '';
  if (/^https?:\/\//i.test(p)) return p;
  if (p.startsWith('/')) return `${base}${p}`;
  return `${base}/${p}`;
}

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
      '--scroll-dist': `${overflow}px`,
      '--scroll-time': `${totalSec}s`,
      '--pause-time': `${pause}ms`,
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
