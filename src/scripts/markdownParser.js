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
                imgSrc = url;
            } else if (url.startsWith('/')) {
                imgSrc = url;
            } else {
                const assetsIndex = url.indexOf('assets/');
                if (assetsIndex !== -1) {
                    imgSrc = '/' + url.substring(assetsIndex);
                } else {
                    imgSrc = `/assets/images/${url}`;
                }
            }
            html += `<div class="image-container">`;
            html += `<img src="${imgSrc}" alt="${alt}"><br />`;
            html += "<hr />"
            html += `</div>`;
        } else if (line.startsWith('---')) {
            const date = line.substring(3).trim();
            html = html.replace('<hr />', `<p>${date}</p><hr />`);
        } else if (line.trim() !== '') {
            html += `<p>${line}</p>`;
        }
    }
    return html;
}
