import { contentPath } from './utils.js';

export function parseMarkdown(markdown) {
    const lines = markdown.split('\n');
    let html = '';
    for (const line of lines) {
        if (line.startsWith('# ')) {
            html += `<h2>${line.substring(2)}</h2>`;
        } else if (line.match(/^!\[.*\]\(.*\)$/)) {
            const alt = line.match(/\[(.*)\]/)[1];
            const url = line.match(/\((.*)\)/)[1];
            let imgSrc;
            if (url.startsWith('http')) {
                //may need to change this to pull images dynamically later from the bucket
                imgSrc = url;
            } else {
                imgSrc = `./assets/images/${url}`;
            }
            html += `<div class="image-container">`;
            html += `<img src="${imgSrc}" alt="${alt}"><br />`;
            html += "<hr />"
            html += `</div>`;
        } else if (line.startsWith('---')) {
            html += `<small class="post-footer" style="font-size: 0.1em;">${line.substring(3).trim()}</small>`;
        } else if (line.trim() !== '') {
            html += `<p>${line}</p>`;
        }
    }
    return html;
}
