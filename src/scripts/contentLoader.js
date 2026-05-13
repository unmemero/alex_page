import { contentPath } from './utils.js';
import { parseMarkdown } from './markdownParser.js';

export async function loadContent(page, callback) {
    try {
        const response = await fetch(`${contentPath}/${page}.md`);
        if (response.ok) {
            const markdown = await response.text();
            const htmlContent = parseMarkdown(markdown);
            document.getElementById('main-content').innerHTML = htmlContent;
            if (callback) {
                callback();
            }
        } else {
            document.getElementById('main-content').innerHTML = '<p>Error loading content. Please try again later.</p>';
        }
    } catch (error) {
        console.error('Failed to load content:', error);
        document.getElementById('main-content').innerHTML = '<p>Error loading content. Please try again later.</p>';
    }
}

export async function loadBlogPosts() {
    document.getElementById('main-content').innerHTML = '<h1>Blog</h1>';
    try {
        const response = await fetch(`${contentPath}/posts/posts.txt`);
        if (!response.ok) {
            throw new Error('Failed to load posts list');
        }
        const text = await response.text();
        const posts = text.split('\n').filter(p => p.trim() !== ''); // split by line and remove empty lines
        for (const postFile of posts) {
            try {
                const postResponse = await fetch(`${contentPath}/posts/${postFile}.md`);
                if (postResponse.ok) {
                    const markdown = await postResponse.text();
                    const htmlContent = parseMarkdown(markdown);
                    const postContainer = document.createElement('div');
                    postContainer.className = 'blog-post';
                    postContainer.innerHTML = htmlContent;
                    document.getElementById('main-content').appendChild(postContainer);
                }
            } catch (error) {
                console.error(`Failed to load blog post: ${postFile}`, error);
            }
        }
    } catch (error) {
        console.error('Failed to load blog posts:', error);
        document.getElementById('main-content').innerHTML += '<p>Error loading blog posts.</p>';
    }
}

export async function loadJournalEntries() {
    document.getElementById('main-content').innerHTML = '<h1>Journal</h1>';
    try {
        const response = await fetch(`${contentPath}/entries/entries.txt`);
        if (!response.ok) {
            throw new Error('Failed to load entries list');
        }
        const text = await response.text();
        const entries = text.split('\n').filter(e => e.trim() !== '');
        for (const entryFile of entries) {
            try {
                const entryResponse = await fetch(`${contentPath}/entries/${entryFile}.md`);
                if (entryResponse.ok) {
                    const markdown = await entryResponse.text();
                    const htmlContent = parseMarkdown(markdown);
                    const entryContainer = document.createElement('div');
                    entryContainer.className = 'journal-entry';
                    entryContainer.innerHTML = htmlContent;
                    document.getElementById('main-content').appendChild(entryContainer);
                }
            } catch (error) {
                console.error(`Failed to load journal entry: ${entryFile}`, error);
            }
        }
    } catch (error) {
        console.error('Failed to load journal entries:', error);
        document.getElementById('main-content').innerHTML += '<p>Error loading journal entries.</p>';
    }
}

export async function loadHomepageContent() {
    try {
        // Load newest journal
        const journalResponse = await fetch(`${contentPath}/entries/entries.txt`);
        if (journalResponse.ok) {
            const text = await journalResponse.text();
            const entries = text.split('\n').filter(e => e.trim() !== '');
            if (entries.length > 0) {
                const entryFile = entries[entries.length - 1]; // Use the last one as newest based on naming 1..4
                const entryResponse = await fetch(`${contentPath}/entries/${entryFile}.md`);
                if (entryResponse.ok) {
                    const markdown = await entryResponse.text();
                    const htmlContent = parseMarkdown(markdown);
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = htmlContent;
                    const textContent = tempDiv.textContent.trim().substring(0, 80) + '...';
                    
                    document.getElementById('hp-m-c-s1-top-journal').innerHTML = `
                        <div class="journal-snippet">
                            <p class="journal-meta"><strong>Webmaster ⭐</strong><br>7305 days ago:</p>
                            <p Headed to Miller Creek again, I'm so close I know it...</p>
                        </div>
                    `;
                }
            }
        }

        // Load newest blog post
        const blogResponse = await fetch(`${contentPath}/posts/posts.txt`);
        if (blogResponse.ok) {
            const text = await blogResponse.text();
            const posts = text.split('\n').filter(p => p.trim() !== '');
            if (posts.length > 0) {
                const postFile = posts[0]; // First is newest for posts
                const postResponse = await fetch(`${contentPath}/posts/${postFile}.md`);
                if (postResponse.ok) {
                    const markdown = await postResponse.text();
                    const htmlContent = parseMarkdown(markdown);
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = htmlContent;
                    const dateHeader = tempDiv.querySelector('h1');
                    const dateText = dateHeader ? dateHeader.textContent : 'Latest:';
                    if (dateHeader) dateHeader.remove();
                    
                    const textContent = tempDiv.textContent.trim().substring(0, 150) + '...';

                    document.getElementById('hp-m-c-s2-blog').innerHTML = `
                        <h3>Latest Blog</h3>
                        <p><strong>${dateText}:</strong> ${textContent}</p>
                    `;
                }
            }
        }
    } catch (error) {
        console.error('Failed to load homepage content:', error);
    }
}
