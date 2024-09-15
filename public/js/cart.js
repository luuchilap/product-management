//Cap nhat so luog san pham trong gio hang
const inputsQuantity = document.querySelectorAll("input[name='quantity']");
if(inputsQuantity.length > 0){
    inputsQuantity.forEach(input => {
        input.addEventListener("change", () => {
            // console.log(e.target.value);
            const productId = input.getAttribute("product-id");
            const quantity = input.value;

            window.location.href = `/cart/update/${productId}/${quantity}`;
        });
    })
}
//Het Cap nhat so luog san pham trong gio hang
