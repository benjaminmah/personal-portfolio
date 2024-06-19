import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import '../styles/blog.css';

const BlogPost = () => {
    const { id } = useParams();
    const [content, setContent] = useState('');

    useEffect(() => {
        fetch(`/blog/${id}.md`)
            .then(response => response.text())
            .then(text => setContent(text))
            .catch(error => console.error('Error fetching the blog post:', error));
    }, [id]);

    return (
        <div className="main-content">
            <div className="sticky-bar"></div>
            <div className="blog-post">
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
        </div>
    );
}

export default BlogPost;
