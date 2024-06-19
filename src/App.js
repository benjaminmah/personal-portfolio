import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home';
import About from './components/about';
import Blog from './components/blog';
import BlogPost from './components/blog-post';
import Layout from './components/layout';
import { MusicPlayerProvider } from './MusicPlayerContext';

const App = () => {
  return (
    <MusicPlayerProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:id" element={<BlogPost />} />
            {/* Add other routes here */}
          </Route>
        </Routes>
      </Router>
    </MusicPlayerProvider>
  );
};

export default App;
