import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { fetchProducts } from "@/redux/productSlice";
// import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { deleteCourse } from "@/redux/merchantSlice";

const ProductList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.product
  );
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

  // ✅ Delete handler
  const handleDelete = (id: string) => {
    console.log("Delete product:", id);
    // here you can dispatch(deleteProduct(id)) if needed
    dispatch(deleteCourse(id))
  };

  // ✅ Edit handler
  const handleEdit = (id: string) => {
    console.log("Edit product:", id);
    // open dialog / set editing state
  };

  return (
    <div className="pt-16 px-6">
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {products.map((p) => (
          // <Link to={`/products/${p._id}`} key={p._id}>
            <ProductCard
            key={p._id}
              product={p}
              userRole={user?.role}
              onDelete={handleDelete}
              onEdit={() => handleEdit(p._id)}
            />
          // </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
