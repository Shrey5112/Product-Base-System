import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { fetchProducts, removeProductFromCart } from "@/redux/productSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { createCheckoutSession } from "@/redux/checkoutSlice";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import api from "@/utils/api";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.user.user?.id);
  const { products, loading } = useSelector((state: RootState) => state.product);
  const { loading: checkoutLoading } = useSelector((state: RootState) => state.checkout);

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [shipping, setShipping] = useState<number>(5);
  // const [promo, setPromo] = useState<string>("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      const filtered = products
        .map((p) => {
          const cartEntry = p.cart?.find((c: any) => c.userId === userId);
          if (cartEntry) return { ...p, quantity: cartEntry.quantity };
          return null;
        })
        .filter(Boolean);
      setCartItems(filtered as any[]);
    }
  }, [products, userId]);

  const handleRemove = async (productId: string) => {
    try {
      await dispatch(removeProductFromCart(productId)).unwrap();
      setCartItems((prev) =>
        prev.filter((item) => item._id !== productId && item.id !== productId)
      );
    } catch (err) {
      console.error("Failed to remove from cart", err);
    }
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === productId || item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };


  // Compute totals
  const itemsTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCost = itemsTotal + shipping;

  const handleCheckout = async () => {
    try {
      if (!cartItems.length) {
        toast.error("Your cart is empty!");
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to initialize");

      // Prepare items for backend
      const itemsForCheckout = cartItems.map(item => ({
        productId: item._id || item.id,
        quantity: item.quantity,
      }));

      const response = await api.post("products/create-session", {
        items: itemsForCheckout,
        userId,
        shipping, // send shipping cost
      });

      const { url } = response.data;
      window.location.href = url; // redirect to Stripe Checkout
    } catch (err: any) {
      console.error("Checkout failed:", err);
      toast.error(err.response?.data?.message || err.message || "Checkout failed");
    }
  };


  if (loading) return <p>Loading cart...</p>;

  return (
    <div className="pt-16 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Side: Shopping Cart */}
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

        <div className="space-y-4">
          {cartItems.map((item) => (
            <Card
              key={item._id || item.id}
              className="flex flex-row items-center p-4 shadow-md rounded-xl"
            >
              {/* Product Image */}
              <div>
              {item.images?.length ? (
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded-md mr-4"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-xs text-gray-500 mr-4">
                  No image
                </div>
              )}
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <h2 className="font-semibold">{item.title}</h2>
                <p className="text-sm text-gray-500">{item.description}</p>
                
              </div>

              {/* Quantity, Price, Total */}
              {/* <div className="flex items-center gap-4"> */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleQuantityChange(
                        item._id || item.id,
                        Math.max(1, item.quantity - 1)
                      )
                    }
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    min={1}
                    max={item.stock}
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(
                        item._id || item.id,
                        Number(e.target.value)
                      )
                    }
                    className="w-16 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleQuantityChange(item._id || item.id, item.quantity + 1)
                    }
                  >
                    +
                  </Button>
                </div>

                <Button
                  // variant="link"
                  className="bg-red-500 text-white"
                  onClick={() => handleRemove(item._id || item.id)}
                >
                  Remove
                </Button>

                <div className="text-right">
                  <p className="font-medium">Product Price: ₹{item.price}</p>
                  <p className="text-sm text-gray-500">
                   Total Price: ₹{item.price * item.quantity}
                  </p>
              </div>
                {/* </div> */}
            </Card>
          ))}
        </div>
      </div>

      {/* Right Side: Order Summary */}
      <div>
        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Items ({cartItems.length})</span>
              <span>₹{itemsTotal}</span>
            </div>

            {/* Shipping Select */}
            <div className="flex justify-between items-center">
              <span>Shipping</span>
              <Select onValueChange={(val) => setShipping(Number(val))}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={`₹${shipping}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">Standard - ₹5</SelectItem>
                  <SelectItem value="20">Express - ₹20</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between font-bold text-lg border-t pt-4">
              <span>Total Cost</span>
              <span>₹{totalCost}</span>
            </div>


            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg cursor-pointer"
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? "Redirecting..." : "Checkout"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
