import { useState, useEffect } from "react";
import HeaderBackground from "@/Components/HeaderBackground/HeaderBackground";
import { useLocation } from "react-router-dom";
import "./Reservation.css";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { kainos } from "@/config";
import { serverURL } from "@/config";
import {
  FacebookShareButton,
  FacebookMessengerShareButton,
  WhatsappShareButton,
  TelegramShareButton,
} from "react-share";

// Mantine Calendar:
import { MonthPickerInput, Calendar } from "@mantine/dates";
import moment from "moment";
// @ts-ignore
import "dayjs/locale/lt";

// Icons:
import personIcon from "@/Images/icons/brown/person.png";
import kitchenIcon from "@/Images/icons/brown/kitchen.png";
import PhotoGallery from "@/Components/PhotoGallery/photoGallery";
import facebookIcon from "@/Images/icons/brown/facebook.png";
import telegramIcon from "@/Images/icons/brown/telegram.png";
import whatsappIcon from "@/Images/icons/brown/whatsapp.png";
import messengerIcon from "@/Images/icons/brown/messenger.png";
import phoneIcon from "@/Images/icons/brown/phone.png";
import emailIcon from "@/Images/icons/brown/email.png";
import arrowIcon from "@/Images/icons/brown/arrow.png";
import toiletIcon from "@/Images/icons/brown/toilet.png";

// Images:
import pagrindinis from "@/Images/decorationImages/pastatas.jpg";
import {
  zvejuNamelisImages,
  pirtiesPastatasAntrasAukstasImages,
  pirtiesPastatasPirmasAukstasImages,
  pagrindinisPastatasAntrasAukstasImages,
  pagrindinisPastatasPirmasAukstasImages,
  kempingasImages,
  poilsioNamelisImages,
} from "@/Images/GalleryImages/HouseImages";

moment.locale("lt");

interface BlockedDate {
  startDate: moment.Moment;
  endDate: moment.Moment;
}

interface BlockedDatesState {
  zvejunamelis: BlockedDate[];
  pagrindisPastatasPirmas: BlockedDate[];
  pagrindisPastatasAntras: BlockedDate[];
  pirtiesPastatasPirmas: BlockedDate[];
  pirtiesPastatasAntras: BlockedDate[];
  poilsioNamelis: BlockedDate[];
  kempingas: BlockedDate[];
  [key: string]: BlockedDate[];
}

interface SpecificationType {
  icon: string;
  title: string;
  text: string;
}

interface PriceTextType {
  price: number;
  text: string;
}

interface HouseProps {
  price: number;
  blockedDates?: BlockedDate[];
  images: string[];
  title: string;
  secondaryTitle?: string;
  description: string;
  specifications?: SpecificationType[];
  priceText?: PriceTextType[];
  id?: string;
  comment?: string;
}

