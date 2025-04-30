import "./Apylinkes.css";
import pastatas from "@/Images/decorationImages/pusynas.jpeg";
import PhotoGallery from "@/Components/PhotoGallery/photoGallery";
import clockIcon from "@/Images/icons/brown/clock.png";
import AnimatedContainer from "@/Components/AnimatedContainer/AnimatedContainer";
import { LandPlot } from "lucide-react";
import {
  traktieriusDyvaiImages,
  kupiskioPliazasImages,
  dendrologinisParkasImages,
  etnografijosMuziejusImages,
  baznyciaImages,
} from "@/Images/GalleryImages/HouseImages";
import HeaderBackground from "@/Components/HeaderBackground/HeaderBackground";

function Namai() {
  const ObjectOfInterest = ({
    images,
    title,
    description,
    availabilityTime,
    distance,
    reverseDirection,
  }: {
    images: string[];
    title: string;
    description: string;
    availabilityTime: string;
    distance: string;
    reverseDirection?: boolean;
  }) => {
    return (
      <AnimatedContainer>
        <div
          className={`objectOfInteresContainer bodySpacer ${
            reverseDirection ? `reverseDirection` : ``
          }`}
        >
          <div className="objectOfInterestImages">
            <PhotoGallery images={images}></PhotoGallery>
          </div>
          <div className="objectOfInterestInfoContainer">
            <div className="objectOfInterestDescriptionContainer">
              <h2 className="objectOfInterestTitle">{title}</h2>
              <p className="objectOfInterestDescription">{description}</p>
            </div>
            <div className="objectOfInterestAvailabilityContainer">
              <h2>Prieinamumas:</h2>
              <p className="availabilityText">
                <img className="objectOfInterestIcons" src={clockIcon} />
                Darbo valandos: {availabilityTime}
              </p>
              <p className="availabilityText">
                <LandPlot></LandPlot>
                Atstumas: {distance}
              </p>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    );
  };
  return (
    <div>
      <HeaderBackground image={pastatas}>
        <div className="apylinkesHeader">
          <h1 className="headerTitle bodySpacer">Mūsų apylinkės</h1>
          <h2 className="secondaryHeaderTitle bodySpacer">
            Tyrinėkite šalia esančius Kupiškio traukos objektus
          </h2>
        </div>
      </HeaderBackground>
      <ObjectOfInterest
        images={dendrologinisParkasImages}
        title={`Uošvės Liežuvio salos dendrologinis parkas`}
        description={`Kitoje pusėje upės esančioje saloje, pramintoje Uošvės Liežuviu, įrengtas dendrologinis parkas. Tai parkas, kuriame auga keliasdešimt rūšių egzotinių medžių, gėlių ir kitų augalų. Parko teritorijoje įrengti pėsčiųjų takai, tinkami ir bėgikams, ir dviratininkams, poilsio zonos su pavėsinėmis, šiukšlinėmis ir tualetais.`}
        availabilityTime={`visa parą`}
        distance={`300 m`}
      />
      <ObjectOfInterest
        images={kupiskioPliazasImages}
        title={"Aukštupėnų paplūdimys – Kupiškio marios."}
        reverseDirection={true}
        description={`Kupiškio marios – mėgstama kupiškėnų ir svečių poilsio vieta.
             Šioje teritorijoje yra smėlio paplūdimys, persirengimo kabinos, suoliukai,
              paplūdimio futbolo ir paplūdimio tinklinio aikštelės, lauko treniruoklių ir skersinių aikštelė, krepšinio aikštelė, 
              vaikų žaidimų aikštelė, tualetai, gelbėtojų postas, valčių elingas, tiltas į Uošvės Liežuvio salą, automobilių stovėjimo
            aikštelės bei elektromobilių įkrovimo stotelė.`}
        distance={"1,3 Km"}
        availabilityTime={"visa parą"}
      ></ObjectOfInterest>
      <ObjectOfInterest
        images={baznyciaImages}
        title={"Kupiškio Kristaus žengimo į Dangų bažnyčia"}
        description={`Kupiškio bažnyčia – tarsi pilis, puošianti visą Kupiškio miestą. Unikali raudonų plytų bažnyčia, matoma net iš Kupiškio marių vilos, tūriu yra viena didžiausių Lietuvoje. Istorikai mano, kad toje vietoje, kur dabar stovi Kupiškio bažnyčia, buvo senovės lietuvių kulto arba laidojimo vieta.`}
        distance={"2,3 Km"}
        availabilityTime={"visa parą"}
      ></ObjectOfInterest>
      <ObjectOfInterest
        images={traktieriusDyvaiImages}
        title={`Šeimos restoranas  - Traktierius "Dyvai"`}
        reverseDirection={true}
        description={`Traktierius, todėl, kad restorane sunku pateikti visą teikiamų paslaugų įvairovę. Šiuo metu traktieriuje jau yra dienos pietūs, baras-restoranas, pokylių salė, vidinis kiemas renginiams, 19 svečių talpinantis viešbutis ir pokylių salė šventėms ir konferencijoms.`}
        distance={"3,5 Km"}
        availabilityTime={
          "II-IV, VII: 11:00-21:00, V-VI: 11:00-23:00, I: nedirba"
        }
      ></ObjectOfInterest>
      <ObjectOfInterest
        images={etnografijosMuziejusImages}
        title={`Kupiškio etnografijos muziejus`}
        description={`Tai vienintelis muziejus Lietuvoje, įsteigtas Antrojo pasaulinio karo metais. Čia galima ne tik pamatyti XIX a. pab. – XX a. pr. kaimo žmogaus buitį, bet ir mintimis persikelti bei patirti to meto kaimo kasdienybę. Muziejuje yra sukaupta apie 30 000 eksponatų, tarp jų – tradiciniai lietuviški drabužiai ir jų priedų kolekcija bei beveik 4000 metų senumo, didžiausi Lietuvoje rasti tauro ragai.`}
        distance={"2,3 Km"}
        availabilityTime={"I: 08:00-17:00, II-VI: 09:00-18:00, VII: nedirba"}
      ></ObjectOfInterest>
    </div>
  );
}

export default Namai;
