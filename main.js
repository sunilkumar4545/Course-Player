// Main JS for Course Player
const fileInput = document.getElementById('file-input');
const selectFolderBtn = document.getElementById('select-folder');
const fileExplorer = document.getElementById('file-explorer');
const videoPlayer = document.getElementById('video-player');
const videoTitle = document.getElementById('video-title');
const completedFilesDiv = document.getElementById('completed-files');

const pdfPreviewContainer = document.getElementById('pdf-preview-container');
const pdfPreview = document.getElementById('pdf-preview');
const pdfTitle = document.getElementById('pdf-title');

let fileTree = {};
let selectedFile = null;
let completedFiles = JSON.parse(localStorage.getItem('course-completed-files') || '[]');

function renderFileTree(tree, parent, path = '', level = 0) {
  parent.innerHTML = '';
  Object.keys(tree).forEach(key => {
    const item = tree[key];
    const itemPath = path ? path + '/' + key : key;
    if (item.type === 'folder') {
      // Folder header
      const folderDiv = document.createElement('div');
      folderDiv.className = 'folder';
      folderDiv.innerHTML = `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/></svg> <span>${key}</span>`;
      parent.appendChild(folderDiv);
      // Folder children
      const childrenContainer = document.createElement('div');
      childrenContainer.style.marginLeft = '10px';
      renderFileTree(item.children, childrenContainer, itemPath, level + 1);
      parent.appendChild(childrenContainer);
    } else if (item.type === 'file') {
      const fileDiv = document.createElement('div');
      fileDiv.className = 'file' + (completedFiles.includes(itemPath) ? ' completed' : '') + (selectedFile === itemPath ? ' selected' : '');
      let icon = '';
      if (isVideoFile(key)) {
        icon = `<svg viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="8"/><polygon points="8,6 15,10 8,14" fill="#84cc16"/></svg>`;
      } else if (isPdfFile(key)) {
        icon = `<svg viewBox="0 0 20 20" fill="currentColor"><rect x="3" y="3" width="14" height="14" rx="2" fill="#e11d48"/><text x="10" y="14" text-anchor="middle" font-size="8" fill="#fff">PDF</text></svg>`;
      } else {
        icon = `<svg viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="8"/></svg>`;
      }
      fileDiv.innerHTML = `${icon} <span>${key} (${formatFileSize(item.file.size)})</span>`;
      fileDiv.onclick = () => {
        selectedFile = itemPath;
        if (isVideoFile(key)) {
          showVideoPlayer();
          playVideo(item.file, key);
        } else if (isPdfFile(key)) {
          showPdfPreview();
          previewPdf(item.file, key);
        } else {
          showVideoPlayer();
          videoTitle.textContent = 'Unsupported file type';
          videoPlayer.src = '';
        }
        renderFileTree(fileTree, fileExplorer);
      };
      fileDiv.ondblclick = () => {
        if (!completedFiles.includes(itemPath)) {
          completedFiles.push(itemPath);
          localStorage.setItem('course-completed-files', JSON.stringify(completedFiles));
          renderFileTree(fileTree, fileExplorer);
        }
      };
      parent.appendChild(fileDiv);
    }
  });
}

function playVideo(file, name) {
  try {
    const url = URL.createObjectURL(file);
    videoPlayer.src = url;
    videoTitle.textContent = name;
  } catch (err) {
    videoTitle.textContent = 'Error loading video';
  }
}

function previewPdf(file, name) {
  try {
    const url = URL.createObjectURL(file);
    pdfPreview.src = url;
    pdfTitle.textContent = name;
  } catch (err) {
    pdfTitle.textContent = 'Error loading PDF';
  }
}

function showVideoPlayer() {
  document.getElementById('video-player-container').style.display = '';
  pdfPreviewContainer.style.display = 'none';
}

function showPdfPreview() {
  document.getElementById('video-player-container').style.display = 'none';
  pdfPreviewContainer.style.display = '';
}

selectFolderBtn.onclick = () => {
  fileInput.click();
};

fileInput.onchange = (e) => {
  try {
    fileTree = processFileList(e.target.files);
    renderFileTree(fileTree, fileExplorer);
  } catch (err) {
    fileExplorer.innerHTML = '<div style="color:red;">Error loading files. Please try again.</div>';
  }
};

// Initial render for completed files
completedFilesDiv.textContent = 'Completed files: ' + completedFiles.length;

// Utility for PDF file detection
function isPdfFile(name) {
  return /\.pdf$/i.test(name);
}
