import "./Home.css";
import { Link } from "react-router-dom";
import Card from "../../Components/Card/Card.js";
import AnimatedContainer from "../../Components/AnimatedContainer/AnimatedContainer";
import PhotoGallery from "../../Components/PhotoGallery/photoGallery";
import { kainos } from "@/config.js";
import MediaWithText from "../../Components/MediaWithText/MediaWithText";

//Images:
import pokyliuStalas from "../../Images/decorationImages/pokyliustalas.jpg";
import tinklinis from "../../Images/decorationImages/tinklinis.jpg";
import baidares from "../../Images/decorationImages/baidares.jpg";
import kempingas from "../../Images/decorationImages/kempingas.jpg";
import pirtis from "../../Images/decorationImages/pirtis.jpg";
import {
  zvejuNamelisImages,
  pagrindinisPastatasPirmasAukstasImages,
  pirtiesPastatasPirmasAukstasImages,
  pirtiesPastatasAntrasAukstasImages,
  poilsioNamelisImages,
  kempingasImages,
} from "../../Images/GalleryImages/HouseImages.js";

//Icons:
import bedIcon from "../../Images/icons/brown/bed.png";
import personIcon from "../../Images/icons/brown/person.png";
import saunaIcon from "../../Images/icons/brown/sauna.png";

