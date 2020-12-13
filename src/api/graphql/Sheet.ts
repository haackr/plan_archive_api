import { extendType, objectType } from "@nexus/schema";
import { isLoggedIn } from "../auth";

export const SheetsData = objectType({
  name: "SheetsData",
  definition(t) {
    t.model.Key();
    t.model.Sheet_Number();
    t.model.Title();
    t.model.Day();
    t.model.Month();
    t.model.Year();
    t.model.FilePathDWG();
    t.model.FilePathPDF();
    t.model.FilePathPNG();
    t.model.FilePathTIFF();
    t.model.SetKey();
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
