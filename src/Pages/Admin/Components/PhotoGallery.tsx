import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Modal from "@mui/material/Modal";
import { serverURL } from "@/config";
import {
  X,
  Loader2,
  CheckCircle,
  Upload,
  Image,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function PhotoGallery({
  initialSelected,
  open,
  setOpen,
  onConfirm,
}: {
  initialSelected: string[];
  open: boolean;
  setOpen: Function;
  onConfirm: Function;
}) {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImagesModal, setSelectedImagesModal] =
    useState<string[]>(initialSelected);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadErrors, setUploadErrors] = useState<{ [key: string]: string }>(
    {}
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllersRef = useRef<{ [key: string]: AbortController }>({});

  // Use a ref to track previous open state
  const prevOpenRef = useRef<boolean>(false);

  // Memoize handleClose to prevent recreation on each render
  const handleClose = useCallback(() => {
    setOpen(false);
    // Reset selections when modal closes
    setSelectedImagesModal([]);
  }, [setOpen]);

  // Memoize the fetchImages function
  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${serverURL}/api/get-images`);
      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      setImages(result.images);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect to fetch images only when modal transitions from closed to open
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      setSelectedImagesModal(initialSelected);
      fetchImages();
    }
    prevOpenRef.current = open;
  }, [open, fetchImages]);

  // Memoize the image URLs to prevent recalculation on each render
  const imageUrls = useMemo(() => {
    return images.map((img) => `https://cdn.valintelis.site/${img}`);
  }, [images]);

  // Handle image selection
  const handleImageClick = useCallback((url: string) => {
    setSelectedImagesModal((prev) => {
      if (prev.includes(url)) {
        return prev.filter((img) => img !== url);
      } else {
        return [...prev, url];
      }
    });
  }, []);

  // Handle confirm button click
  const handleConfirm = useCallback(() => {
    onConfirm(selectedImagesModal);
    handleClose();
  }, [selectedImagesModal, handleClose]);

  // Check if an image is selected
  const isSelected = useCallback(
    (url: string) => selectedImagesModal.includes(url),
    [selectedImagesModal]
  );

  // File upload handlers
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const filesArray = Array.from(e.target.files);
        setUploadedFiles((prev) => [...prev, ...filesArray]);
      }
    },
    []
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      setUploadedFiles((prev) => [...prev, ...filesArray]);
    }
  }, []);

  const handleRemoveFile = useCallback((fileToRemove: File) => {
    // Cancel ongoing upload if exists
    if (abortControllersRef.current[fileToRemove.name]) {
      abortControllersRef.current[fileToRemove.name].abort();
      delete abortControllersRef.current[fileToRemove.name];
    }

    setUploadedFiles((prev) => prev.filter((file) => file !== fileToRemove));
    setUploadErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fileToRemove.name];
      return newErrors;
    });
  }, []);

  // Upload a single file without progress tracking, sending multipart/form-data
  const uploadFile = useCallback(async (file: File) => {
    const abortController = new AbortController();
    abortControllersRef.current[file.name] = abortController;
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${serverURL}/api/upload-image`, {
        method: "POST",
        body: formData,
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      // Clean up the abort controller
      delete abortControllersRef.current[file.name];
      return true;
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log(`Upload of ${file.name} was cancelled`);
      } else {
        console.error(`Error uploading ${file.name}:`, error);
        setUploadErrors((prev) => ({
          ...prev,
          [file.name]: error.message || "Upload failed",
        }));
      }
      return false;
    }
  }, []);

  const uploadFiles = useCallback(async () => {
    if (uploadedFiles.length === 0) return;

    setIsUploading(true);
    let successCount = 0;

    try {
      const results = await Promise.all(
        uploadedFiles.map((file) => uploadFile(file))
      );
      successCount = results.filter((result) => result).length;
    } finally {
      setIsUploading(false);
      if (successCount === uploadedFiles.length) {
        setUploadedFiles([]);
        fetchImages();
      }
    }
  }, [uploadedFiles, uploadFile, fetchImages]);

  // Cancel all uploads
  const cancelAllUploads = useCallback(() => {
    Object.values(abortControllersRef.current).forEach((controller) => {
      controller.abort();
    });
    abortControllersRef.current = {};
    setIsUploading(false);
  }, []);

  const openFileDialog = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  // Get image preview for file
  const getImagePreview = useCallback((file: File): string => {
    return URL.createObjectURL(file);
  }, []);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      Object.values(abortControllersRef.current).forEach((controller) => {
        controller.abort();
      });
    };
  }, []);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="photo-gallery-modal"
      aria-describedby="select-photos-from-gallery"
    >
      <div className="w-11/12 max-w-6xl h-5/6 bg-white rounded-lg shadow-xl absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-800">Photo Gallery</h2>
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={handleClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-grow flex flex-col md:flex-row gap-4 overflow-hidden pt-4">
          <div className="w-full md:w-2/3 h-full flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-700">Gallery</h3>
              <span className="text-sm text-gray-600">
                {selectedImagesModal.length} image
                {selectedImagesModal.length !== 1 ? "s" : ""} selected
              </span>
            </div>

            <div className="flex-grow overflow-auto pb-2 pr-1">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 size={32} className="animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-600">Loading images...</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {imageUrls.length > 0 ? (
                    imageUrls.map((url, index) => (
                      <div
                        key={index}
                        className="relative group cursor-pointer aspect-square"
                        onClick={() => handleImageClick(url)}
                      >
                        <img
                          draggable="false"
                          src={url}
                          alt={`Gallery image ${index}`}
                          className={`w-full h-full object-cover rounded-md transition-all duration-200 ${
                            isSelected(url)
                              ? "ring-4 ring-blue-500"
                              : "hover:opacity-90"
                          }`}
                        />
                        {isSelected(url) && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle
                              className="text-blue-500 bg-white rounded-full"
                              size={24}
                            />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <Image size={48} className="text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No images found</p>
                      <p className="text-gray-400 mt-2">
                        Upload images using the panel on the right
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Upload Section */}
          <div className="w-full md:w-1/3 flex flex-col border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4">
            <h3 className="font-medium text-gray-700 mb-3">Upload Images</h3>

            {/* Drag & Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg flex items-center justify-center p-4 transition-colors ${
                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileInputChange}
              />

              <div className="text-center">
                <Upload
                  size={36}
                  className={`${
                    isDragging ? "text-blue-500" : "text-gray-400"
                  } mx-auto mb-2`}
                />
                <p className="text-sm text-gray-600 mb-2">
                  Drag & Drop Images Here
                </p>
                <button
                  onClick={openFileDialog}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  Browse Files
                </button>
              </div>
            </div>

            {/* Upload List */}
            <div className="mt-4 flex-grow overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-700">
                  {uploadedFiles.length > 0
                    ? `${uploadedFiles.length} file${
                        uploadedFiles.length !== 1 ? "s" : ""
                      } selected`
                    : "No files selected"}
                </h4>
                {uploadedFiles.length > 0 && (
                  <button
                    onClick={
                      isUploading
                        ? cancelAllUploads
                        : () => setUploadedFiles([])
                    }
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    {isUploading ? "Cancel All" : "Clear All"}
                  </button>
                )}
              </div>

              <div className="flex-grow overflow-auto pr-1">
                {uploadedFiles.length > 0 ? (
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex bg-gray-50 rounded-lg p-2 items-center"
                      >
                        <div className="h-10 w-10 flex-shrink-0 mr-2">
                          <img
                            src={getImagePreview(file)}
                            alt={`Preview of ${file.name}`}
                            className="h-full w-full object-cover rounded"
                          />
                        </div>

                        <div className="flex-grow min-w-0">
                          <p className="text-xs font-medium text-gray-800 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>

                          {uploadErrors[file.name] && (
                            <p className="text-xs text-red-600 flex items-center mt-1">
                              <AlertCircle size={10} className="mr-1" />{" "}
                              {uploadErrors[file.name]}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => handleRemoveFile(file)}
                          className="ml-1 text-gray-500 hover:text-red-600 p-1"
                          disabled={isUploading && !uploadErrors[file.name]}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-sm text-gray-400 text-center">
                      Selected files will appear here
                    </p>
                  </div>
                )}
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-3">
                  <button
                    onClick={uploadFiles}
                    disabled={isUploading || uploadedFiles.length === 0}
                    className={`w-full py-2 rounded-md text-white transition-colors flex items-center justify-center ${
                      isUploading || uploadedFiles.length === 0
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isUploading && (
                      <Loader2 size={16} className="animate-spin mr-2" />
                    )}
                    {isUploading ? "Uploading..." : "Upload All"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with action buttons */}
        <div className="border-t pt-4 flex justify-between items-center mt-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedImagesModal.length === 0}
            className={`px-4 py-2 rounded-md text-white transition-colors ${
              selectedImagesModal.length > 0
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            {selectedImagesModal.length > 0 ? (
              <>
                Use Selected <ArrowRight size={16} className="inline ml-1" />
              </>
            ) : (
              "Select Images"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
