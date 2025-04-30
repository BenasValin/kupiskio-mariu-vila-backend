import "./MediaWithText.css";
import { Link } from "react-router-dom";
import PhotoGallery from "../PhotoGallery/photoGallery";
import AnimatedContainer from "../AnimatedContainer/AnimatedContainer";
export default function MediaWithText({
  images,
  title,
  text,
  url,
  reverseDirection,
  lightText,
  buttonText = "",
}: {
  images: string[];
  title: string;
  text: string;
  url: string;
  reverseDirection?: boolean;
  lightText?: boolean;
  buttonText?: string;
}) {
  let styles = {
    color: lightText ? "" : "var(--grey)",
  };
  return (
    <AnimatedContainer>
      <div
        className={`mediaLayout ${reverseDirection ? `reverseDirection` : ""}`}
      >
        <div className="media">
          <PhotoGallery images={images}></PhotoGallery>
        </div>
        <div className="mediaText">
          <h2 className="fontSize4" style={styles}>
            {title}
          </h2>
          <p className="paragraph" style={styles}>
            {text}
          </p>
          <Link to={url}>
            <button className="button noMargin">
              {buttonText ? buttonText : "Daugiau"}
            </button>
          </Link>
        </div>
      </div>
    </AnimatedContainer>
  );
}
