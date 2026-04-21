import { loadContent, loadBlogPosts, loadJournalEntries } from './contentLoader.js';

document.addEventListener('DOMContentLoaded', () => {
    const topNavLinks = document.querySelectorAll('.top-nav a');
    const sideNavLinks = document.querySelectorAll('.nav-list a');

    function setActiveLink(link) {
        topNavLinks.forEach(navLink => navLink.classList.remove('active'));
        if (link.closest('.top-nav')) {
            link.classList.add('active');
        }
    }

    topNavLinks.forEach(link => {
        // Allow default browser navigation
    });

    sideNavLinks.forEach(link => {
        // No special logic, allow default browser navigation
    });

    // Set initial active link and content based on the current URL
    const path = window.location.pathname;
    const pageName = path.split('/').pop().replace('.html', '');
    const activeLink = Array.from(topNavLinks).find(link => link.href.endsWith(path)) || 
                       Array.from(sideNavLinks).find(link => link.href.endsWith(path));

    if (activeLink) {
        setActiveLink(activeLink);
    }

    if (pageName === 'blog') {
        loadBlogPosts();
    } else if (pageName === 'journal') {
        loadJournalEntries();
    } else if (pageName === 'contact') {
        loadContent('contact', () => import('/scripts/contact.js'));
    } else if (pageName && pageName !== 'index') {
        loadContent(pageName);
    } else {
        loadContent('home');
    }
});
