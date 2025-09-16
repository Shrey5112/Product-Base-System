import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { RootState, AppDispatch } from "@/redux/store";
import { fetchProductById } from "@/redux/productSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { product, loading, error } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
  }, [dispatch, id]);

  if (loading) return <p>Loading product...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>No product found</p>;

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{product.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {product?.images?.length ? (
                <div className="flex gap-2 mt-2 overflow-x-auto">
                  {product?.images?.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="product"
                      className="w-full h-38 object-cover rounded"
                    />
                  ))}
                </div>
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                  No image
                </div>
              )}
          <p className="text-gray-700 mb-3">{product.description}</p>
          <p className="text-lg font-semibold text-green-600">₹{product.price}</p>
          {product.stock !== undefined && (
            <p className="text-sm text-gray-500 mt-2">{product.stock} in stock</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetail;
