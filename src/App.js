
import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Window, WindowHeader, WindowContent, Tabs, Tab, TabBody, Button, Anchor, GroupBox, Tooltip, ScrollView, Frame } from 'react95';
import PlaySvg from 'pixelarticons/svg/play.svg';
import PauseSvg from 'pixelarticons/svg/pause.svg';
import PrevSvg from 'pixelarticons/svg/prev.svg';
import NextSvg from 'pixelarticons/svg/next.svg';
import GithubSvg from 'pixelarticons/svg/github.svg';
import LinkedInSvg from './icons/linkedin.png';
import MusicLibSvg from 'pixelarticons/svg/music.svg';
import MailSvg from 'pixelarticons/svg/mail.svg';
import FileSvg from 'pixelarticons/svg/file-alt.svg';

function App() {
  const [activeTab, setActiveTab] = useState(0);
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
  const [current, setCurrent] = useState(0);
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
    a.src = publicUrl(track.src);
    a.load();
    setCurrent(0);
    setDuration(0);
    if (playing) {
      a.play().catch(() => setPlaying(false));
    }
  }, [index, playlist]);

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
      setCurrent(0);
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

  // load blog index
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

  return (
    <div className="appRoot">
      <div className="windowWrap">
        <Window style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <WindowHeader>benji's website</WindowHeader>
          <WindowContent style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Tabs value={activeTab} onChange={handleChange}>
              <Tab value={0}>about</Tab>
              <Tab value={1}>blog</Tab>
              <Tab value={2}>music</Tab>
            </Tabs>
            <TabBody style={{ flex: 1, overflow: 'hidden' }}>
              {activeTab === 0 && (
                <div className="aboutWrap">
                  <div className="stack">
                    <div>
                      i'm benjamin and i'm a final year engineering student at the{' '}
                      <Tooltip text="engineering science!" enterDelay={100} leaveDelay={0}>
                      <Anchor href="https://www.utoronto.ca" target="_blank" rel="noreferrer noopener">university of toronto</Anchor>
                      </Tooltip>
                    </div>
                    <div>
                      i've worked at companies like{' '}
                      <Tooltip text="data science intern!" enterDelay={100} leaveDelay={0}>
                        <Anchor href="https://asana.com" target="_blank" rel="noreferrer noopener">asana</Anchor>
                      </Tooltip>
                      ,{' '}
                      <Tooltip text="ml intern!" enterDelay={100} leaveDelay={0}>
                        <Anchor href="https://www.mozilla.org" target="_blank" rel="noreferrer noopener">mozilla</Anchor>
                      </Tooltip>
                      ,{' '}
                      <Tooltip text="data specialist!" enterDelay={100} leaveDelay={0}>
                        <Anchor href="https://cohere.com" target="_blank" rel="noreferrer noopener">cohere</Anchor>
                      </Tooltip>
                      , and{' '}
                      <Tooltip text="ml intern!" enterDelay={100} leaveDelay={0}>
                        <Anchor href="https://www.rbc.com" target="_blank" rel="noreferrer noopener">rbc</Anchor>
                      </Tooltip>
                    </div>
                    <div>
                      in my free time, i like to collect records, journal, and sleeping (zzz)
                    </div>
                  </div>
                  <div style={{ marginTop: 'auto' }}>
                    <GroupBox label="contact me :)">
                      <div className="iconsRow">
                        <Anchor href="https://www.linkedin.com/in/benjaminmahh/" title="LinkedIn" rel="noreferrer noopener" target="_blank">
                          <img className="icon24 shrink80" src={LinkedInSvg} alt="LinkedIn" />
                        </Anchor>
                        <Anchor href="https://github.com/benjaminmah" title="GitHub" rel="noreferrer noopener" target="_blank">
                          <img className="icon24" src={GithubSvg} alt="GitHub" />
                        </Anchor>
                        <Anchor href="https://open.spotify.com/user/b8og4r9gr9jql088ihzux4lx7?si=5b748481b9274b48" title="Spotify" rel="noreferrer noopener" target="_blank">
                          <img className="icon24" src={MusicLibSvg} alt="Spotify" />
                        </Anchor>
                        <Anchor href="mailto:benjaminmah.bm@gmail.com" title="Email">
                          <img className="icon24" src={MailSvg} alt="Email" />
                        </Anchor>
                        <Anchor href="/files/Benjamin-Mah-Resume.pdf" title="Resume" rel="noreferrer noopener" target="_blank">
                          <img className="icon24" src={FileSvg} alt="Resume" />
                        </Anchor>
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
                            <Button onClick={closeBlog}>Back</Button>
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
                    <img
                      className="albumArtHuge"
                      src={publicUrl(playlist[index]?.cover || '/media/albums/default.svg')}
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
                        <div style={{ width: 180 }}>
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