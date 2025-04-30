import "./Kontaktai.css";
import pagrindinis from "../../Images/decorationImages/pastatas.jpg";
import { useRef } from "react";
import HeaderBackground from "../../Components/HeaderBackground/HeaderBackground";
import { Link } from "react-router-dom";

function Kontaktai() {
  const name = useRef();
  const surname = useRef();
  const email = useRef();
  const phoneNumber = useRef();
  const message = useRef();
  const contactTime = useRef();

  const isInputEmpty = () => {
    const inputs = [
      name.current.value,
      surname.current.value,
      email.current.value,
      phoneNumber.current.value,
      message.current.value,
      contactTime.current.value,
    ];

    for (const input of inputs) {
      if (!input) {
        return true;
      }
    }

    return false;
  };
  const sendEmail = async () => {
    if (isInputEmpty) {
      window.alert("Prašome užpildyti visus laukelius");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.current.value,
          surname: surname.current.value,
          email: email.current.value,
          phoneNumber: phoneNumber.current.value,
          message: message.current.value,
          contactTime: contactTime.current.value,
        }),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error sending email:", error);
    }

    name.current.value = "";
    surname.current.value = "";
    email.current.value = "";
    phoneNumber.current.value = "";
    message.current.value = "";
    contactTime.current.value = "";
  };

  return (
    <div>
      <HeaderBackground image={pagrindinis}>
        <h1 className="headerTitle">Aptarkime jūsų šventę</h1>
      </HeaderBackground>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d575943.4346424454!2d24.410143209278445!3d55.67544563278891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46e870daaaaaaaab%3A0xb887bea4b4fccea0!2zS3VwacWha2lvIG1hcmnFsyB2aWxh!5e0!3m2!1slt!2slt!4v1720693279250!5m2!1slt!2slt"
        className="locationMap"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
      <div className="contactPageGrid">
        <div className="contactPageInformation bodySpacer">
          <h1 className="letsTalk ">Kontaktai</h1>
          <div className="admininstratorContactsContainer">
            <p className="contactTitle">Direktorius</p>
            <p className="contactName">Vilius Valintėlis</p>
            <p className="contactPhone">+370 659 48600</p>
          </div>
          <div className="admininstratorContactsContainer">
            <p className="contactTitle">Administratorė</p>
            <p className="contactPhone">+370 640 55444</p>
          </div>
          <div className="admininstratorContactsContainer companyInfo">
            <a className="companyInfoTitle">Rekvizitai</a>
            <a>Pavadinimas: UAB „Bočiupis“</a>
            <a>Adresas: Šimtmečio g. 1-1, Kupiškis</a>
            <a>Įmonės kodas: 164767965</a>
            <a>PVM kodas: LT647679610</a>
          </div>
          <div className="adressContainer">
            <a className="villaAdressTitle">Adresas</a>
            <a>Vėžionių g. 51</a>
            <a>Aukštupėnai</a>
            <a>40104</a>
            <a>Kupiškio r. sav.</a>
          </div>
        </div>
        <div className="contactPageFormContainer bodySpacer">
          <h1 className="letsTalk letsTalk2">Parašyk mums laiškelį!</h1>
          <div className="contactPageForm">
            <div className="contactFormName">
              <div className="inputFieldGroup">
                <p className="greyFont inputFieldHeader">Vardas</p>
                <input ref={name} type="text" placeholder="Vardas" />
              </div>
              <div className="inputFieldGroup">
                <p className="greyFont inputFieldHeader">Pavardė</p>
                <input ref={surname} type="text" placeholder="Pavardė" />
              </div>
            </div>

            <p className="inputFieldHeader"> Elektroninis paštas</p>
            <input ref={email} type="text" placeholder="El. paštas" />
            <p className="inputFieldHeader">Telefono numeris</p>
            <input ref={phoneNumber} type="text" placeholder="Tel. Nr." />
            <p className="inputFieldHeader"> Jūsų žinutė</p>
            <textarea
              ref={message}
              cols="30"
              rows="10"
              placeholder="Laba diena..."
            ></textarea>
            <p className="inputFieldHeader">Kada su jumis susisiekti?</p>
            <input
              ref={contactTime}
              type="text"
              placeholder="Pvz. : Skambinkite nuo 17:00 iki 22:00"
            />

            <br />
            <button className="button sendMessageButton" onClick={sendEmail}>
              Siųsti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Kontaktai;
