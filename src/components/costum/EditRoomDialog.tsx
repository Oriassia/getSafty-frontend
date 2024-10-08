import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { AuthContext, IRoom } from "@/context/AuthContext";
import api from "@/services/api.services";
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

interface EditRoomDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function EditRoomDialog({ isOpen, onClose }: EditRoomDialogProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  const [room, setRoom] = useState<IRoom>();
  const [editedRoom, setEditedRoom] = useState<Partial<IRoom>>({});
  const authContext = useContext(AuthContext);
  const { toast } = useToast();

  if (!authContext) {
    throw new Error("RegisterPage must be used within an AuthProvider");
  }
  const { setUserRooms } = authContext;

  useEffect(() => {
    if (roomId) {
      fetchRoom(roomId);
    }
  }, [roomId]);

  async function fetchRoom(id: string) {
    try {
      const { data } = await api.get(`/room/${id}`);
      setRoom(data.room);
      setEditedRoom({
        accessible: data.room.accessible,
        available: data.room.available,
        capacity: data.room.capacity,
        description: data.room.description,
        isPublic: data.room.isPublic,
        title: data.room.title,
      });
    } catch (err) {
      console.error("Error fetching room:", err);
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedRoom((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange =
    (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target;
      setEditedRoom((prev) => ({ ...prev, [name]: checked }));
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await api.patch(`/room/${roomId}`, editedRoom);
      const updatedRoom = data.room;
      setUserRooms((prev: IRoom[]): IRoom[] =>
        prev.map((room) => (room._id === updatedRoom._id ? updatedRoom : room))
      );
      toast({
        title: "Room edited successfully.",
        description: "Your changes saved.",
        className: "bg-green-400 text-white border-none",
        duration: 3000,
      });
      onClose();
      // Optionally, refresh the room data or navigate
    } catch (err) {
      toast({
        title: "Error updating room",
        description: "Please check your fields again.",
        className: "bg-red-500 text-white border-none",
        duration: 3000,
      });
      console.error("Error updating room:", err);
    }
  };

  return (
    <>
      <Drawer open={isOpen} onClose={onClose}>
        <DrawerContent className="h-[95%] px-6 py-4">
          <ScrollArea>
            <form onSubmit={handleSubmit}>
              <DrawerHeader className="mb-4 border-b pb-2">
                <DrawerTitle className="text-xl font-semibold text-start">
                  Edit Shelter
                </DrawerTitle>
              </DrawerHeader>
              <DrawerDescription className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-lg font-medium text-gray-700"
                    >
                      Title
                    </label>
                    <Input
                      id="title"
                      name="title"
                      value={editedRoom.title}
                      onChange={handleInputChange}
                      placeholder="Title"
                      className="w-full text-[17px]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-lg font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      value={editedRoom.description}
                      onChange={handleInputChange}
                      placeholder="Description"
                      className="w-full text-[17px]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="capacity"
                      className="block text-lg font-medium text-gray-700"
                    >
                      Capacity
                    </label>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      value={editedRoom.capacity}
                      onChange={handleInputChange}
                      placeholder="Capacity"
                      className="w-full text-[17px]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="accessible"
                      checked={editedRoom.accessible}
                      onChange={handleCheckboxChange("accessible")}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <label htmlFor="accessible" className="text-lg">
                      Accessible
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="available"
                      checked={editedRoom.available}
                      onChange={handleCheckboxChange("available")}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <label htmlFor="available" className="text-lg">
                      Available
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={editedRoom.isPublic}
                      onChange={handleCheckboxChange("isPublic")}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <label htmlFor="isPublic" className="text-lg">
                      Public
                    </label>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="font-bold text-lg mb-2">
                    Other Details (Non-editable)
                  </h3>
                  <div className="text-lg space-y-1">
                    <p>
                      Address: {room?.address.street}, {room?.address.city}
                    </p>
                    <p>
                      Location: Lat {room?.location.lat}, Lng{" "}
                      {room?.location.lng}
                    </p>
                    <p>
                      Created: {new Date(room?.createdAt!).toLocaleString()}
                    </p>
                  </div>
                </div>
              </DrawerDescription>
              <DrawerFooter className="flex justify-end space-x-4 pt-4 border-t mt-4">
                <Button
                  type="submit"
                  className="bg-blue-600 text-white text-lg hover:bg-blue-700"
                >
                  Submit
                </Button>
                <DrawerClose>
                  <Button
                    className="text-lg"
                    onClick={onClose}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default EditRoomDialog;
