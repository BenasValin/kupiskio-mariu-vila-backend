import pagrindinis from "@/Images/decorationImages/pagrinidispastatas.jpg";
import { Link } from "react-router-dom";
import { pagrindinisPastatasPirmasAukstasImages } from "@/Images/GalleryImages/HouseImages";
import HeaderBackground from "@/Components/HeaderBackground/HeaderBackground";
import "./Error.css";
export default function Error() {
  return (
    <>
      <HeaderBackground image={pagrindinis}>
        <h1 className="headerTitle">Pristabdom arklius!</h1>
      </HeaderBackground>
      <div className="errorContainer bodySpacer">
        <div>
          <h2 className="fontSize4">Puslapis nerastas 404</h2>

          <p className="paragraph fontSize1">
            Jei ieškote Kupiškio marių vilos, pabandykite ieškoti čia:
          </p>
        </div>

        <div className="errorLinks">
          <Link to="/">Pagrindinis</Link>
          <Link to="/sventes">Šventės</Link>
          <Link to="/poilsis">Poilsis</Link>
          <Link to="/rezervacija">Rezervuoti</Link>
          <Link to="/apylinkes">Apylinkės</Link>
          <Link to="/galerija">Galerija</Link>
          <Link to="/duk">DUK</Link>
          <Link to="/kontaktai">Kontaktai</Link>
        </div>
      </div>
      <div className="errorGallery bodySpacer">
        {pagrindinisPastatasPirmasAukstasImages.map((image) => {
          return <img src={image} className="errorGalleryImage" />;
        })}
      </div>
    </>
  );
}
