import { API } from "@/app/export";
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    let {action,slug,initialQuantity} = await request.json();
  
    // Replace the uri string with your connection string.
    const uri = API;
  
    const client = new MongoClient(uri);
  
    try {
        const database = client.db("stock-db");
        const inventory = database.collection("inventory");
        // create a filter for a movie to update
        const filter = { slug: slug };
        
        // create a document that sets the plot of the movie

        let newQuantity = action === "plus" ? (parseInt(initialQuantity) + 1) : (parseInt(initialQuantity) - 1) ;
        const updateDoc = {
          $set: {
            quantity: newQuantity
          },
        };
        const result = await inventory.updateOne(filter, updateDoc, {});

        return NextResponse.json({ success:true, message : `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)` });
      } finally {
        await client.close();
      }
}