import "./Galerija.css";
import pagrindinis from "@/Images/decorationImages/pastatas.jpg";
import {
  zvejuNamelisImages,
  pagrindinisPastatasImages,
  pirtiesPastatasImages,
  vilosAplinkaImages,
  mariuAplinkaImages,
} from "@/Images/GalleryImages/HouseImages";
import React, { useState, useMemo, useCallback } from "react";
import FsLightbox from "fslightbox-react";
import HeaderBackground from "@/Components/HeaderBackground/HeaderBackground";
import arrow from "@/Images/icons/white/arrow.png";

// Custom memoized image component for better re-rendering performance
const GalleryImage = React.memo(
  ({
    photo,
    index,
    onClick,
  }: {
    photo: string;
    index: number;
    onClick: Function;
  }) => (
    <img
      loading="lazy" // Lazy loading images for better performance
      src={photo}
      alt={`Photo ${index + 1}`}
      className="galleryPhoto"
      onClick={() => onClick(index)}
    />
  )
);

function Galerija() {
  const [activeButton, setActiveButton] = useState("visosNuotraukos");

  const [toggler, setToggler] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Adds a smooth scrolling effect
    });
  };
  // Memoized all images array for efficient concatenation
  const allPhotos = useMemo(
    () =>
      pagrindinisPastatasImages.concat(
        zvejuNamelisImages,
        pirtiesPastatasImages,
        vilosAplinkaImages,
        mariuAplinkaImages
      ),
    [
      pagrindinisPastatasImages,
      zvejuNamelisImages,
      pirtiesPastatasImages,
      vilosAplinkaImages,
      mariuAplinkaImages,
    ]
  );
  const [photos, setPhotos] = useState(allPhotos);
  // Handlers to filter photos based on selected category
  const handleVisosNuotraukos = useCallback(() => {
    setPhotos(allPhotos);
    setActiveButton("visosNuotraukos");
  }, [allPhotos]);

  const handlePagrindinisPastatas = useCallback(() => {
    setPhotos(pagrindinisPastatasImages);
    setActiveButton("pagrindinisPastatas");
  }, []);

  const handleZvejuNamelis = useCallback(() => {
    setPhotos(zvejuNamelisImages);
    setActiveButton("zvejuNamelis");
  }, []);

  const handlePirtiesPastatas = useCallback(() => {
    setPhotos(pirtiesPastatasImages);
    setActiveButton("pirtiesPastatas");
  }, []);

  const handleVilosAplinka = useCallback(() => {
    setPhotos(vilosAplinkaImages);
    setActiveButton("vilosAplinka");
  }, []);

  const handlemMariuAplinka = useCallback(() => {
    setPhotos(mariuAplinkaImages);
    setActiveButton("mariuAplinka");
  }, []);

  // Open lightbox on specific index
  const openLightboxOnIndex = (index: number) => {
    setCurrentIndex(index);
    setToggler(!toggler);
  };

  return (
    <div>
      <HeaderBackground image={pagrindinis}>
        <h1 className="headerTitle">Galerija</h1>
      </HeaderBackground>

      <div className="mainGalleryContainer">
        <div className="galleryNav selfAlignCenter">
          <button
            onClick={handleVisosNuotraukos}
            style={
              activeButton === "visosNuotraukos"
                ? { backgroundColor: "var(--green)" }
                : { color: "var(--grey)" }
            }
            className="button galleryButton"
          >
            Visos nuotraukos
          </button>
          <button
            onClick={handlePagrindinisPastatas}
            style={
              activeButton === "pagrindinisPastatas"
                ? { backgroundColor: "var(--green)" }
                : { color: "var(--grey)" }
            }
            className="button galleryButton"
          >
            Pagrindinis pastatas
          </button>
          <button
            onClick={handlePirtiesPastatas}
            style={
              activeButton === "pirtiesPastatas"
                ? { backgroundColor: "var(--green)" }
                : { color: "var(--grey)" }
            }
            className="button galleryButton"
          >
            Pirties pastatas
          </button>
          <button
            onClick={handleZvejuNamelis}
            style={
              activeButton === "zvejuNamelis"
                ? { backgroundColor: "var(--green)" }
                : { color: "var(--grey)" }
            }
            className="button galleryButton"
          >
            Žvejų namelis
          </button>
          <button
            onClick={handleVilosAplinka}
            style={
              activeButton === "vilosAplinka"
                ? { backgroundColor: "var(--green)" }
                : { color: "var(--grey)" }
            }
            className="button galleryButton"
          >
            Vilos Aplinka
          </button>
          <button
            onClick={handlemMariuAplinka}
            style={
              activeButton === "mariuAplinka"
                ? { backgroundColor: "var(--green)" }
                : { color: "var(--grey)" }
            }
            className="button galleryButton"
          >
            Marių aplinka
          </button>
        </div>
        <div className="photoGridContainer">
          <div className="photoGrid">
            {photos.map((photo, index) => (
              <GalleryImage
                key={index}
                photo={photo}
                index={index}
                onClick={openLightboxOnIndex}
              />
            ))}
          </div>
        </div>
      </div>
      <FsLightbox toggler={toggler} sources={photos} slide={currentIndex + 1} />
      <button onClick={scrollToTop} className="galerijaScrollButton button">
        <img src={arrow} className="galerijaScrollButtonImage icon" />
      </button>
    </div>
  );
}

export default Galerija;
