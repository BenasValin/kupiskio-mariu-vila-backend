import "./Footer.css";
import phoneIcon from "../../Images/icons/white/phone.png";
import emailIcon from "../../Images/icons/white/email.png";
import { Link } from "react-router-dom";
import facebookIcon from "../../Images/icons/white/facebook.png";
import instagramIcon from "../../Images/icons/white/instagram.png";

function Footer() {
  return (
    <div className="mainFooterContainer">
      <div className="footerWrapper">
        <div className="footerContainer">
          <div className="footerContactsContainer">
            <p style={{ fontSize: "2em", margin: 0 }}>Mūsų kontaktai</p>
            <div className="footerContacts">
              <img
                style={{ height: "1.2em", marginRight: "15px" }}
                src={phoneIcon}
                alt="phone"
              />
              <a style={{ marginRight: "15px" }}> +370 640 55444</a>
              <img
                style={{ marginRight: "15px" }}
                src={emailIcon}
                alt="email"
              />
              <a style={{ marginRight: "15px" }}> bociupis@gmail.com </a>
            </div>
            <div className="adressAndCompanyInfo">
              <div className="footerAdress">
                <p style={{ margin: "0 0 0.5rem", fontWeight: "550" }}>
                  Adresas:
                </p>
                <a>Vėžionių g. 51</a>
                <a>Aukštupėnai</a>
                <a>40104</a>
                <a>Kupiškio r. sav.</a>
              </div>
              <div className="footerRekvizitai">
                <p style={{ margin: "0 0 0.5rem", fontWeight: "550" }}>
                  Rekvizitai:
                </p>
                <a>UAB „Bočiupis“</a>
                <a>Šimtmečio g. 1-1, Kupiškis</a>
                <a>Įmonės kodas: 164767965</a>
                <a>PVM: LT647679610</a>
              </div>
            </div>

            <div className="socialMedia">
              <a href="https://www.facebook.com/MariuVila/?locale=lt_LT">
                <img src={facebookIcon} alt="facebook" />
              </a>
              <a href="https://www.instagram.com/explore/locations/262292254/kupiskio-mariu-vila/">
                <img src={instagramIcon} alt="instagram" />
              </a>
            </div>
            <Link to="/taisykles">
              <a>Taisyklės ir sąlygos</a>
            </Link>
            <br></br>
            <Link to="/duk">
              <a>DUK</a>
            </Link>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2239.253378115197!2d24.979793877110975!3d55.85827018386244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46e870daaaaaaaab%3A0xb887bea4b4fccea0!2zS3VwacWha2lvIG1hcmnFsyB2aWxh!5e0!3m2!1slt!2slt!4v1714936133704!5m2!1slt!2slt"
            height="100%"
            style={{ borderRadius: "1rem" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Footer;
