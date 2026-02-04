import { Router } from "express";
import { categoriesRouter } from "./categories";
import { menuRouter } from "./menu";
import { ordersRouter } from "./orders";

const router: Router = Router();

// Mount route modules
router.use("/categories", categoriesRouter);
router.use("/menu", menuRouter);
router.use("/orders", ordersRouter);

export const apiRouter: Router = router;
