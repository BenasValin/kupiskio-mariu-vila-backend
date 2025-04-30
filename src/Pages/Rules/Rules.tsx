import "./Rules.css";
import pagrindinis from "../../Images/decorationImages/pagrinidispastatas.jpg";
import { Link } from "react-router-dom";
import HeaderBackground from "../../Components/HeaderBackground/HeaderBackground";
function Rules() {
  return (
    <div>
      <HeaderBackground image={pagrindinis}>
        <h1 className="headerTitle">Sąlygos ir taisyklės</h1>
      </HeaderBackground>
      <div className="rulesContainer">
        <h2>Atvykimo / išvykimo laikas</h2>
        <ul>
          <li>
            Atvykti į svečių namus "Kupiškio marių vila" nuo 12:00 iki 18:00
          </li>
          <li>
            <b>SVARBU</b> Jei planuojate atvykti po 18:00, prašome apie savo
            vėlyvą atvykima informuoti svečių namų administratorę -
            <Link to="/kontaktai">
              <a href="">Kontaktai.</a>
            </Link>
            <a href=""></a>
          </li>
          <li>
            Išvykimo laikas iš svečių namu - iki 13:00. Neužmirškite palikti
            kambario raktų. Dėl vėlesnio išvykimo ar bagažo palikimo galimybių
            prašome kreiptis tiesiogiai į administratorę -{" "}
            <Link to="/kontaktai">
              <a href="">Kontaktai.</a>
            </Link>
          </li>
        </ul>
        <h2>Apgadintas / Pamestas turtas</h2>
        <ul>
          <li>
            Apsigyvenę kambaryje, patikrinkite jame esančius daiktus ir
            inventorių. Apie visus gedimus nedelsdami praneškite
            administratorei, kad galėtume juos kuo greičiau pašalinti ir
            išvengti nesusipratimų. Neužmirškite - už sugadintą viešbučio
            inventorių atsakote Jūs. Žalos atlyginimo dydį už svečių namų
            inventoriaus ar turto sugadinimą, pametimą skaičiuoja
            atdministratorė pagal galiojantį mažaverčio turto kainininką arba
            šalių susitarimu.
          </li>
          <li>
            Jeigu turite vertingų daiktų, atiduokite juos saugoti į banką -
            vagystės atveju mes neatsakome už Jūsų nuostolius.
          </li>
        </ul>
        <h2>Vidaus tvarkos taisyklės</h2>
        <ul>
          <li>
            Atvykimas su gyvūnais leidžiamas tik iš anksto susitarus su
            administratorę.
          </li>
          <li>Rūkyti leidžiama tik tam skirtose vietose.</li>
          <li>
            Nepalikit mažylių be priežiūros, neleiskite žaisti su elektros
            prietaisais.
          </li>

          <li>Neužmirškite užrakinti lauko duris.</li>
          <li>
            Neišsineškite iš pastato jokių daiktų, priklausančių svečių namams
            "Kupiškio marių vila".
          </li>
          <li>
            Į bendro naudojimo patalpas ir kambarius draudžiama atsinešti ir
            laikyti dviračius, burlentes, sodo baldus ar kitus stambius daiktus.
          </li>
          <li>
            Gerbkite kartu gyvenančių žmonių privatumą. Kaimynų vardu prašome
            netriukšmauti ir gerbti kitų žmonių poilsį ir privatumą.
          </li>
          <li>
            Bendro naudojimo patalpose nepalikite Jums priklausančių daiktų
            (vaikiškų vežimėlių, riedučių, batų ir t.t.).
          </li>
          <li>
            Mums labai malonu, kad Jūs kviečiate draugus ir artimuosius
            apžiūrėti svečių namų "Kupiškio marių vila" ir Jūsų gyvenamo
            kambario, bet neužmirškite pranešti administratorei jei jie norės
            pas Jus pernakvoti. Be papildomo apmokėjimo kambaryje gali
            svečiuotis tik tiek asmenų kiek buvo nurodyta atvykimo kelialapyje.
          </li>
          <li>
            Kad neapkarstų Jūsų poilsis, laikykites priešgaisrinės saugos ir
            saugumo technikos reikalavimų. Kilus gaisrui ar atsitikus nelaimei,
            nedelsdami kvieskite gelbėjimo tarnybas ir informuokite
            administratorę.
          </li>

          <li>
            Virtuvėje gamindami valgį, būtinai įjunkite gartraukį ir
            ventiliaciją, praverkite langą, kad gaminamo maisto kvapas
            netrukdytų kaimynų poilsio. Baigus gaminti ar pavalgius,
            susitvarkykite, išvėdinkite virtuvę, kad ir kaimynams būtų jauku.
            Draudžiama atsinešti, laikyti, ruošti maisto produktus turinčius
            aštrų, nemalonų kvapą.
          </li>
        </ul>
        <h2>Elektros sauga</h2>
        <ul>
          <li>
            Naudodamiesi virtuvės įranga, laikykites elektros prietaisų
            vartojimo instrukcijų ir saugos taisyklių. Nepalikite įjungtų
            elektros prietaisų be priežiūros.
          </li>
          <li>
            Bendro naudojimo lygintuvas ir lyginimo lenta yra virtuvėje.
            Neužmirškite pasinaudojus grąžinti juos į savo vietas.
          </li>
          <li>
            Draudžiama naudoti atsineštus elektros prietaisus, kurių elektrinė
            galia viršija 150W.
          </li>
          <li>Išeidami iš patalpų nepalikite įjungtų elektros prietaisų.</li>
        </ul>
        <h5>
          Svečių namai "Kupiškio marių vila" administratorė turi teisę
          iškeldinti iš kambario ankščiau nustatyto termino asmenis, kurie
          nesilaiko ir šiurkščiai pažeidžia Svečių namai "Kupiškio marių vila"
          vidaus tvarkos ir elgesio taisykles, taip pat pareikalauti atlyginti
          padarytą žalą ir nuostolius.
        </h5>
      </div>
    </div>
  );
}

export default Rules;
