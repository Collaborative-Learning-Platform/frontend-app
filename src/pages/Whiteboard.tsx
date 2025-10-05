
import { useParams } from "react-router-dom";
import SimpleWhiteboard from "../components/Whiteboard";

export default function WhiteboardPage() {
  const { roomId } = useParams<{ roomId: string }>();

  if (!roomId) {
    return <div>Invalid room ID</div>;
  }

  return (
    <SimpleWhiteboard
      roomId={roomId}
      // sessionId={`user-${Date.now()}`}
      // wsUrl="ws://localhost:8080"
    />
  );
}
