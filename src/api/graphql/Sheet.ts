import { extendType, objectType } from "nexus";
import { isLoggedIn } from "../auth";

export const SheetsData = objectType({
  name: "SheetsData",
  definition(t) {
    t.model.id();
    t.model.Sheet_Number();
    t.model.Title();
    t.model.Day();
    t.model.Month();
    t.model.Year();
    t.model.FilePathDWG();
    t.model.FilePathPDF();
    t.model.FilePathPNG();
    t.model.FilePathTIFF();
    t.model.set_id();
    t.model.SetsData();
  },
});

export const SheetQuery = extendType({
  type: "Query",
  definition(t) {
    t.crud.sheetsData();
  },
});

export const SheetMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.crud.createOneSheetsData({ resolve: isLoggedIn });
    t.crud.deleteOneSheetsData({ resolve: isLoggedIn });
    t.crud.updateOneSheetsData({ resolve: isLoggedIn });
  },
});
