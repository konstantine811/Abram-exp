import Dexie, { Table } from "dexie";
import { IPlaceData } from "../models/server-data/place.model";

class ThreeDb extends Dexie {
  places!: Table<{ data: IPlaceData[]; timestamp: string }>;
  constructor() {
    super("threeDB");
    this.version(1)
      .stores({
        places: "++id, data, timestamp",
      })
      .upgrade(async () => {
        await db.places.clear();
        // If needed, handle migration logic here
        // You can adjust existing tables or migrate data if necessary
      });
  }
}

const db = new ThreeDb();
export default db;
