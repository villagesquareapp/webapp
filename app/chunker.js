const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB per chunk
const API_URL = 'http://127.0.0.1:3005/v2/posts/upload'; // Base URL for the upload process
const MAX_PARALLEL_UPLOADS = 5; // Number of chunks to upload in parallel
uploadedFiles = [];

document.getElementById('uploadBtn').addEventListener('click', async () => {
  const fileInput = document.getElementById('fileInput');
  if (!fileInput.files.length) {
    alert('Please select files to upload.');
    return;
  }

  const files = Array.from(fileInput.files);

  document.getElementById('progress').textContent = `Uploading...`;

  try {
    // Process each file
    await Promise.all(
      files.map(async (file) => {
        const uploadedParts = [];
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        let uploadedChunks = 0;
        let uploadId = null;

        // Step 1: Start multipart upload
        try {
          const startUploadResponse = (await startMultipartUpload(file)).data;
          uploadId = startUploadResponse.UploadId;
        } catch (error) {
          console.error(`Error starting upload for file ${file.name}:`, error);
          throw new Error(`Failed to start upload for ${file.name}.`);
        }

        // Step 2: Upload chunks in parallel with limited concurrency
        const uploadChunks = async (start, end, chunkIndex) => {
          const chunk = file.slice(start, end);
          const checksum = await computeChecksum(chunk);

          const formData = new FormData();
          formData.append('file', chunk);
          formData.append('filename', file.name);
          formData.append('total_size', file.size);
          formData.append('offset', start);
          formData.append('checksum', checksum);
          formData.append('upload_id', uploadId);
          formData.append('part_number', chunkIndex + 1);

          try {
            const { eTag, partNumber } = (await uploadChunk(formData)).data;
            uploadedParts.push({ partNumber: partNumber, eTag: eTag });
            uploadedChunks++;
            updateProgress(file.name, uploadedChunks, totalChunks);
          } catch (error) {
            console.error(`Error uploading chunk ${chunkIndex + 1} for file ${file.name}:`, error);
            throw new Error(`Failed to upload chunk ${chunkIndex + 1} for ${file.name}.`);
          }
        };

        const uploadPromises = [];
        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
          const start = chunkIndex * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, file.size);

          uploadPromises.push(() => uploadChunks(start, end, chunkIndex));

          // Limit parallel uploads
          if (uploadPromises.length >= MAX_PARALLEL_UPLOADS) {
            await Promise.all(uploadPromises.map((fn) => fn()));
            uploadPromises.length = 0; // Reset for next batch
          }
        }

        // Complete remaining uploads
        if (uploadPromises.length > 0) {
          await Promise.all(uploadPromises.map((fn) => fn()));
        }

        // Step 3: Complete the multipart upload
        try {
          const completeUploadResponse = (await completeMultipartUpload(uploadId, file, uploadedParts)).data;
          uploadedFiles.push({key: completeUploadResponse.Key, mime_type: file.type})
          console.log(`Upload completed successfully for file ${file.name}`);
        } catch (error) {
          console.error(`Error completing upload for file ${file.name}:`, error);
          throw new Error(`Failed to complete upload for ${file.name}.`);
        }
      })
    );

    console.log(`Uploaded Files: ${uploadedFiles}`)
    document.getElementById('progress').textContent = 'All uploads complete!';
  } catch (error) {
    console.error('Error during file uploads:', error);
    alert('File uploads failed. Check the console for details.');
  }
});

/**
 * Starts the multipart upload and returns the uploadId.
 */
async function startMultipartUpload(file) {
  const response = await fetch(`${API_URL}/start`, {
    method: 'POST',
    body: JSON.stringify({ filename: file.name, mime_type: file.type, total_size: file.size }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Server error: ${error.message}`);
  }

  return response.json();
}

/**
 * Uploads a single chunk to the backend.
 */
async function uploadChunk(formData) {
  const response = await fetch(`${API_URL}/chunk`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Server error: ${error.message}`);
  }

  return response.json();
}

/**
 * Completes the multipart upload by finalizing the file on the server.
 */
async function completeMultipartUpload(uploadId, file, uploadedParts) {
  const response = await fetch(`${API_URL}/complete`, {
    method: 'POST',
    body: JSON.stringify({
      upload_id: uploadId,
      filename: file.name,
      parts: uploadedParts,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Server error: ${error.message}`);
  }

  return response.json();
}

/**
 * Computes the MD5 checksum of a file chunk.
 */
function computeChecksum(chunk) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const wordArray = CryptoJS.lib.WordArray.create(reader.result);
      const checksum = CryptoJS.MD5(wordArray).toString();
      resolve(checksum);
    };

    reader.onerror = () => {
      reject(new Error('Failed to compute checksum.'));
    };

    reader.readAsArrayBuffer(chunk);
  });
}

/**
 * Updates the progress bar based on uploaded chunks.
 */
function updateProgress(fileName, uploadedChunks, totalChunks) {
  const progress = Math.round((uploadedChunks / totalChunks) * 100);
  document.getElementById('progress').textContent = `Uploading ${fileName}... ${progress}%`;
}