import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const query = request.nextUrl.searchParams.get("query");

  // Replace the uri string with your connection string.
  const uri =
    "mongodb+srv://khmevada2003:kushmevada@cluster0.mdswr3v.mongodb.net/";

  const client = new MongoClient(uri);

  try {
    const database = client.db("stock-db");
    const inventory = database.collection("inventory");

    //Aggregation query

    // Query for a movie that has the title 'Back to the Future'
    const products = await inventory
      .aggregate([
        {
          $match: {
            $or: [{ slug: { $regex: query, $options: "i" } }],
          },
        },
      ])
      .toArray();

    //   console.log(movie);
    return NextResponse.json({ success: true, products });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