function Home() {
  const footerGalleryImages = zvejuNamelisImages.concat(
    pagrindinisPastatasPirmasAukstasImages
  );
  console.log(kainos.kempingas);
  return (
    <>
      <div className="landingPageContainer">
        <div className="titleContainer ">
          <AnimatedContainer delay={0.2}>
            <h1 className="title bodySpacer">Atraskite Kupiškio marių grožį</h1>
          </AnimatedContainer>

          <AnimatedContainer delay={0.4}>
            <h3 className="secondaryMainTitle bodySpacer">
              Kupiškio marių vila
            </h3>
          </AnimatedContainer>
          <AnimatedContainer delay={0.6}>
            <Link to="/galerija">
              <button className="button bodySpacer">Galerija</button>
            </Link>
          </AnimatedContainer>
        </div>
      </div>

      <div className="shortDescriptionContainer">
        <AnimatedContainer>
          <>
            <p className="shortDescriptionTitle">Kupiškio Marių vila</p>
            <a className="shortDescriptionText bodySpacer paragraph">
              Tai pastatų kompleksas ant Kupiškio marių kranto, tik 2 km. nuo
              Kupiškio miesto. Kupiškio marios – tai Lėvens upės tvenkinys
              pastatytas 1984 m., kurio plotas 828 ha, tūris 33 mln. m3,
              vidutinis gylis 5 m, didžiausias gylis 14 m.
            </a>
          </>
        </AnimatedContainer>
      </div>

      <div className="services2 bodySpacer">
        <MediaWithText
          images={pagrindinisPastatasPirmasAukstasImages}
          title="Pokylių salė"
          text="Švęskite svarbias akimirkas mūsų pokylių salėje: nuo mažų paminėjimų mažojoje salėje su pirtimi iki vestuvių 50 žmonių talpinančioje salėje. Mes parūpinsime jums maitinimą, jaukią lova ir nuostabią šventinę atmosferą."
          url="/rezervacija?houseQuery=pagrindinisPastatas"
          reverseDirection={true}
        ></MediaWithText>
        <div className="greenDiv"></div>
        <MediaWithText
          images={zvejuNamelisImages.concat(poilsioNamelisImages)}
          title="Poilsiavietė prie marių"
          text="Kviečiame atostogauti gamtos apsuptyje: išsinuomokite kambarį
                ar net individualų namelį prie pat vandens."
          url="/rezervacija?houseQuery=zvejuNamelis"
        ></MediaWithText>
        <MediaWithText
          images={kempingasImages}
          title="Stovyklavietė"
          text="Iškylaukite pas mus su visais patogumais: paplūdimys, geriamas
                vanduo, lauko tualetas ir sporto aikštelės."
          url="/rezervacija?houseQuery=kempingas"
          reverseDirection={true}
        ></MediaWithText>
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
                pokylius. Čia rasite 15 vietų salę, terasą, virtuvę su indais,
                įrankiais. Maistą taip pat galėsite ruošti
                šašlykinėje-laužavietėje. Be to, svarbiausius įrankius
                parūpinsime mes.
              </article>
            </AnimatedContainer>

            <Link to={`/rezervacija?houseQuery=pirtiesPastatas`}>
              <button className="button" style={{ margin: "2rem 0 0 0" }}>
                Daugiau
              </button>
            </Link>
          </div>
          <img className="aboutUsImage" src={pirtis} />
        </div>
      </div>

      <div className="comfort bodySpacer">
        <img className="comfortImage" src={pokyliuStalas} />
        <div className="comfortList">
          <AnimatedContainer>
            <div className="comfortContainer">
              <div className="comfortNumber">01</div>
              <p className="comfortTitle">Būtiniausi patogumai</p>
              <p className="comfortText paragraph">
                Užtikriname jums švarią lovą, elektrą, geriamą vandenį,
                sutvarkytą aplinką, nuostabias marias ir nepakartojamus
                įspūdžius.
              </p>
            </div>
          </AnimatedContainer>
          <AnimatedContainer>
            <div className="comfortContainer">
              <div className="comfortNumber">02</div>
              <p className="comfortTitle">
                Individualus dėmesys kiekvienam svečiui
              </p>
              <p className="comfortText paragraph">
                Mes pasirūpinsime, kad jūsų specifiniai poreikiai būtų
                patenkinti, nesvarbu, ar tai ypatingas prašymas, pageidavimas ar
                iškilusi bėda.
              </p>
            </div>
          </AnimatedContainer>
          <AnimatedContainer>
            <div className="comfortContainer">
              <div className="comfortNumber">03</div>
              <p className="comfortTitle">Ramybė gamtoje</p>
              <p className="comfortText paragraph">
                Teritorija yra apsupta medžių ir vandens - puiki vieta pabėgti
                nuo miesto šurmulio.
              </p>
            </div>
          </AnimatedContainer>
        </div>
      </div>

      <div className="outdoorActivitiesContainer">
        <div className="outdoorActivitiesWrapper bodySpacer">
          <div className="outdoorActivitesTextContainer">
            <div>
              <h3 className="outdoorActivitesTextContainerTitle">
                Lauko Pramogos
              </h3>
              <p className="outdoorActivitesTextContainerSecondaryTitle">
                Leiskites į nuotykius
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <article className="outdoorActivitesTextContainerText">
                Čia rasite gausybę veiklų, kurios tiks tiek aktyvaus poilsio
                mėgėjams, tiek ramių užsiėmimų ieškotojams. Nuo sporto aikštelių
                iki vandens pramogų ir kempingų.
              </article>
            </div>
          </div>
          <div className="outdoorActivities">
            <Card
              image={tinklinis}
              title="Lauko sportas"
              text="Čia rasite futbolo vartus, krepšinio bei tinklinio aikšteles"
            ></Card>
            <Card
              image={baidares}
              title="Vandens pramogos"
              text="Suteiksime jums valtį, kad galėtumėte tyrinėti marias. Plačiau teiraukitės telefonu"
            ></Card>
            <Card
              image={kempingas}
              title="Kempingas"
              text="Kempinge galite pasistatyti savo palapinę. Čia rasite sutvarkytą ir jaukią aplinką, įrengtą laužavietę, lauko WC ir šulinį."
            ></Card>
          </div>
        </div>
      </div>

      <div className="housesContainer">
        <div className="footerHouseContainer bodySpacer">
          <PhotoGallery
            images={pagrindinisPastatasPirmasAukstasImages}
          ></PhotoGallery>
          <AnimatedContainer>
            <>
              <div className="housesInfoContainer">
                <p className="housesTitle">Pagrindinis pastatas</p>

                <p className="paragraph greyFont">
                  Kupiškio marių pokylių salė siūlo kerinčią, marių tematikos
                  aplinką bet kokiai ypatingai progai. Čia rasite 50 žmonių
                  talpinančią salę, 18 miegamųjų vietų, barą, talpią terasą ir
                  virtuvę.
                </p>
                <div className="housesIconContainer">
                  <div>
                    <img className="housesIcon" src={personIcon} alt="" /> 50
                  </div>
                  <div>
                    <img className="housesIcon" src={bedIcon} alt="" /> 18
                  </div>
                </div>
              </div>
              <div className="housesPriceContainer">
                <h3 className="housesPriceTitle">Pokylių salės kaina</h3>
                <p>
                  <span className="housesPrice">
                    €{kainos.pagrindinisPastatasPirmas}
                  </span>
                  / para + PVM
                </p>
                <h3 className="housesPriceTitle">Miegamosios vietos kaina:</h3>
                <p>
                  <span className="housesPrice">
                    €{kainos.pagrindinisPastatasAntras}
                  </span>
                  / para + PVM
                </p>
                <Link to="/rezervacija?houseQuery=pagrindinisPastatas">
                  <button className="button housesButton">Daugiau</button>
                </Link>
              </div>
            </>
          </AnimatedContainer>
        </div>
        <div className="footerHouseContainer bodySpacer">
          <PhotoGallery
            images={pirtiesPastatasPirmasAukstasImages.concat(
              pirtiesPastatasAntrasAukstasImages
            )}
          ></PhotoGallery>
          <AnimatedContainer>
            <>
              {" "}
              <div className="housesInfoContainer">
                <p className="housesTitle">Pirties pastatas</p>

                <p className="housesDescription paragraph">
                  Mūsų pirties pastatas siūlo atskirą erdvę nuo pagrindinio
                  pastato. Pirmame aukšte yra pirtis, o antrame – 14 miegamųjų
                  vietų. Čia taip pat rasite 15 vietų salę, lauko terasą,
                  virtuvę su indais, įrankiais ir kriauklę su tekančiu geriamu
                  vandeniu.
                </p>
                <div className="housesIconContainer">
                  <div>
                    <img className="housesIcon" src={personIcon} alt="" /> 15
                  </div>
                  <div>
                    <img className="housesIcon" src={bedIcon} alt="" /> 14
                  </div>
                  <div>
                    <img className="housesIcon" src={saunaIcon} alt="" /> 1
                  </div>
                </div>
              </div>
              <div className="housesPriceContainer">
                <h3 className="housesPriceTitle">Pirties su sale kaina:</h3>
                <p>
                  <span className="housesPrice">
                    €{kainos.pirtiesPastatasPirmas}
                  </span>
                  / pusė paros + PVM
                </p>
                <h3 className="housesPriceTitle">Miegamosios vietos kaina:</h3>
                <p>
                  <span className="housesPrice">
                    €{kainos.pirtiesPastatasAntras}
                  </span>
                  / para + PVM
                </p>
                <Link to="/rezervacija?houseQuery=pirtiesPastatas">
                  <button className="button housesButton">Daugiau</button>
                </Link>
              </div>
            </>
          </AnimatedContainer>
        </div>
        <div className="footerHouseContainer bodySpacer">
          <PhotoGallery images={zvejuNamelisImages}></PhotoGallery>
          <AnimatedContainer>
            <>
              <div className="housesInfoContainer">
                <p className="housesTitle">Žvejų namelis</p>

                <p className="housesDescription paragraph">
                  Žvejų namelis – puikus pasirinkimas savaitgalio išvykai. Čia
                  rasite tris dvigules lovas, virtuvėlę su visais reikalingais
                  indais ir įrankiais bei lauko terasą. Taip pat tai puiki vieta
                  žvejams, nes terasa yra virš vandens.
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
                  <span className="housesPrice">€{kainos.zvejuNamelis} </span>/
                  para + PVM
                </p>
                <Link to="/rezervacija?houseQuery=zvejuNamelis">
                  <button className="button housesButton">Daugiau</button>
                </Link>
              </div>
            </>
          </AnimatedContainer>
        </div>
        <div className="footerHouseContainer bodySpacer">
          <PhotoGallery images={poilsioNamelisImages}></PhotoGallery>
          <div>
            <AnimatedContainer>
              <>
                <div className="housesInfoContainer">
                  <p className="housesTitle">Poilsio namelis</p>

                  <p className="housesDescription paragraph">
                    Poilsio namelis, stovintis atokiau nuo kitų pastatų, turi 4
                    miegamąsias vietas, virtuvėlę su visais būtinais indais,
                    įrankiais ir šaldytuvu. Lauke jūsų laukia
                    šašlykinė-laužavietė ir pikniko staliukas – viskas, ko
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

      <div className="footerGallery bodySpacer">
        {footerGalleryImages.map((image) => {
          return <img className="footerGalleryImage" src={image} />;
        })}
      </div>
      <AnimatedContainer>
        <Link to="/galerija">
          <button className="button footerGalleryButton">
            Visos nuotraukos
          </button>
        </Link>
      </AnimatedContainer>
    </>
  );
}

export default Home;
