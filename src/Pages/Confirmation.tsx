import useFetchData from "@/Hooks/useFetchData";

export default function Confirmation() {
  const data = useFetchData("api/order-confirmation");
  return <div></div>;
}
