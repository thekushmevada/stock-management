import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  // Replace the uri string with your connection string.
  const uri =
    "mongodb+srv://khmevada2003:kushmevada@cluster0.mdswr3v.mongodb.net/";

  const client = new MongoClient(uri);

  try {
    const database = client.db("stock-db");
    const inventory = database.collection("inventory");

    // Query for a movie that has the title 'Back to the Future'
    const query = {};
    const products = await inventory.find(query).toArray();

    //   console.log(movie);
    return NextResponse.json({ success:true, products });

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

export async function POST(request) {
  let body = await request.json();

  // Replace the uri string with your connection string.
  const uri =
    "mongodb+srv://khmevada2003:kushmevada@cluster0.mdswr3v.mongodb.net/";

  const client = new MongoClient(uri);

  try {
    const database = client.db("stock-db");
    const inventory = database.collection("inventory");

    const product = await inventory.insertOne(body);

    // console.log(movie);
    return NextResponse.json({ product, ok:true });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}


