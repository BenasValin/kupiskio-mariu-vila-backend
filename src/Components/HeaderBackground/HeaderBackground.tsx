import { ReactElement } from "react";
import "./HeaderBackground.css";

export default function HeaderBackground({
  image,
  children,
}: {
  image: string;
  children: ReactElement;
}) {
  const divStyle = {
    backgroundImage: `linear-gradient(rgba(19, 28, 21, 0.4), rgba(19, 28, 21, 0.4)), url(${image})`,
    backgroundSize: "cover", // Ensure the image covers the entire div
    backgroundPosition: "center", // Center the background image
    height: "50vh", // Adjust the height as needed
    width: "100%", // Full width
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div className="headerBackground" style={divStyle}>
      {children}
    </div>
  );
}
