import PhotoGallery from "../../Components/PhotoGallery/photoGallery";
import AnimatedContainer from "../../Components/AnimatedContainer/AnimatedContainer";

import HeaderBackground from "../../Components/HeaderBackground/HeaderBackground";
import headerPhoto from "../../Images/decorationImages/zveju.jpg";
import poilsioNamelis from "../../Images/decorationImages/Poilsio namelis.jpg";

import bedIcon from "../../Images/icons/brown/bed.png";
import personIcon from "../../Images/icons/brown/person.png";
import saunaIcon from "../../Images/icons/brown/sauna.png";
import tinklinis from "../../Images/decorationImages/tinklinis.jpg";
import Card from "../../Components/Card/Card";
import saslykine from "../../Images/decorationImages/Šašlykinė.jpg";
import parkas from "../../Images/decorationImages/Dendrologinis parkas.jpeg";
import pliazas from "../../Images/decorationImages/Pliažas.jpg";
import {
  pagrindinisPastatasAntrasAukstasImages,
  pirtiesPastatasAntrasAukstasImages,
} from "../../Images/GalleryImages/HouseImages";
import pirtis from "../../Images/decorationImages/pirtis.jpg";
import "../Home/Home.css";
import "./Poilsis.css";
import { kainos } from "../Reservation/Reservation";
import { Link } from "react-router-dom";
import {
  zvejuNamelisImages,
  poilsioNamelisImages,
} from "../../Images/GalleryImages/HouseImages";

