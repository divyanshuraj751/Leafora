/** Convert a Blob/File to an object URL preview. Caller should revoke when done. */
export const toPreview = (file: Blob): string => URL.createObjectURL(file);

/** Convert a dataURL (e.g. from canvas.toDataURL) into a File. */
export const dataUrlToFile = (dataUrl: string, filename: string): File => {
  const [header, b64] = dataUrl.split(",");
  const mime = header.match(/data:(.*?);/)?.[1] ?? "image/png";
  const binary = atob(b64);
  const arr = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
  return new File([arr], filename, { type: mime });
};

/** Convert a File to a base64 dataURL (for persistent localStorage previews). */
export const fileToDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

/** Validate image file (type + size). */
export const isValidImage = (file: File, maxMB = 10): boolean =>
  file.type.startsWith("image/") && file.size <= maxMB * 1024 * 1024;
