const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load the asset manifest
const assetManifest = require('../build/asset-manifest.json');

// Helper function to filter and map file paths
// function getFilePaths(extension) {
//   return assetManifest.entrypoints
//     .filter((filePath) => filePath.endsWith(extension))
//     .map((filePath) => path.join(__dirname, '../build', filePath));
// }

function getFilePathsFromFiles(extension) {
  return Object.keys(assetManifest.files)
    .filter((filePath) => filePath.endsWith(extension))
    .map((filePath) => path.join(__dirname, '../build', assetManifest.files[filePath]));
}

// Filter and map files
const jsFiles = getFilePathsFromFiles('.js');
const cssFiles = getFilePathsFromFiles('.css');
// const svgFiles = []
// const pngFiles = []
// const icoFiles = []

console.log('JavaScript files to be concatenated:', jsFiles);
console.log('CSS files to be concatenated:', cssFiles);
// console.log('SVG files to be concatenated:', svgFiles);
// console.log('PNG files to be concatenated:', pngFiles);
// console.log('ICO files to be concatenated:', icoFiles);

// Function to check if files exist
function checkFilesExist(files) {
  files.forEach((filePath) => {
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      process.exit(1); // Exit if any file is missing
    }
  });
}

// Check if all files exist
checkFilesExist(jsFiles);
checkFilesExist(cssFiles);
// checkFilesExist(svgFiles);
// checkFilesExist(pngFiles);
// checkFilesExist(icoFiles);

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Function to concatenate files
function concatenateFiles(files, outputFile, fileType) {
  const command = `awk 1 ${files.join(' ')} > ${outputFile}`;
  console.log(`Executing command for ${fileType} files:`, command);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Shell error: ${stderr}`);
      return;
    }
    console.log(`Concatenation successful! Output written to ${outputFile}`);
  });
}

if (jsFiles.length > 0) {
  if (!fs.existsSync(distDir + '/js/')) {
    fs.mkdirSync(distDir + '/js/');
  }
  // Concatenate JavaScript files
  const jsOutputFile = path.join(distDir, 'js/main.js');
  concatenateFiles(jsFiles, jsOutputFile, 'JavaScript');
}

if (cssFiles.length > 0) {
  if (!fs.existsSync(distDir + '/css/')) {
    fs.mkdirSync(distDir + '/css/');
  }
  // Concatenate CSS files
  const cssOutputFile = path.join(distDir, 'css/main.css');
  concatenateFiles(cssFiles, cssOutputFile, 'CSS');
}

// if (svgFiles.length > 0) {
//   // Concatenate SVG files
//   const svgOutputFile = path.join(distDir, 'images.min.svg');
//   concatenateFiles(svgFiles, svgOutputFile, 'SVG');
// }

// if (pngFiles.length > 0) {
//   // Concatenate PNG files
//   const pngOutputFile = path.join(distDir, 'images.min.png');
//   concatenateFiles(pngFiles, pngOutputFile, 'PNG');
// }

// if (icoFiles.length > 0) {
//   // Concatenate ICO files
//   const icoOutputFile = path.join(distDir, 'images.min.ico');
//   concatenateFiles(icoFiles, icoOutputFile, 'ICO');
// }
