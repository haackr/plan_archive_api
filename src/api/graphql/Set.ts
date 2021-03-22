import { extendType, objectType } from "nexus";
import { isLoggedIn } from "../auth";

export const SetsData = objectType({
  name: "Set",
  definition(t) {
    t.model.Key();
    t.model.ID();
    t.model.Day();
    t.model.Month();
    t.model.Year();
    t.model.Title();
    t.model.LocationNumber();
    t.model.Type();
    t.model.Sheets();
    t.model.school_id();
    t.model.Schools();
  },
});

export const SetQuery = extendType({
  type: "Query",
  definition(t) {
    t.crud.set();
    t.crud.sets();
  },
});

export const SetMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.crud.createOneSet({ resolve: isLoggedIn });
    t.crud.deleteOneSet({ resolve: isLoggedIn });
    t.crud.updateOneSet({ resolve: isLoggedIn });
  },
});
