import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/blog.css';

const Blog = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const baseUrl = process.env.PUBLIC_URL || '';
        fetch(`${baseUrl}/blog/posts.json`)
            .then(response => response.json())
            .then(data => setPosts(data))
            .catch(error => console.error('Error fetching the blog posts:', error));
    }, []);

    return (
        <div className="main-content">
            <div className="blog">
                <h1>blog</h1>
                <h6>a simple collection of my thoughts</h6>
                <div className="blog-menu-wrapper">
                    <ul className="blog-menu">
                        {posts.map((post, index) => (
                            <li key={index}>
                                <Link to={`/blog/${post.id}`}>{post.title}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Blog;
