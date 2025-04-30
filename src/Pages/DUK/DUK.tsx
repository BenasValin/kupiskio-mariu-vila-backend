import HeaderBackground from "@/Components/HeaderBackground/HeaderBackground";
import pagrindinis from "../../Images/decorationImages/pastatas.jpg";
import "./DUK.css";
import { Link } from "react-router-dom";
const FaqContainer = ({ title, text }: { title: string; text: string }) => {
  return (
    <div className="faqContainer bodySpacer">
      <h3 className="question boxShadow">{title}</h3>
      <p className="answer paragraph">{text}</p>
    </div>
  );
};
export default function DUK() {
  return (
    <div>
      <HeaderBackground image={pagrindinis}>
        <>
          <h1 className="headerTitle">Dažnai užduodami klausimai</h1>
          <h1 className="bg-red">Labas</h1>
        </>
      </HeaderBackground>
      <div className="faqGrid">
        <div className="faqIntro bodySpacer">
          <h2 className="fontSize4 greyFont">DUK</h2>
          <h3 className=" greyFont">
            Čia rasite atsakymus į dažniausiai užduodamus klausimus. Tačiau, jei
            atsakymo neradote, parašykite mums, ir mes pabandysime atsakyti į
            visus kylančius klausimus!
          </h3>
          <Link to="/kontaktai">
            <button className="button noMargin">Kontaktai</button>
          </Link>
        </div>

        <div>
          <FaqContainer
            title="Kada reikia atvykti / išvykti?"
            text="Prašome atvykti nuo 12:00 iki 18:00. Jei planuojate atvykti po 18:00, prašome apie savo vėlyvą atvykimą informuoti administratorę. Išvykimo laikas iš svečių namų - iki 13:00."
          ></FaqContainer>
          <FaqContainer
            title="Ar galima atvykti su gyvūnais?"
            text="Atvykimas su gyvūnais leidžiamas tik iš anksto susitarus su administratore."
          ></FaqContainer>
        </div>
      </div>
    </div>
  );
}