function Reservation() {
  const [blockedDates, setBlockedDates] = useState<BlockedDatesState>({
    zvejunamelis: [],
    pagrindisPastatasPirmas: [],
    pagrindisPastatasAntras: [],
    pirtiesPastatasPirmas: [],
    pirtiesPastatasAntras: [],
    poilsioNamelis: [],
    kempingas: [],
  });
  const location = useLocation();
  const [open, setOpen] = useState<boolean>(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTo = params.get("houseQuery");

    if (scrollTo) {
      const element = document.getElementById(scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  useEffect(() => {
    const houses = [
      "zvejunamelis",
      "pagrindisPastatasPirmas",
      "pagrindisPastatasAntras",
      "pirtiesPastatasPirmas",
      "pirtiesPastatasAntras",
      "poilsioNamelis",
      "kempingas",
    ];

    houses.forEach((house) => {
      fetch(`${serverURL}/api/booked-ranges?house=${house}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(`Fetched data for ${house}:`, data);
          const booked = data.reduce(
            (acc: Record<string, BlockedDate[]>, booking: any) => {
              if (!acc[booking.house]) {
                acc[booking.house] = [];
              }
              acc[booking.house].push({
                startDate: moment(booking.start_date),
                endDate: moment(booking.end_date),
              });
              return acc;
            },
            {}
          );
          setBlockedDates((prevBlockedDates) => ({
            ...prevBlockedDates,
            ...booked,
          }));
        })
        .catch((error) =>
          console.error(`Error fetching booked ranges for ${house}:`, error)
        );
    });
  }, []);

  // Function to check if a date is blocked
  const isDateBlocked = (
    date: Date,
    houseBlockedRanges?: BlockedDate[]
  ): boolean => {
    const momentDate = moment(date);

    // Check if date is in the past
    if (moment().diff(momentDate, "days") > 0) {
      return true;
    }

    // Check if date is in any blocked range
    if (houseBlockedRanges) {
      return houseBlockedRanges.some((range) =>
        momentDate.isBetween(range.startDate, range.endDate, null, "[]")
      );
    }

    return false;
  };

  const ReservationInstructions = () => {
    return (
      <div className="reservationInstructionsContainer">
        <h2 className="greyFont">Kaip atlikti Rezervaciją?</h2>
        <div className="instructionStepContainer">
          <div className="stepNumber">01</div>
          <p className="greyFont">Išsirinkite laisvas dienas kalendoriuje</p>
        </div>
        <div className="instructionStepContainer">
          <div className="stepNumber">02</div>
          <p className="greyFont">Susisiekite su admnistratorę</p>
        </div>
        <div className="instructionStepContainer">
          <div className="stepNumber">03</div>
          <p className="greyFont">Atvykite pasirašyti sutartį</p>
        </div>

        <div className="modalButtons">
          <Link to="/kontaktai">
            <button className="button">Kontaktai</button>
          </Link>

          <button onClick={onCloseModal} className="button closeButton">
            Uždaryti
          </button>
        </div>
      </div>
    );
  };

  const SocialMediaContainer = () => {
    return (
      <div className="shareContainer boxShadow">
        <h2 className="greyFont secondaryTitle">Pasidalink su draugais:</h2>
        <div className="socialMediaIcons">
          <FacebookShareButton url="http://www.kupiskiomariuvila.lt/">
            <img className="icon" src={facebookIcon} alt="" />
          </FacebookShareButton>
          <TelegramShareButton url="http://www.kupiskiomariuvila.lt/">
            <img className="icon" src={telegramIcon} alt="" />
          </TelegramShareButton>
          <WhatsappShareButton url="http://www.kupiskiomariuvila.lt/">
            <img className="icon" src={whatsappIcon} alt="" />
          </WhatsappShareButton>
        </div>
      </div>
    );
  };

  const MoreInfrmationContainer = () => {
    return (
      <div className="moreInformationContainer boxShadow">
        <h2 className="greyFont secondaryTitle">Daugiau informacijos:</h2>
        <div className="moreInformationGrid">
          <div className="moreInformationContactContainer">
            <img src={phoneIcon} className="icon" alt="Phone" />
            <p className="greyFont">+370 640 55444</p>
          </div>
          <div className="moreInformationContactContainer">
            <img src={emailIcon} className="icon" alt="Email" />
            <p className="greyFont">bociupis@gmail.com</p>
          </div>
        </div>
      </div>
    );
  };

  interface InformationDropdownProps {
    icon: string;
    title: string;
    text: string;
  }

  const InformationDropdown = ({
    icon,
    title,
    text,
  }: InformationDropdownProps) => {
    return (
      <div className="houseSpecificationsContainer">
        <div className="houseSpecificationsDropdownButton">
          <img src={icon} alt="" />
          <a className="greyFont">{title}</a>
          <img src={arrowIcon} className="moreInformationArrow" alt="Arrow" />
          <a className="houseSpecificationsDropdown boxShadow">{text}</a>
        </div>
      </div>
    );
  };

  const House = ({
    price,
    blockedDates,
    images,
    title,
    secondaryTitle,
    description,
    specifications = [],
    priceText = [],
    id,
    comment,
  }: HouseProps) => {
    const [selectedMonth, setSelectedMonth] = useState<Date | null>(new Date());

    return (
      <div className="houseExample" id={id}>
        <div className="bodySpacer">
          <PhotoGallery images={images}></PhotoGallery>
          <div>
            <div className="houseSpecificationsContainer">
              {specifications.map((specification, index) => {
                return (
                  <InformationDropdown
                    key={index}
                    icon={specification.icon}
                    title={specification.title}
                    text={specification.text}
                  />
                );
              })}
            </div>
            <h3 className="houseExampleTitle">{title}</h3>
            {secondaryTitle && (
              <h4 className="houseExampleSecondaryTitle">{secondaryTitle}</h4>
            )}
            <div className="houseSpecifications"></div>
            <div className="houseDescription greyFont paragraph">
              {description}
            </div>
          </div>
        </div>
        <div className="houseInformation ">
          <div className="priceAndCalendarContainer boxShadow">
            <div className="priceContainer">
              <h2 className="secondaryTitle greyFont">Kaina:</h2>
              {!priceText.length ? (
                <p className="greyFont priceContainer">
                  <span className="greyFont price">€ {price}</span> / Parai +
                  PVM
                </p>
              ) : (
                priceText.map((sentence, index) => (
                  <p key={index} className="greyFont priceContainer">
                    <span className="greyFont price">€ {sentence.price}</span>
                    {sentence.text}
                  </p>
                ))
              )}
            </div>

            {/* Month selection */}
            <div className="month-selector"></div>

            <div className="calendarContainer">
              <Calendar
                defaultDate={selectedMonth || new Date()}
                excludeDate={(date) => isDateBlocked(date, blockedDates)}
                firstDayOfWeek={1} // Monday as first day
                locale="lt"
                static
                size="sm"
                minDate={dayjs().startOf("day").toDate()}
                maxDate={dayjs().add(1, "year").endOf("day").toDate()}
                className="reservation-calendar"
                styles={(theme) => ({
                  day: {
                    "&[data-excluded]": {
                      color: "#999",
                      backgroundColor: "rgba(255, 0, 0, 0.1)",
                      textDecoration: "line-through",
                      cursor: "not-allowed",
                    },
                  },
                })}
              />
            </div>
            <button
              onClick={onOpenModal}
              className="button calendarRezervuotiButton"
            >
              Rezervuoti
            </button>
            {comment && <p className="comment greyFont">{comment}</p>}
            <Modal open={open} onClose={onCloseModal} center>
              <ReservationInstructions />
            </Modal>
          </div>
          <MoreInfrmationContainer />
          <SocialMediaContainer />
        </div>
      </div>
    );
  };

  return (
    <div>
      <HeaderBackground image={pagrindinis}>
        <h1 className="headerTitle">Rezervacija</h1>
      </HeaderBackground>

      <House
        images={pagrindinisPastatasPirmasAukstasImages}
        title="Pagrindinis Pastatas"
        secondaryTitle="Pirmas aukštas - pokylių salė"
        description={`Kupiškio marių pokylių salė siūlo kerinčią, marių teminę aplinką bet kokiai ypatingai progai. Čia rasite barą, talpią terasą, virtuvę ir 50 žmonių talpinančią salę. Visais jūsų rūpesčiais pasirūpinsime mes – maitinimą tiekia Kupiškio restoranas „Traktierius Dyvai".`}
        blockedDates={blockedDates.pagrindisPastatasPirmas}
        price={kainos.pagrindinisPastatasPirmas}
        specifications={[
          {
            icon: kitchenIcon,
            title: "Virtuvė",
            text: `Čia rasite virtuvę su gausa indų ir įrankių, šaldytuvu,
                indaplove bei iš čiaupo tekantį geriamą vandenį, tad
                galėsite "šeimininkauti" taip, kaip patinka Jums.`,
          },
        ]}
        id="pagrindinispastatas"
        comment="*Rezervuoti pagrindinį arba pirties pastatą atskirai galima likus tik 3 savaitėms iki rezervacijos datos. Kitaip užsakoma visa teritorija."
      />

      <House
        images={pirtiesPastatasPirmasAukstasImages}
        title="Pirties pastatas"
        secondaryTitle="Pirmas aukštas - pirties ir salės patalpos"
        description={`Mūsų pirties pastatas siūlo atskirą erdvę nuo pagrindinio
                  pastato, skirtą mėgautis visais pirties malonumais.
                  Kviečiame atvykti poilsiauti su šeima, draugais ar net kelti pokylius. 
                  Čia rasite 15 vietų salę, lauko terasą, virtuvę su indais, įrankiais, kriaukle su tekančiu geriamu vandeniu. 
                  Maistą taip pat galėsite ruošti šašlykinėje-laužavietėje, o svarbiausius įrankius parūpinsime mes.
                  `}
        blockedDates={blockedDates.pirtiesPastatasPirmas}
        priceText={[
          {
            price: kainos.pirtiesPastatasPirmas,
            text: " / pusei paros + PVM",
          },
        ]}
        price={kainos.pirtiesPastatasPirmas}
        specifications={[]}
        id="pirtiesPastatas"
        comment="*Rezervuoti pagrindinį arba pirties pastatą atskirai galima likus tik 3 savaitėms iki rezervacijos datos. Kitaip užsakoma visa teritorija."
      />

      <House
        images={zvejuNamelisImages}
        title="Žvejų Namelis"
        description={`Žvejų namelis - puikus pasirinkimas savaitgalio išvykai. Čia
                  rasite dvi dvigules lovas pirmame aukšte ir trečią lovą
                  antrame aukšte, virtuvėlę su visais reikalingais indais ir
                  įrankiais. Vos peržengę slenkstį, atrasite terasą virš vandens, iš kurios
                  atsiveria nuostabūs vaizdai į marias. Be to, suteiksime
                  valtį, kuria galėsite tyrinėti Kupiškio vandenis.`}
        blockedDates={blockedDates.zvejunamelis}
        price={kainos.zvejuNamelis}
        specifications={[
          {
            icon: personIcon,
            title: "6",
            text: `Žvejų namelyje gali apsistoti iki 6 žmonių – jame yra 3 dvigulės lovos, iš kurių viena pasiekiama tik laipteliais.`,
          },
        ]}
        id="zvejuNamelis"
      />

      <House
        images={poilsioNamelisImages}
        title="Poilsio namelis"
        description={`Atvykite atostogauti prie Kupiškio marių poilsio namelyje. Namelis yra nuošaliau nuo kitų pastatų, todėl čia galėsite mėgautis ramybe ir privatumu. Jis aprūpintas viskuo, ko gali prireikti maloniam poilsiui: televizoriumi, virtuvėle su indais, šaldytuvu ir netoliese esančiu lauko tualetu. Šalia yra įrengta šašlykinė-laužavietė ir pikniko stalas.`}
        blockedDates={blockedDates.poilsioNamelis}
        price={kainos.poilsioNamelis}
        specifications={[
          {
            icon: personIcon,
            title: "4",
            text: `Poilsio namelyje gali apsistoti 4 žmonės – yra 1 dvigulė ir 2 viengulės lovos.`,
          },
        ]}
        id="poilsioNamelis"
      />

      <House
        images={pagrindinisPastatasAntrasAukstasImages}
        title="Pagrindinis Pastatas"
        secondaryTitle="Antras aukštas - miegamosios patalpos"
        description={`Antrame aukšte, virš mūsų pagrindinės salės, rasite miegamuosius kambarius, kuriuose gali apsistoti iki 18 svečių. Kambariai įrengti jaukiai, su natūralaus medžio akcentais, suteikiančiais šilumos ir jaukumo. Pro langus atsiveria nuostabūs Kupiškio marių vaizdai.`}
        blockedDates={blockedDates.pagrindisPastatasAntras}
        price={kainos.pagrindinisPastatasAntras}
        specifications={[
          {
            icon: personIcon,
            title: "18",
            text: `Šiame pastate yra 18 miegamųju vietų.`,
          },
          {
            icon: toiletIcon,
            title: "WC",
            text: `Šio pastato antrame aukšte yra vienas bendras tualetas ir
                      dar vienas pirmame.`,
          },
        ]}
      />

      <House
        images={pirtiesPastatasAntrasAukstasImages}
        title="Pirties Pastatas"
        secondaryTitle="Antras aukštas - miegamosios patalpos"
        description={`Antrame aukšte, virš pirties patalpų, rasite miegamuosius kambarius, kuriuose gali
                  apsistoti iki 14 svečių. Kiekvienas kambarys įrengtas komfortiškai, su atskiru dušu,
                  tualetu ir šiltu medžio interjeru, atspindinčiu natūralų marių
                  aplinkos grožį.`}
        blockedDates={blockedDates.pirtiesPastatasAntras}
        price={kainos.pirtiesPastatasAntras}
        specifications={[
          {
            icon: personIcon,
            title: "14",
            text: `Šiame pastate yra 14 miegamųju vietų`,
          },
        ]}
      />

      <House
        images={kempingasImages}
        title="Kempingas"
        description={`Kviečiame įsikurti savo kempingą šalia mūsų paplūdimio. Čia rasite sutvarkytą aplinką, laužavietę, įrengtą maisto ruošai, lauko tualetą ir geriamo vandens šulinį.`}
        blockedDates={blockedDates.kempingas}
        price={kainos.kempingas}
        priceText={[
          {
            price: kainos.kempingas,
            text: " / palapinės vieta parai",
          },
          {
            price: kainos.stovejimoVieta,
            text: " / automobilio stovėjimo vieta parai",
          },
        ]}
        id="kempingas"
      />
    </div>
  );
}

export default Reservation;
