import "./Sventes.css";
import HeaderBackground from "../../Components/HeaderBackground/HeaderBackground";
import headerPhoto from "../../Images/decorationImages/pokyliusale.jpg";
import Card from "../../Components/Card/Card";
import { Link } from "react-router-dom";
import PhotoGallery from "../../Components/PhotoGallery/photoGallery";
//Images:
import virtuve from "../../Images/decorationImages/Virtuvėlė .jpg";
import saslykine from "../../Images/decorationImages/Šašlykinė.jpg";
import tinklinis from "../../Images/decorationImages/tinklinis.jpg";
import pokyliuSale from "../../Images/decorationImages/pokyliusale.jpg";
import pliazas from "../../Images/decorationImages/Pliažas.jpg";
import traktieriusDyvai from "../../Images/decorationImages/traktieriusDyvai.jpg";
import pirtis from "../../Images/decorationImages/pirtis.jpg";
import pokyliuStalas from "../../Images/decorationImages/Šventinis stalas.jpg";
import parkas from "../../Images/decorationImages/Dendrologinis parkas.jpeg";
import zvejuNamelis from "../../Images/decorationImages/zveju.jpg";
import terasa from "../../Images/decorationImages/Lauko terasa.jpg";
import supynes from "../../Images/decorationImages/supynės.jpg";
import {
  pagrindinisPastatasPirmasAukstasImages,
  pirtiesPastatasAntrasAukstasImages,
  pagrindinisPastatasAntrasAukstasImages,
  zvejuNamelisImages,
} from "../../Images/GalleryImages/HouseImages";

//icons:
import person from "../../Images/icons/brown/person.png";
import AnimatedContainer from "../../Components/AnimatedContainer/AnimatedContainer";

const SmallPartySpec = ({ image, title, text }) => {
  return (
    <AnimatedContainer>
      <div className="smallPartySpecGrid">
        <img src={image} className="icon" />
        <div>
          <h4 className="fontSize2">{title}</h4>
          <p className="paragraph fontSize1">{text}</p>
        </div>
      </div>
    </AnimatedContainer>
  );
};

