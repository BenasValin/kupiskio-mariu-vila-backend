import React, { useState } from "react";
import "./photoGallery.css";
import arrow from "../../Images/icons/white/arrow.png";
import FsLightBox from "fslightbox-react";

interface PhotoGalleryProps {
  images: (string | React.ReactElement)[];
  height?: number;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ images, height }) => {
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [toggler, setToggler] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const initialImageIndex = images.findIndex((image) => {
    if (typeof image === "string") {
      const fileNameWithExtension = image.split("/").pop() || "";
      return fileNameWithExtension.startsWith("1-");
    }
    return false;
  });

  if (initialImageIndex > 0) {
    const [initialImage] = images.splice(initialImageIndex, 1);
    images.unshift(initialImage);
  }

  const handleNextClick = (): void => {
    setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevClick = (): void => {
    setImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const extractFileName = (url: string | React.ReactElement): string => {
    if (!url || typeof url !== "string") return "";
    const fileNameWithExtension = url.split("/").pop() || "";
    let fileName = fileNameWithExtension.split(".").slice(0, -1).join(".");
    // Remove the "1-" prefix if it exists
    fileName = fileName.replace(/^1-/, "");
    // Remove the hash part, assuming it follows a predictable pattern like a dot followed by a hash
    const cleanFileName = fileName.replace(/\.[0-9a-f]{10,}$/i, "");
    return cleanFileName;
  };

  const openLightboxOnIndex = (index: number): void => {
    setCurrentIndex(index);
    setToggler(!toggler);
  };

  return (
    <>
      <div className="photoGalleryContainer" style={{ width: height }}>
        {images[imageIndex] && typeof images[imageIndex] === "string" ? (
          <img
            onClick={() => openLightboxOnIndex(imageIndex)}
            className="photoGalleryImage"
            src={images[imageIndex] as string}
            loading="lazy"
            alt="Gallery image"
          />
        ) : images[imageIndex] ? (
          <div onClick={() => openLightboxOnIndex(imageIndex)}>
            {images[imageIndex]}
          </div>
        ) : null}

        <div className="photoGalleryNav">
          <button className="button" onClick={handlePrevClick}>
            <img className="photoGalleryArrowLeft" src={arrow} alt="Previous" />
          </button>
          <a className="photoGalleryImageName">
            {extractFileName(images[imageIndex])}
          </a>
          <button className="button" onClick={handleNextClick}>
            <img className="photoGalleryArrowRight" src={arrow} alt="Next" />
          </button>
        </div>
      </div>
      <FsLightBox toggler={toggler} sources={images} slide={currentIndex + 1} />
    </>
  );
};

export default PhotoGallery;
