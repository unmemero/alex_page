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
            } else if (page === 'index' || page === 'home' || page === '') {
                loadContent('home');
            } else {
                loadContent(page);
            }
        });
    });

    sideNavLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const page = new URL(link.href).pathname.split('/').pop().replace('.html', '');
            if (page !== 'music') {
                event.preventDefault();
                if (page === 'blog') {
                    loadBlogPosts();
                } else if (page === 'gallery') {
                    loadContent('gallery');
                } else if (page === 'sitemap') {
                    loadContent('sitemap');
                }
            }
        });
    });

    // Set initial active link and content
    const homeLink = Array.from(topNavLinks).find(link => link.href.includes('index.html'));
    if (homeLink) {
        setActiveLink(homeLink);
    }
    loadContent('home');



        if (player) {
            player.addEventListener('ended', () => {
                currentSongIndex = (currentSongIndex + 1) % songs.length;
                playSong();
            });
        }

        playSong();
    }
);
