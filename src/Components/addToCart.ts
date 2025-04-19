export default function addToCart(
  productId: string,
  event: React.MouseEvent
): void {
  event.preventDefault();

  let cartProducts: { productId: string; quantity: number }[] = JSON.parse(
    localStorage.getItem("cart_products") || "[]"
  );

  const existingProductIndex = cartProducts.findIndex(
    (item) => item.productId === productId
  );

  if (existingProductIndex >= 0) {
    cartProducts[existingProductIndex].quantity += 1;
  } else {
    cartProducts.push({ productId: productId, quantity: 1 });
  }

  localStorage.setItem("cart_products", JSON.stringify(cartProducts));

  // Add visual feedback
  const button = event.currentTarget as HTMLButtonElement;
  const originalText = button.innerText;
  const originalClassName = button.className;
  button.innerText = "Added ✓";
  button.disabled = true;
  button.className =
    "bg-green-600 text-white font-medium py-2 px-4 rounded-md cursor-default transition-colors duration-200 w-full";

  setTimeout(() => {
    button.innerText = originalText;
    button.disabled = false;
    button.className = originalClassName;
  }, 800);
}
