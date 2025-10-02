async function loadPosters() {
  const repo = 'dgcamblor/posterhub';
  const response = await fetch(`https://api.github.com/repos/${repo}/contents/`);
  const files = await response.json();

  const gallery = document.getElementById('gallery');
  files
    .filter(f => f.name.endsWith('.pdf'))
    .forEach(async file => {
      const match = file.name.match(/^(\d{4})-\d{2}_(.+)\.pdf$/);  // Extract year and congress from file name like "2024-06_EACR.pdf"
      let displayName = file.name.replace('.pdf', '');
      if (match) {
        const year = match[1];
        const congress = match[2];
        displayName = `${congress} ${year}`;
      }

      const poster = document.createElement('div');
      poster.className = 'poster';

      // Try to load PNG thumbnail with same base name
      const baseName = file.name.replace('.pdf', '');
      const pngUrl = `https://raw.githubusercontent.com/dgcamblor/posterhub/main/thumbnails/${baseName}.png`;
      const thumbLink = document.createElement('a');
      thumbLink.href = file.download_url;
      thumbLink.target = '_blank';
      const thumb = document.createElement('img');
      thumb.alt = displayName + ' thumbnail';
      thumb.className = 'poster-thumbnail';
      thumbLink.appendChild(thumb);

      // Check if PNG exists by attempting to fetch it
      fetch(pngUrl, { method: 'HEAD' })
        .then(imgResp => {
          if (imgResp.ok) {
            thumb.src = pngUrl;
            poster.appendChild(thumbLink);
          }
        });

      // Congress title (not clickable)
      const titleDiv = document.createElement('div');
      titleDiv.textContent = displayName;
      titleDiv.className = 'poster-title-link';
      poster.appendChild(titleDiv);
      gallery.appendChild(poster);
    });
}

document.addEventListener('DOMContentLoaded', loadPosters);