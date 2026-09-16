export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export function compressImage(file, maxWidth = 1000, quality = 0.6) {
    return new Promise((resolve) => {
        if (!file.type.startsWith('image/')) {
            return resolve(file); // Only compress images
        }
        const img = new Image();
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        const compressedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    } else {
                        resolve(file);
                    }
                }, file.type, quality);
            };
            img.onerror = () => resolve(file);
        };
        reader.onerror = () => resolve(file);
    });
}

/**
 * Resilient media upload handler simulating Firebase Storage with timeout.
 * Races Firebase Storage simulation against a 1.5-second timeout.
 * Falls back to image compression and Base64 encoding.
 */
export async function resilientMediaUpload(file, simulateTimeout = false) {
    const TIMEOUT_MS = 1500;
    
    // Simulate upload to Firebase Storage
    const firebaseUpload = new Promise((resolve) => {
        const delay = simulateTimeout ? 3000 : 700; // takes 3s if timeout is forced, 700ms otherwise
        setTimeout(() => {
            const simulatedUrl = `https://firebasestorage.googleapis.com/v0/b/sinaubareng-acad.appspot.com/o/${Date.now()}_${file.name}`;
            resolve({
                storageType: 'storage',
                filePath: simulatedUrl,
                fileBase64: null,
            });
        }, delay);
    });

    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error('Firebase Storage timeout (1.5s)'));
        }, TIMEOUT_MS);
    });

    try {
        const result = await Promise.race([firebaseUpload, timeoutPromise]);
        return {
            ...result,
            isFallback: false,
            mimeType: file.type,
            name: file.name,
        };
    } catch (err) {
        console.warn('Firebase upload timed out or failed. Falling back to compressed base64.', err.message);
        
        let fileToEncode = file;
        let wasCompressed = false;
        
        if (file.type.startsWith('image/')) {
            try {
                fileToEncode = await compressImage(file, 800, 0.5);
                wasCompressed = true;
            } catch (compressErr) {
                console.error('Image compression failed', compressErr);
            }
        }
        
        const base64Data = await fileToBase64(fileToEncode);
        return {
            storageType: 'base64',
            filePath: null,
            fileBase64: base64Data,
            isFallback: true,
            wasCompressed,
            mimeType: file.type,
            name: file.name,
        };
    }
}
