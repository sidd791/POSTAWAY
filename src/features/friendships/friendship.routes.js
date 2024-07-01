import { Router } from "express";
import {
  getPendingRequests,
  getUserFriends,
  respondToRequest,
  toggleFriendship,
} from "./friendship.controller.js";
import jwtVerify from "../../middlewares/jwtAuth.js";

export const friendshipRouter = Router();

friendshipRouter.route("/get-friends/:userId").get(jwtVerify, getUserFriends);
friendshipRouter
  .route("/get-pending-requests")
  .get(jwtVerify, getPendingRequests);
friendshipRouter
  .route("/toggle-friendship/:friendId")
  .get(jwtVerify, toggleFriendship);
friendshipRouter
  .route("/response-to-request/:friendId")
  .get(jwtVerify, respondToRequest);
