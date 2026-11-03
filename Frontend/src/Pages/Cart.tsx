import { useEffect, useState } from "react";
import Title from "../Components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../Components/CartTotal";
import type { CartItem } from "../types";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectProducts, selectCurrency, selectCartItems, selectDiscount } from "../store/selectors";
import { updateCart, validatePromotion, clearDiscount } from "../store/cartSlice";
import { toast } from "react-toastify";

const Cart = () => {
  const products = useAppSelector(selectProducts);
  const currency = useAppSelector(selectCurrency);
  const cartItems = useAppSelector(selectCartItems);
  const discount = useAppSelector(selectDiscount);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleUpdateQuantity = (itemId: string, size: string, quantity: number) => {
    dispatch(updateCart({ itemId, size, quantity }));
  };

  const handleApplyPromotion = async (code: string) => {
    try {
      await dispatch(validatePromotion(code)).unwrap();
      toast.success('Promotion applied');
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  useEffect(() => {
    if (products.length > 0) {
      const tempData: CartItem[] = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  return (
    <div className="border-t pt-10">
      <div className="mb-8 rounded-3xl bg-[#FFF8F5] px-6 py-8 sm:px-10">
        <div className="text-2xl">
          <Title text1={"YOUR"} text2={"CART"} />
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-gray-600">
          Review selected items, adjust quantities, and continue to checkout when your order looks right.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-4">
          {cartData.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-orange-200 bg-white p-10 text-center text-gray-500">
              Your cart is empty.
            </div>
          ) : (
            cartData.map((item, index) => {
              const productData = products.find(
                (product) => product._id === item._id
              );
              if (!productData) return null;
              return (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_auto] gap-4 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm sm:grid-cols-[1fr_90px_32px] sm:items-center"
                >
                  <div className="flex items-start gap-5">
                    <img
                      src={imgErrors[productData._id] ? '/placeholder.png' : productData.image[0]}
                      onError={() => setImgErrors(prev => ({ ...prev, [productData._id]: true }))}
                      alt=""
                      className="h-24 w-20 rounded-2xl object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {productData.name}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <p className="font-semibold text-[#E8420A]">
                          {currency}
                          {productData.price}
                        </p>
                        <p className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">
                          Size {item.size}
                        </p>
                      </div>
                    </div>
                  </div>
                  <input
                    onChange={(e) =>
                      e.target.value === "" || e.target.value === "0"
                        ? null
                        : handleUpdateQuantity(
                            item._id,
                            item.size,
                            Number(e.target.value)
                          )
                    }
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                    className="h-11 w-16 rounded-full border border-gray-200 px-3 text-center outline-none focus:border-[#E8420A]"
                  />
                  <img
                    onClick={() => handleUpdateQuantity(item._id, item.size, 0)}
                    src={assets.bin_icon}
                    alt=""
                    className="w-5 cursor-pointer justify-self-end opacity-70 transition hover:opacity-100"
                  />
                </div>
              );
            })
          )}
        </div>

        <div>
          <div className="mb-4 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-gray-900">Promotion Code</p>
            <div className="mt-3 flex gap-2">
              <input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Enter code" className="min-w-0 flex-1 rounded-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]" />
              <button onClick={() => handleApplyPromotion(promoCode)} className="rounded-full bg-[#E8420A] px-5 py-3 text-sm font-bold text-white">Apply</button>
            </div>
            {discount && <button onClick={() => dispatch(clearDiscount())} className="mt-3 text-xs font-bold text-red-600">Remove {discount.code}</button>}
          </div>
          <CartTotal />
          <button
            onClick={() => navigate("/place-order")}
            className="mt-6 w-full rounded-full bg-[#E8420A] px-8 py-4 text-sm font-extrabold text-white shadow-lg shadow-orange-100 transition hover:bg-[#FF6B35]"
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
