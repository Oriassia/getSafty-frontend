import React, { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext"; // Adjust the path based on your project structure
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import SmallShelter from "@/components/SmallShelter";

function MyProfile() {
  const authContext = useContext(AuthContext);
  const nav = useNavigate();

  useEffect(() => {
    if (!authContext || !authContext.loggedInUser) {
      nav("/login");
    }
  }, [authContext, nav]);

  if (!authContext) {
    return <div>Error: AuthContext is not available.</div>;
  }

  const { loggedInUser, userRooms } = authContext;

  if (!loggedInUser) {
    return null; // Redirect handled in useEffect
  }

  return (
    <div className="w-[100dvw] h-[88dvh] p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
          My Profile
        </h2>
        <div className="flex items-center mb-6">
          <img
            src={loggedInUser.profilePic}
            alt={`${loggedInUser.firstName} ${loggedInUser.lastName}`}
            className="w-24 h-24 rounded-full object-cover mr-6"
          />
          <div>
            <p className="text-lg font-medium text-gray-700">
              <strong>Name:</strong>{" "}
              {`${loggedInUser.firstName} ${loggedInUser.lastName}`}
            </p>
            <p className="text-lg font-medium text-gray-700">
              <strong>Email:</strong> {loggedInUser.email}
            </p>
            <p className="text-lg font-medium text-gray-700">
              <strong>Phone:</strong> {loggedInUser.phoneNumber}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            Safe Rooms
          </h3>
          {userRooms && userRooms.length > 1 ? (
            <Carousel>
              <CarouselContent>
                {userRooms.map((room) => (
                  <CarouselItem key={room._id}>
                    <SmallShelter room={room} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : userRooms && userRooms.length == 1 ? (
            <SmallShelter room={userRooms[0]} />
          ) : (
            <p className="text-gray-600">No safe rooms available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