export default function Poilsis() {
  return (
    <>
      <HeaderBackground image={headerPhoto}>
        <h1 className="headerTitle">Poilsis</h1>
      </HeaderBackground>

      <div className="recreationIntroGrid">
        <div className="recreationIntroText">
          <h2 className="fontSize4 greyFont">Ilsėkis prie Kupiškio marių!</h2>
          <h3 className="fontSize2 greyFont">
            Išsinuomok namelį, kambarį ar įsikurk kempingą prie pat marių
          </h3>
        </div>
        <img src={poilsioNamelis} className="recreationIntroImage" />
      </div>

      <div className="recreationHouses">
        <h2 className="bodySpacer greyFont textAlignCenter fontSize4">
          Individualūs poilsio nameliai
        </h2>
        <div className="recreationHousesGrid bodySpacer">
          <div className="footerHouseContainer recrationZvejuNamelis">
            <PhotoGallery images={zvejuNamelisImages}></PhotoGallery>
            <div>
              <AnimatedContainer>
                <>
                  <div className="housesInfoContainer">
                    <p className="housesTitle">Žvejų namelis</p>

                    <p className="housesDescription paragraph">
                      Žvejų namelis – puikus pasirinkimas savaitgalio išvykai.
                      Čia rasite tris dvigules lovas, virtuvėlę su visais
                      reikalingais indais ir įrankiais bei lauko terasą. Taip
                      pat tai puiki vieta žvejams, nes terasa yra virš vandens.
                    </p>
                    <div className="housesIconContainer">
                      <div>
                        <img className="housesIcon" src={personIcon} alt="" /> 6
                      </div>
                      <div>
                        <img className="housesIcon" src={bedIcon} alt="" /> 3
                      </div>
                    </div>
                  </div>
                  <div className="housesPriceContainer">
                    <h3 className="housesPriceTitle">Namelio kaina:</h3>
                    <p>
                      <span className="housesPrice">
                        €{kainos.zvejuNamelis}{" "}
                      </span>
                      / para + PVM
                    </p>
                    <Link to="/rezervacija?houseQuery=zvejuNamelis">
                      <button className="button housesButton">Daugiau</button>
                    </Link>
                  </div>
                </>
              </AnimatedContainer>
            </div>
          </div>
          <div className="footerHouseContainer recreationPoilsioNamelis">
            <PhotoGallery images={poilsioNamelisImages}></PhotoGallery>
            <div>
              <AnimatedContainer>
                <>
                  <div className="housesInfoContainer">
                    <p className="housesTitle">Poilsio namelis</p>

                    <p className="housesDescription paragraph">
                      Poilsio namelis, stovintis atokiau nuo kitų pastatų, turi
                      4 miegamąsias vietas, virtuvėlę su visais būtinais indais
                      ir įrankiais bei šaldytuvą. Lauke jūsų laukia
                      šašlykinė-laužavietė ir pikniko staliukas - viskas ko
                      reikia nuostabiai išvykai.
                    </p>
                    <div className="housesIconContainer">
                      <div>
                        <img className="housesIcon" src={personIcon} alt="" /> 4
                      </div>
                      <div>
                        <img className="housesIcon" src={bedIcon} alt="" /> 3
                      </div>
                    </div>
                  </div>
                  <div className="housesPriceContainer">
                    <h3 className="housesPriceTitle">Namelio kaina:</h3>
                    <p>
                      <span className="housesPrice">
                        €{kainos.poilsioNamelis}
                      </span>
                      / para + PVM
                    </p>
                    <Link to="/rezervacija?houseQuery=poilsioNamelis">
                      <button className="button housesButton">Daugiau</button>
                    </Link>
                  </div>
                </>
              </AnimatedContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="aboutUsContainer">
        <div className="aboutUs bodySpacer">
          <div>
            <AnimatedContainer>
              <p className="aboutUsTitle">Pirtis</p>
            </AnimatedContainer>
            <AnimatedContainer>
              <p className="aboutUsSecondaryTitle">
                Mėgaukitės pirties malonumais
              </p>
            </AnimatedContainer>
            <AnimatedContainer>
              <article className="paragraph">
                Kviečiame atvykti poilsiauti su šeima, draugais ar net kelti
                pokylius. Čia rasite 15 vietų salę, terasą, virtuvę su indais ir
                įrankiais. Maistą taip pat galėsite ruošti
                šašlykinėje-laužavietėje. Be to, svarbiausius įrankius
                parūpinsime mes.
              </article>
            </AnimatedContainer>

            <a href="https://traktieriusdyvai.lt/">
              <button className="button" style={{ margin: "2rem 0 0 0" }}>
                Daugiau
              </button>
            </a>
          </div>
          <img className="aboutUsImage" src={pirtis} />
        </div>
      </div>

      <div className="recreationRoomsContainer">
        <div className="recreationRoomsGrid bodySpacer">
          <PhotoGallery
            images={pagrindinisPastatasAntrasAukstasImages.concat(
              pirtiesPastatasAntrasAukstasImages
            )}
          ></PhotoGallery>
          <article>
            <h2 className="fontSize3 greyFont">Miegamieji kambariai</h2>
            <p className="greyFont paragraph">
              Mūsų kambariai talpina iki 32 svečių ir puikiai tinka tiek
              pavieniams keliautojams, tiek grupėms. Kiekvienas kambarys
              dekoruotas jaukiais medžio akcentais, kurie suteikia šilumos ir
              natūralumo pojūtį. Viename iš pastatų visi kambariai turi atskirus
              vonios kambarius, o kitame – bendri vonios kambariai įrengti
              pirmame ir antrame aukštuose.
            </p>
            <Link to="/rezervacija">
              <button className="button noMargin">Daugiau</button>
            </Link>
          </article>
        </div>
      </div>

      <div className="territoryContainer">
        <div className="territory">
          <h3 className="fontSize4 textAlignCenter territoryTitle">
            Teritorija
          </h3>
          <div className="territoryCards bodySpacer">
            <Card
              image={tinklinis}
              title="Lauko Sportas"
              text="Krepšinio ir tinklinio aikštelės, futbolo vartai."
            ></Card>
            <Card
              image={parkas}
              title="Lankomi objektai"
              text="Dendrologinis parkas, atokiau - Kupiškio paplūdimys"
              delay={0.1}
            ></Card>
            <Card
              image={pliazas}
              title="Marių paplūdimys"
              text="Vos už 30 metrų esantis paplūdimys su liepteliu, persirengimo kabina ir suoliukais."
              delay={0.2}
            ></Card>
            <Card
              image={saslykine}
              title="Lauko maisto ruoša"
              text="Parūpinsime didelę šašlykinę-laužavietę su visais įrankiais"
            ></Card>
          </div>
        </div>
      </div>
    </>
  );
}
