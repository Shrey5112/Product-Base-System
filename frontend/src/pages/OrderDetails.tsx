// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import type { RootState, AppDispatch } from "@/redux/store";
// import { fetchOrder } from "@/redux/checkoutSlice";

// export default function OrderDetail() {
//   const { id } = useParams();
//   const dispatch = useDispatch<AppDispatch>();
//   const { order, loading, error } = useSelector(
//     (state: RootState) => state.checkout
//   );

//   useEffect(() => {
//     if (id) dispatch(fetchOrder(id));
//   }, [dispatch, id]);

//   if (loading) return <p>Loading order...</p>;
//   if (error) return <p>Error: {error}</p>;
//   if (!order) return <p>No order found</p>;

//   return (
//     <div>
//       <h1>Order #{order._id}</h1>
//       <p>Status: {order.status}</p>
//       <p>Total: ₹{order.totalAmount}</p>
//       <h3>Items:</h3>
//       <ul>
//         {order.items.map((item: any, i: number) => (
//           <li key={i}>
//             {item.name} x {item.quantity} = ₹{item.price * item.quantity}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
