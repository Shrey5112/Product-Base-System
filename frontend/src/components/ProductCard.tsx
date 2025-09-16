import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { addProductToCart, removeProductFromCart } from "@/redux/productSlice";

interface Props {
  product: any;
  userRole?: string;
  onDelete: (id: string) => void;
  onEdit: () => void;
}

export default function ProductCard({ product, userRole, onDelete, onEdit }: Props) {
  const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

  const userId = useSelector((state: RootState) => state.user.user?.id);


  // Check if current user already added this product to cart
  const inCart = product.cart.some((c: any) => c.userId === userId);
  // console.log("inCart", inCart);

  const handleAddToCart = async () => {
    try {
      await dispatch(addProductToCart(product._id)).unwrap();
      // Navigate to cart page
    //   navigate("/cart");
    } catch (err) {
      console.error("Failed to add to cart", err);
    }
  };

  const handleRemoveFromCart = async () => {
    try {
      await dispatch(removeProductFromCart(product._id)).unwrap();
    } catch (err) {
      console.error("Failed to remove from cart", err);
    }
  };

  return (
    <Card className="shadow-md rounded-2xl gap-2">
      <CardHeader className="flex justify-between items-start">
        <CardTitle>{product.title}</CardTitle>
        {userRole === "merchant" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 cursor-pointer">
                <BsThreeDotsVertical />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(product._id)} className="text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>

      <CardContent>
        {product?.images?.length ? (
          <div className="flex gap-2 mt-2 overflow-x-auto">
            {product.images.map((img: string, idx: number) => (
              <img key={idx} src={img} alt="product" className="w-full h-38 object-cover rounded" />
            ))}
          </div>
        ) : (
          <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
            No image
          </div>
        )}
        <p className="text-gray-600 mb-2">{product.description}</p>
        <p className="font-semibold">₹{product.price}</p>
        <p className="text-sm text-gray-500">{product.stock} in stock</p>
      </CardContent>

      <div className="flex justify-between items-center p-2">
        <Link to={`/products/${product._id}`} className="text-blue-600 hover:underline text-sm">
          View Details
        </Link>
        {inCart ? (
          <Button type="button" variant="destructive" onClick={handleRemoveFromCart}>
            Remove from Cart
          </Button>
        ) : (
          <Button type="button" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        )}
      </div>
    </Card>
  );
}
