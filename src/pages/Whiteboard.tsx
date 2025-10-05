
import { useParams } from "react-router-dom";
import Whiteboard from "../components/Whiteboard";

export default function WhiteboardPage() {
  const { roomId } = useParams<{ roomId: string }>();

  if (!roomId) {
    return <div>Invalid room ID</div>;
  }

  return (
    <Whiteboard
      roomId={roomId}
    />
  );
}
