// import React, { useContext, useEffect, useState } from "react";
// import {
//   FaRegBookmark,
//   FaTimes,
//   FaWhatsapp,
//   FaWheelchair,
// } from "react-icons/fa";
// import { IoMdCheckmark } from "react-icons/io";
// import { useNavigate, useParams } from "react-router-dom";
// import api from "@/services/api.services";
// import Loader from "@/components/ui/Loader"; // Adjust the path based on your file structure
// import { AuthContext, IRoom, User } from "@/context/AuthContext"; // Adjust the path based on your file structure
// import { FaPhoneFlip } from "react-icons/fa6";

// const RoomPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>(); // Extract _id from the URL
//   const [room, setRoom] = useState<IRoom>();
//   const [favState, setFavState] = useState<boolean>(false);
//   const [owner, setOwner] = useState<User | null>(null);
//   const [formatedNumber, setFormatedNumber] = useState<string>("");
//   const nav = useNavigate();
//   const authContext = useContext(AuthContext);

//   // Ensure the user is logged in
//   useEffect(() => {
//     if (!authContext || !authContext.loggedInUser) {
//       nav("/login");
//     }
//   }, [authContext, nav]);

//   if (!authContext) {
//     return <div>Error: AuthContext is not available.</div>;
//   }

//   const { loggedInUser, favRooms = [], setFavRooms } = authContext;

//   // Use useEffect to check favorite status when favRooms or id changes
//   useEffect(() => {
//     if (favRooms && id) {
//       const isFavorite = favRooms.some((fav: IRoom) => fav._id === id);
//       setFavState(isFavorite);
//     }
//   }, [favRooms, id]);

//   async function getOwnerAndRoom() {
//     try {
//       const { data } = await api.get(`/room/${id}`);
//       setRoom(data.room);

//       if (loggedInUser) {
//         if (loggedInUser.phoneNumber.startsWith("0")) {
//           setFormatedNumber("972" + loggedInUser.phoneNumber.slice(1));
//         } else {
//           setFormatedNumber(loggedInUser.phoneNumber);
//         }
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   useEffect(() => {
//     getOwnerAndRoom();
//   }, []);

//   if (!room) {
//     return <Loader />;
//   }

//   const handleWhatsAppClick = () => {
//     if (formatedNumber !== "") {
//       window.open(`https://wa.me/${formatedNumber}`, "_blank");
//     }
//   };

//   const handlePhoneClick = () => {
//     if (formatedNumber !== "") {
//       window.open(`tel:${formatedNumber}`, "_blank");
//     }
//   };

//   async function toggleFav() {
//     if (!loggedInUser) return;

//     try {
//       const { data } = await api.patch(`/room/favorite/${id}`);

//       // Update the favorites array in the context
//       let updatedFavorites: any;
//       if (favRooms) {
//         if (data.state) {
//           updatedFavorites = [...favRooms, room];
//         } else {
//           updatedFavorites = favRooms.filter((fav: IRoom) => fav._id !== id);
//         }
//       } else if (data.this.state) {
//         updatedFavorites = [room];
//       } else {
//         updatedFavorites = [];
//       }

//       // Set the updated favorites array in the context
//       setFavRooms(updatedFavorites);

//       // Update the favState based on the updated favorites array
//       setFavState(data.state);
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
//         <button
//           onClick={() => {
//             nav(-1);
//           }}
//           className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//         >
//           <FaTimes /> {/* Use FaTimes for the close icon */}
//         </button>
//         <h2 className="text-2xl font-bold mb-4">{room.title}</h2>
//         {room.image && room.image.length > 0 && (
//           <img src={room.image[0]} alt={room.title} />
//         )}
//         <p className="text-gray-700 mb-4">{room.description}</p>
//         <div className="mt-4">
//           <h4 className="text-lg font-semibold">Address:</h4>
//           <p>{`${room.address.street}, ${room.address.city}, ${room.address.number}`}</p>
//           <p>{`Floor: ${room.address.floor || "1"}`}</p>
//           <p>{`Apartment: ${room.address.appartment || "0"}`}</p>
//         </div>
//         <div className="mt-4">
//           <h4 className="text-lg font-semibold">
//             Capacity: {room.capacity || 0} people
//           </h4>
//         </div>
//         <div className="mt-4">
//           <h4 className="text-lg font-semibold flex align-middle items-center gap-3">
//             Open: {room.available ? <IoMdCheckmark /> : <FaTimes />}
//           </h4>
//         </div>
//         <div className="mt-4">
//           <h4 className="text-lg font-semibold flex align-middle items-center gap-3">
//             <FaWheelchair />
//             Accessibility: {room.accessible ? <IoMdCheckmark /> : <FaTimes />}
//           </h4>
//         </div>
//         <div className="mt-4">
//           <h4 className="text-lg font-semibold flex align-middle items-center gap-3">
//             Public: {room.isPublic ? <IoMdCheckmark /> : <FaTimes />}
//           </h4>
//         </div>
//         <div>
//           {" "}
//           <h4>
//             Owner: {loggedInUser?.firstName + " " + loggedInUser?.lastName}
//           </h4>
//           <div className="flex items-center justify-between">
//             <div className="flex m-2 gap-3">
//               <FaWhatsapp
//                 className="largeIcon text-green-500 text-3xl cursor-pointer"
//                 onClick={handleWhatsAppClick}
//               />
//               <FaPhoneFlip
//                 className="largeIcon text-green-800 text-3xl cursor-pointer"
//                 onClick={handlePhoneClick}
//               />
//             </div>
//             <div className="m-2 text-2xl hover:cursor-pointer">
//               <FaRegBookmark
//                 onClick={toggleFav}
//                 className={favState ? ` text-orange-600` : `text-black`}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RoomPage;
