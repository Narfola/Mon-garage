import express from "express";
import { authenticateToken } from "../src/middleware/auth";
import upload from "../src/middleware/upload";
import maintenanceActions from "../src/modules/maintenance/maintenanceAction";
import userActions from "../src/modules/user/userAction";
import vehicleActions from "../src/modules/vehicle/vehicleAction";

const router = express.Router();

router.post("/register", userActions.register);
router.post("/login", userActions.login);
router.post("/logout", userActions.logout);

router.get("/users", authenticateToken, userActions.browse);
router.get("/users/me", authenticateToken, userActions.me);
router.get(
	"/vehicles/:id_user",
	authenticateToken,
	vehicleActions.readbyUserId,
);
router.get("/vehicles/:immat", authenticateToken, vehicleActions.readbyImmat);

router.post(
	"/vehicles",
	authenticateToken,
	upload.single("image"),
	vehicleActions.create,
);

router.put(
	"/vehicles/:id_vehicle",
	upload.single("image"),
	authenticateToken,
	vehicleActions.update,
);

router.delete(
	"/vehicles/:id_vehicle",
	authenticateToken,
	vehicleActions.deleteVehicle,
);

router.get(
	"/maintenance/:id_vehicle",
	authenticateToken,
	maintenanceActions.readbyVehicleId,
);
router.post("/maintenance", authenticateToken, maintenanceActions.create);
router.put(
	"/maintenance/:id_maintenance",
	authenticateToken,
	maintenanceActions.update,
);
router.delete(
	"/maintenance/:id_maintenance",
	authenticateToken,
	maintenanceActions.deleteMaintenance,
);

export default router;
