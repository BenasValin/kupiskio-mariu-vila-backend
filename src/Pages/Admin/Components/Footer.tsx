import { Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <section className="h-40 border-t-2 flex justify-center flex-col">
      <p>
        Jeigu sistema neveikia / atsirado trikdžių ar turite patobulinimo
        pasiūlymų, mielai laukiu skambučių ir žinučių:
      </p>
      <div className="flex flex-row gap-3">
        <Phone />
        +37068252775
      </div>
      <div className="flex flex-row gap-3">
        <Mail />
        valintelisb@gmail.com
      </div>
    </section>
  );
}