export default function Sventes() {
  return (
    <>
      <div className="sventesIntroContainer">
        <div className="introText bodySpacer">
          <h3 className="fontSize4">Švęskite ypatingas akimirkas čia</h3>
          <p className="paragraph fontSize1">
            Mūsų patirtis, įgyta per daugybę metų, užtikrina jūsų šventės sėkmę
          </p>
        </div>
        <img className="sventesIntroImage icon" src={pokyliuStalas} alt="" />
      </div>
      <div className="pagrindinisPastatas">
        <div className="cards1 bodySpacer">
          <Card
            image={pokyliuSale}
            title="Pokylių salė"
            text="Iki 50 žmonių talpinanti salė, baras, lauko terasa su židiniu, erdvi virtuvė."
            darkTheme={false}
          ></Card>
          <Card
            image={pirtis}
            title="Pirtis"
            text="Pirtis, 15 žmonių talpinanti poilsio salė, virtuvė, lauko terasa."
            darkTheme={false}
            delay={0.1}
          ></Card>
          <Card
            image={zvejuNamelis}
            title="Individualūs nameliai"
            text="Du nameliai, kuriuose gali apsistoti 4 ir 6 žmonės. "
            darkTheme={false}
          ></Card>
          <Card
            image={pliazas}
            title="Individualūs užsakymai"
            text="Vandens dviračiai, valtys, baidarės ir kitos pramogos pagal kliento pageidavimą."
            darkTheme={false}
            delay={0.1}
          ></Card>
        </div>
      </div>

      <div className="accommodation">
        <h3 className="accommodationTitle greyFont fontSize4 bodySpacer textAlignCenter">
          Svečių nakvynė
        </h3>
        <div className="accommodationGrid bodySpacer">
          <div className="individualHouse">
            <PhotoGallery images={zvejuNamelisImages}></PhotoGallery>

            <AnimatedContainer>
              <h3 className="fontSize3 greyFont">Individualūs nameliai</h3>
              <p className="paragraph greyFont">
                Individualūs nameliai, esantys atokiau nuo salės, gali puikiai
                papildyti šventės atmosferą, suteikdami svečiams daugiau
                komforto ir privatumo. Šie nameliai galėtų tapti poilsio zona,
                kur svečiai galėtų atsitraukti nuo šventinio šurmulio, pailsėti
                ir pasimėgauti ramybe. Jie taip pat galėtų tapti vaikų zona, kad
                ir jūsų mažyliams šventė neprailgtų ir būtų smagi.
              </p>
              <Link to="/rezervacija" className="greyFont">
                Daugiau
              </Link>
            </AnimatedContainer>
          </div>
          <div className="room">
            <PhotoGallery
              images={pirtiesPastatasAntrasAukstasImages}
            ></PhotoGallery>
            <AnimatedContainer>
              <h3 className="fontSize3 greyFont">Miegamieji kambariai</h3>
              <p className="paragraph greyFont">
                Mūsų kambariai talpina iki 32 svečių. Kiekvienas kambarys
                dekoruotas jaukiais medžio akcentais, kurie suteikia šilumos ir
                natūralumo pojūtį. Viename iš pastatų visi kambariai turi
                atskirus vonios kambarius, o kitame – bendri vonios kambariai
                įrengti pirmame ir antrame aukštuose.
              </p>
              <Link to="/rezervacija" className="greyFont">
                Daugiau
              </Link>
            </AnimatedContainer>
          </div>
        </div>
      </div>
      <div className="territoryContainer">
        <div className="territory bodySpacer">
          <h3 className="fontSize4 textAlignCenter territoryTitle">
            Teritorija
          </h3>
          <div className="territoryCards">
            <Card
              image={tinklinis}
              title="Lauko Sportas"
              text="Krepšinio ir tinklinio aikštelės, futbolo vartai"
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
              text="Vos už 30 metrų esantis paplūdimys su liepteliu, persirengimo kabina ir suoliukais"
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

      <div className="cateringGrid">
        <div className="cateringText">
          <h3 className="fontSize4">Maitinimas</h3>
          <h4 className="fontSize2">Leiskite jūsų švente pasirūpinti mums</h4>
          <p className="paragraph">
            Mūsų firminis restoranas - Traktierius "Dyvai" pasirūpins Jūsų
            svečių maitinimu. Meniu vyrauja Kupiškio ir šiaurės Lietuvos
            tradiciniai patiekalai, pvz., zrazai, švilpikai.
          </p>
          <Link to="https://traktieriusdyvai.lt/">
            <button className="button noMargin">Traktierius "Dyvai"</button>
          </Link>
        </div>
        <img src={traktieriusDyvai} className="cateringImage" />
      </div>

      <div className="smallPartyContainer">
        <div className="smallPartyGrid">
          <div className="smallPartyIntro bodySpacer">
            <h3 className="fontSize4">Smulkesnėms šventėms</h3>
            <p className="fontSize1">
              Mūsų vila – ideali vieta tiek didelėms, tiek ir jaukioms mažesnėms
              šventėms!
            </p>
            <Link to="/rezervacija?houseQuery=pirtiesPastatas">
              <button className="noMargin button">Pasiūlymai</button>
            </Link>
          </div>
          <div className="smallPartyList bodySpacer">
            <SmallPartySpec
              image={pirtis}
              title="Pirtis"
              text="Puiki vieta atsipalaiduoti ir maloniai praleisti laiką su artimaisiais."
            ></SmallPartySpec>
            <SmallPartySpec
              image={supynes}
              title="Mažoji salė su virtuvėle"
              text="jaukus kampelis pasisėdėjimams - 15 žmonių talpinanti salė, virtuvėlė maisto ruošai"
            ></SmallPartySpec>
            <SmallPartySpec
              image={terasa}
              title="Lauko terasa"
              text="maloni lauko erdvė šiltoms vasaros dienoms, didelė šašlykinė-laužavietė lauko maisto ruošai"
            ></SmallPartySpec>
          </div>
        </div>
      </div>

      <div className="bookReview">
        <h2 className="fontSize4">Ar galime apžiūrėti?</h2>
        <h3 className="bookReviewText">
          Žinoma! Paskambinkite mums arba parašykite elektroniniu paštu,
          sutarsime laiką, aprodysime ir atsakysime į visus degančius klausimus.
        </h3>
        <Link to="/kontaktai">
          <button className="button">Kontaktai</button>
        </Link>
      </div>
    </>
  );
}
