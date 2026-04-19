import { loadContent, loadBlogPosts, loadJournalEntries } from './contentLoader.js';

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.top-nav a');
    
    function setActiveLink(link) {
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        link.classList.add('active');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            setActiveLink(link);
            const page = new URL(link.href).pathname.split('/').pop().replace('.html', '');
            
            if (page === 'blog') {
                loadBlogPosts();
            } else if (page === 'journal') {
                loadJournalEntries();
            } else if (page === 'contact') {
                loadContent(page, () => {
                    // Dynamically import and run the contact script after the form is loaded
                    import('./contact.js');
                });
            } else if (page === 'contact') {
                loadContent(page, () => {
                    // Dynamically import and run the contact script after the form is loaded
                    import('./contact.js');
                });
            } else if (page === 'index' || page === 'home' || page === '') {
                loadContent('home');
            } else {
                loadContent(page);
            }
        });
    });

    // Set initial active link and content
    const homeLink = Array.from(navLinks).find(link => link.href.includes('index.html'));
    if (homeLink) {
        setActiveLink(homeLink);
    }
    loadContent('home');
});
