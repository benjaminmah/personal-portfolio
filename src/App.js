import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/home';
import About from './components/about';
import Blog from './components/blog';
import BlogPost from './components/blog-post';
import Contact from './components/contact';
import Layout from './components/layout';
import { MusicPlayerProvider } from './MusicPlayerContext';

const App = () => {
  return (
    <MusicPlayerProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:id" element={<BlogPost />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </MusicPlayerProvider>
  );
};

export default App;
