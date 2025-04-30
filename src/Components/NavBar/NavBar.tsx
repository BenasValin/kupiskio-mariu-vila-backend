import "./NavBar.css";
import phoneIcon from "../../Images/icons/white/phone.png";
import hamburgerIcon from "../../Images/icons/white/hamburger.png";
import crossIcon from "../../Images/icons/white/cross.png";
import mailIcon from "../../Images/icons/white/email.png";
import logo from "../../Images/Logo.png";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

function NavBar() {
  const [show, setShow] = useState<boolean>(false);
  const [currentScroll, setCurrentScroll] = useState<number>(0);
  const hamburgerCheckboxRef = useRef<HTMLInputElement>(null);

  const controlNavbar = () => {
    const scrollY = window.scrollY;
    if (scrollY > 250 && scrollY > currentScroll) {
      setShow(true);
    } else {
      setShow(false);
    }
    setCurrentScroll(scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [currentScroll]);

  const navStyles = {
    backgroundColor: currentScroll < 50 ? "transparent" : "var(--darkBlue)",
    top: show ? "-100%" : "0",
  };

  const closeMobileNav = () => {
    if (hamburgerCheckboxRef.current) {
      hamburgerCheckboxRef.current.checked = false;
    }
  };

  return (
    <>
      <div style={navStyles} className="navContainer">
        <div className="navLayout">
          <Link to="/">
            <img src={logo} className="navLogoImg" alt="Logo" />
          </Link>

          {/* Desktop Navigation */}
          <div className="navLayout2 desktop">
            <Link to="/sventes">
              <button className="navButton">Šventės</button>
            </Link>
            <Link to="/poilsis">
              <button className="navButton">Poilsis</button>
            </Link>
            <Link to="/apylinkes">
              <button className="navButton">Apylinkės</button>
            </Link>
            <Link to="/galerija">
              <button className="navButton">Galerija</button>
            </Link>
            <Link to="/kontaktai">
              <button className="navButton">Kontaktai</button>
            </Link>
            <Link to="/duk">
              <button className="navButton">DUK</button>
            </Link>
          </div>

          <Link to="/rezervacija">
            <button className="button rezervuotiButton desktop">
              Rezervuoti
            </button>
          </Link>

          {/* Mobile Navigation */}
          <label htmlFor="hamburgerToggle" className="mobile hamburgerIcon">
            <img src={hamburgerIcon} className="icon" alt="Hamburger Menu" />
          </label>

          <input
            type="checkbox"
            className="hamburger"
            id="hamburgerToggle"
            ref={hamburgerCheckboxRef}
          />

          <div className="mobile mobileNav">
            <label htmlFor="hamburgerToggle" className="cross">
              <img src={crossIcon} className="icon" alt="Close Menu" />
            </label>
            <Link to="/sventes" onClick={closeMobileNav}>
              <button className="navButton">Šventės</button>
            </Link>
            <Link to="/poilsis" onClick={closeMobileNav}>
              <button className="navButton">Poilsis</button>
            </Link>
            <Link to="/apylinkes" onClick={closeMobileNav}>
              <button className="navButton">Apylinkės</button>
            </Link>
            <Link to="/galerija" onClick={closeMobileNav}>
              <button className="navButton">Galerija</button>
            </Link>
            <Link to="/kontaktai" onClick={closeMobileNav}>
              <button className="navButton">Kontaktai</button>
            </Link>
            <Link to="/duk" onClick={closeMobileNav}>
              <button className="navButton">DUK</button>
            </Link>
            <Link to="/rezervacija" onClick={closeMobileNav}>
              <button className="button rezervuotiButton">Rezervuoti</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="navContacts">
        <span>Susisiek su mumis</span>
        <div
          onClick={() => window.open("tel:+37064055444")}
          className="hover-text"
        >
          <img className="phoneIcon" src={phoneIcon} alt="Phone Icon" />
          <span style={{ left: "-350%" }} className="tooltip-text" id="fade">
            +370 640 55444
          </span>
        </div>
        <div className="hover-text">
          <img
            src={mailIcon}
            alt="Email Icon"
            onClick={() => (window.location.href = "mailto:bociupis@gmail.com")}
          />
          <span style={{ left: "-500%" }} className="tooltip-text" id="fade">
            bociupis@gmail.com
          </span>
        </div>
      </div>
    </>
  );
}

export default NavBar;
