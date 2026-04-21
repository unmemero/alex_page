import { contentPath } from './utils.js';
import { parseMarkdown } from './markdownParser.js';

async function loadBlogPosts() {
    const mainContent = document.getElementById('main-content');
    console.log('Loading blog posts...');
    mainContent.innerHTML = '<h1>Blog</h1>';
    try {
        const response = await fetch(`${contentPath}/posts.txt`);
        console.log('Fetched posts.txt:', response);
        if (!response.ok) {
            throw new Error('Failed to load posts list');
        }
        const text = await response.text();
        console.log('Posts list content:', text);
        const posts = text.split('\n').filter(p => p.trim() !== '' && /^[a-zA-Z0-9_-]+$/.test(p.trim())); // Validate entries
        console.log('Validated posts list:', posts);
        for (const postFile of posts) {
            const postUrl = `${contentPath}/posts/${postFile}.md`;
            console.log('Loading post file from URL:', postUrl);
            try {
                const postResponse = await fetch(postUrl);
                console.log('Fetched post file response:', postResponse);
                const contentType = postResponse.headers.get('Content-Type');
                console.log('Content-Type:', contentType);
                if (!contentType || !contentType.includes('text/markdown')) {
                    console.error(`Unexpected Content-Type for ${postFile}:`, contentType);
                    continue;
                }
                if (postResponse.ok) {
                    const markdown = await postResponse.text();
                    console.log('Post markdown content:', markdown);
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
    console.log('Loading journal entries...');
    mainContent.innerHTML = '<h1>Journal</h1>';
    try {
        const response = await fetch(`${contentPath}/entries.txt`);
        console.log('Fetched entries.txt:', response);
        if (!response.ok) {
            throw new Error('Failed to load entries list');
        }
        const text = await response.text();
        console.log('Entries list content:', text);
        const entries = text.split('\n').filter(e => e.trim() !== '' && /^[a-zA-Z0-9_-]+$/.test(e.trim())); // Validate entries
        console.log('Validated entries list:', entries);
        for (const entryFile of entries) {
            const entryUrl = `${contentPath}/entries/${entryFile}.md`;
            console.log('Loading entry file from URL:', entryUrl);
            try {
                const entryResponse = await fetch(entryUrl);
                console.log('Fetched entry file response:', entryResponse);
                const contentType = entryResponse.headers.get('Content-Type');
                console.log('Content-Type:', contentType);
                if (!contentType || !contentType.includes('text/markdown')) {
                    console.error(`Unexpected Content-Type for ${entryFile}:`, contentType);
                    continue;
                }
                if (entryResponse.ok) {
                    const markdown = await entryResponse.text();
                    console.log('Entry markdown content:', markdown);
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
    console.log('DOMContentLoaded event fired');
    const path = window.location.pathname;
    console.log('Current path:', path);

    if (path.includes('/pages/blog')) { // Adjusted path check
        console.log('Loading blog posts...');
        loadBlogPosts();
    } else if (path.includes('/pages/journal')) { // Adjusted path check
        console.log('Loading journal entries...');
        loadJournalEntries();
    } else {
        console.log('No matching path for blog or journal');
    }
});
