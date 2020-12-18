import { extendType, objectType } from "nexus";
import { isLoggedIn } from "../auth";

export const SetsData = objectType({
  name: "SetsData",
  definition(t) {
    t.model.Key();
    t.model.ID();
    t.model.Day();
    t.model.Month();
    t.model.Year();
    t.model.Title();
    t.model.LocationNumber();
    t.model.Type();
    t.model.SheetsData();
  },
});

export const SetQuery = extendType({
  type: "Query",
  definition(t) {
    t.crud.setsData();
  },
});

export const SetMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.crud.createOneSetsData({ resolve: isLoggedIn });
    t.crud.deleteOneSetsData({ resolve: isLoggedIn });
    t.crud.updateOneSetsData({ resolve: isLoggedIn });
  },
});
