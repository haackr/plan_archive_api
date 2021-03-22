import { extendType, objectType } from "nexus";
import { isLoggedIn } from "../auth";

export const SheetsData = objectType({
  name: "Sheet",
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
    t.model.Sets();
    t.model.school_id();
    t.model.Schools();
  },
});

export const SheetQuery = extendType({
  type: "Query",
  definition(t) {
    t.crud.sheet();
    t.crud.sheets();
  },
});

export const SheetMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.crud.createOneSheet({ resolve: isLoggedIn });
    t.crud.deleteOneSheet({ resolve: isLoggedIn });
    t.crud.updateOneSheet({ resolve: isLoggedIn });
  },
});
