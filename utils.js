// Utility to process file list from input
function processFileList(fileList) {
  const files = Array.from(fileList);
  const fileTree = {};
  files.forEach(file => {
    const pathParts = file.webkitRelativePath.split('/');
    let currentLevel = fileTree;
    for (let i = 0; i < pathParts.length - 1; i++) {
      const folderName = pathParts[i];
      if (!currentLevel[folderName]) {
        currentLevel[folderName] = { type: 'folder', name: folderName, children: {} };
      }
      currentLevel = currentLevel[folderName].children;
    }
    const fileName = pathParts[pathParts.length - 1];
    currentLevel[fileName] = { type: 'file', name: fileName, file };
  });
  return fileTree;
}
function formatFileSize(size) {
  if (size < 1024) return size + ' B';
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
  return (size / (1024 * 1024)).toFixed(1) + ' MB';
}
function isVideoFile(name) {
  return /\.(mp4|webm|ogg|mov)$/i.test(name);
}
function isImageFile(name) {
  return /\.(jpg|jpeg|png|gif|bmp)$/i.test(name);
}
