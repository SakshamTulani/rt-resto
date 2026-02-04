import { Router } from "express";
import { categoriesRouter } from "./categories";
import { menuRouter } from "./menu";

const router: Router = Router();

// Mount route modules
router.use("/categories", categoriesRouter);
router.use("/menu", menuRouter);

export const apiRouter: Router = router;
