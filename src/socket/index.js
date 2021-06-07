import io from "socket.io-client";
import { bobcoinNode } from "../config";

const socket = io(bobcoinNode);

export default socket;
