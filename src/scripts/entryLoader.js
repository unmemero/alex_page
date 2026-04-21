import { contentPath } from './utils.js';
import { parseMarkdown } from './markdownParser.js';

async function loadBlogPosts() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '<h1>Blog</h1>';
    try {
        const response = await fetch(`${contentPath}/posts/posts.txt`);
        if (!response.ok) {
            throw new Error('Failed to load posts list');
        }
        const text = await response.text();
        const posts = text.split('\n').filter(p => p.trim() !== '' && /^[a-zA-Z0-9_-]+$/.test(p.trim())); // Validate entries
        for (const postFile of posts) {
            const postUrl = `${contentPath}/posts/${postFile}.md`;
            try {
                const postResponse = await fetch(postUrl);
                const contentType = postResponse.headers.get('Content-Type');
                if (!contentType || !contentType.includes('text/markdown')) {
                    console.error(`Unexpected Content-Type for ${postFile}:`, contentType);
                    continue;
                }
                if (postResponse.ok) {
                    const markdown = await postResponse.text();
                    const htmlContent = parseMarkdown(markdown);
                    const postContainer = document.createElement('div');
                    postContainer.className = 'blog-post';
                    postContainer.innerHTML = htmlContent;
                    mainContent.appendChild(postContainer);
                }
            } catch (error) {
                console.error(`Failed to load blog post: ${postFile}`, error);
                mainContent.innerHTML += `<p>Error loading blog post: ${postFile}</p>`;
            }
        }
    } catch (error) {
        console.error('Failed to load blog posts:', error);
        mainContent.innerHTML += '<p>Error loading blog posts.</p>';
    }
}

async function loadJournalEntries() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '<h1>Journal</h1>';
    try {
        const response = await fetch(`${contentPath}/entries/entries.txt`);
        if (!response.ok) {
            throw new Error('Failed to load entries list');
        }
        const text = await response.text();
        const entries = text.split('\n').filter(e => e.trim() !== '' && /^[a-zA-Z0-9_-]+$/.test(e.trim())); // Validate entries
        for (const entryFile of entries) {
            const entryUrl = `${contentPath}/entries/${entryFile}.md`;
            try {
                const entryResponse = await fetch(entryUrl);
                const contentType = entryResponse.headers.get('Content-Type');
                if (!contentType || !contentType.includes('text/markdown')) {
                    console.error(`Unexpected Content-Type for ${entryFile}:`, contentType);
                    continue;
                }
                if (entryResponse.ok) {
                    const markdown = await entryResponse.text();
                    const htmlContent = parseMarkdown(markdown);
                    const entryContainer = document.createElement('div');
                    entryContainer.className = 'journal-entry';
                    entryContainer.innerHTML = htmlContent;
                    mainContent.appendChild(entryContainer);
                }
            } catch (error) {
                console.error(`Failed to load journal entry: ${entryFile}`, error);
                mainContent.innerHTML += `<p>Error loading journal entry: ${entryFile}</p>`;
            }
        }
    } catch (error) {
        console.error('Failed to load journal entries:', error);
        mainContent.innerHTML += '<p>Error loading journal entries.</p>';
    }
}

// Reminder: Ensure the server is configured to serve .md files with Content-Type: text/markdown

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.includes('/pages/blog')) { // Adjusted path check
        loadBlogPosts();
    } else if (path.includes('/pages/journal')) { // Adjusted path check
        loadJournalEntries();
    }
});
