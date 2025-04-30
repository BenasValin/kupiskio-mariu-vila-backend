import "./Card.css";
import AnimatedContainer from "../AnimatedContainer/AnimatedContainer";
import arrow from "../../Images/icons/white/arrow.png";
import { Link } from "react-router-dom";
export default function Card({
  image,
  title,
  text,
  url,
  darkTheme = true,
  delay = 0,
}: {
  image: string;
  title?: string;
  text?: string;
  url?: string;
  darkTheme?: boolean;
  delay?: number;
}) {
  const styles = {
    color: darkTheme ? "" : "var(--grey)",
    backgroundColor: darkTheme ? "var(--darkBlue)" : "var(--lighterSand)",
  };
  return (
    <AnimatedContainer delay={delay}>
      <div className="card" style={styles}>
        <img className="cardImage" src={image} />
        <div className="cardTitleContainer">
          <h2 className="cardTitle" style={styles}>
            {title}
          </h2>
          {url && (
            <Link to={url}>
              <img src={arrow} className="icon cardArrow" />
            </Link>
          )}
        </div>
        <div className="cardTextContainer">
          <p className="cardText paragraph" style={styles}>
            {text}
          </p>
        </div>
      </div>
    </AnimatedContainer>
  );
}
