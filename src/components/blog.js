import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/blog.css';

const Blog = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('/blog/posts.json')
            .then(response => response.json())
            .then(data => setPosts(data))
            .catch(error => console.error('Error fetching the blog posts:', error));
    }, []);

    return (
        <div className="main-content">
            <div className="sticky-bar"></div>
            <div className="blog">
                <h1>Blog</h1>
                <ul className="blog-menu">
                    {posts.map((post, index) => (
                        <li key={index}>
                            <Link to={`/blog/${post.id}`}>{post.title}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Blog;
