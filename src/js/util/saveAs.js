async function saveAsNew(contents, filename) {

    const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [
            {description: "Image file", accept: {"image/*": [".png", ".jpg", ".jpeg", ".webp"]}}
        ]
    });

    const writable = await handle.createWritable();
    await writable.write(contents);
    await writable.close();
}

function saveAsLegacy(contents, filename) {

    const anchorElement = document.createElement("a");

    const urlObject = window.URL.createObjectURL(contents);

    anchorElement.href = urlObject;
    anchorElement.setAttribute('download', filename);
    anchorElement.click();

    anchorElement.remove();
    window.URL.revokeObjectURL(urlObject);
}

function mimeTypeToFilename(blobMimeType) {

    // expects something like: image/jpeg
    const parts = (blobMimeType || "").split("/");

    if (parts.length > 1) {
        const ext = parts[1];
        return `image.${ext}`;
    }

    return null;
}

const hasFSAccess = ('showOpenFilePicker' in window);
const isMac = navigator.userAgent.includes('Mac OS X');

export const saveAs = async (imageUrl, filename = null) => {

    const response = await fetch(imageUrl, {mode: "cors"});
    const blob = await response.blob();

    if (filename === null) {
        filename = mimeTypeToFilename(blob.type);
    }

    if (hasFSAccess) {

        try {
            await saveAsNew(blob, filename);
        } catch (ex) {

            console.error(ex);

            if (ex.name === 'AbortError') {
                // ignore
            } else {
                throw ex;
            }
        }

    } else {
        saveAsLegacy(blob, filename);
    }
}