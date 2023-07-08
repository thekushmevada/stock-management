"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [productForm, setProductForm] = useState({});
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdown, setDropdown] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/product");
      let rjson = await response.json();
      setProducts(rjson.products);
    };

    fetchProducts();
  }, [productForm]);

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productForm),
      });

      if (response.ok) {
        // Product added successfully, do something
        console.log("Product added successfully");

        setAlert("Your Product has been added successfully!!");
        setProductForm({});

        const timer = setTimeout(() => {
          setAlert("");
        }, 3000);
        return () => clearTimeout(timer);
      } else {
        // Handle error response
        console.error("Failed to add product");
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Failed to add product", error);
    }

    //Fetch all product again
    const response = await fetch("/api/product");
    let rjson = await response.json();
    setProducts(rjson.products);
    e.preventDefault();
  };

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const onDropDownEdit = async (e) => {
    let value = e.target.value;
    setQuery(value);

    if (value.length >= 2) {
      setLoading(true);
      setDropdown([]);
      const response = await fetch("/api/search?query=" + query);
      let rjson = await response.json();
      setDropdown(rjson.products);
      setLoading(false);
    }
    else{
      setDropdown([]);
    }
    
  };

  const buttonAction = async (action, slug, initialQuantity) => {
    // Immediatly change the quantity of the product with given slug in products
    let index = products.findIndex((item) => item.slug == slug);
    let newProducts = JSON.parse(JSON.stringify(products));

    if(action == "plus"){
      newProducts[index].quantity = parseInt(initialQuantity) + 1;
    }
    else{
      newProducts[index].quantity = parseInt(initialQuantity) - 1;
    }
    setProducts(newProducts);


    // Immediatly change the quantity of the product with given slug in dropdown
    let indexdrop = dropdown.findIndex((item) => item.slug == slug);
    let newDropDown = JSON.parse(JSON.stringify(dropdown));

    if(action == "plus"){
      newDropDown[indexdrop].quantity = parseInt(initialQuantity) + 1;
    }
    else{
      newDropDown[indexdrop].quantity = parseInt(initialQuantity) - 1;
    }
    setDropdown(newDropDown);


    //general code
    setLoading(true);

    const response = await fetch("/api/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({action , slug , initialQuantity}),
    });

    let rjson = await response.json();
    console.log(rjson);

    setLoading(false);
  };

  return (
    <>
      <Header />
      <div className="container my-6 mx-auto">
        <div className="text-green-600 text-center">{alert}</div>

        <h1 className="text-3xl font-bold mb-6">Search a product</h1>

        <div className="flex items-center mb-2">
          <input
            // onBlur={() => {
            //   setDropdown([]);
            // }}
            onChange={onDropDownEdit}
            type="text"
            placeholder="Enter a product name"
            className="px-4 py-2 border border-gray-300 mr-2 flex-grow"
          />

          <select className="px-4 py-2 border border-gray-300 ">
            <option value="all">All</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
            {/* Add more options as needed */}
          </select>
          {/* <button className="px-4 py-2 bg-blue-500 text-white">Search</button> */}
        </div>

        {loading && (
          <div className="flex justify-center items-center inset-0 absolute ">
            <LoadingSpinner />
          </div>
        )}

        <div className="dropcontainer absolute w-[72vw] border-1 bg-purple-100 rounded-md">
          {dropdown.map((item) => {
            return (
              <div
                key={item.slug}
                className="container flex justify-between p-2 my-1 border-b-2 "
              >
                <span className="slug">
                  {item.slug} ({item.quantity} available for ₹{item.price})
                </span>
                <div className="mx-5">
                  <button
                    onClick={() => buttonAction("minus", item.slug , item.quantity)}
                    disabled={loading}
                    className="subtract inline-block px-3 py-1 bg-purple-400 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-md cursor-pointer disabled:bg-purple-200"
                  >
                    -
                  </button>
                  <span className="quantity mx-3 inline-block min-w-3">
                    {item.quantity}{" "}
                  </span>
                  <button
                    onClick={() => buttonAction("plus", item.slug , item.quantity)}
                    disabled={loading}
                    className="add inline-block px-3 py-1 bg-purple-400 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-md cursor-pointer disabled:bg-purple-200"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Display Current Stock */}
      <div className="container my-6 mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add a Product</h1>

        <form>
          <div className="mb-4">
            <label htmlFor="productname" className="block mb-2">
              Product Slug
            </label>
            <input
              onChange={handleChange}
              type="text"
              name="slug"
              id="productname"
              value={productForm?.slug || ""}
              className="w-full border border-gray-300 px-4 py-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="quantity" className="block mb-2">
              Quantity
            </label>
            <input
              onChange={handleChange}
              type="number"
              name="quantity"
              id="quantity"
              value={productForm?.quantity || ""}
              className="w-full border border-gray-300 px-4 py-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block mb-2">
              Price
            </label>
            <input
              onChange={handleChange}
              type="number"
              name="price"
              id="price"
              value={productForm?.price || ""}
              className="w-full border border-gray-300 px-4 py-2"
            />
          </div>

          <button
            onClick={addProduct}
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            Add Product
          </button>
        </form>
      </div>

      <div className="container my-6  mx-auto">
        <h1 className="text-3xl font-bold mb-6">Display Current Stock</h1>

        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Price</th>
              {/* Add more table headers as needed */}
            </tr>
          </thead>
          <tbody>
            {/* Display stock items dynamically */}

            {products.map((product) => {
              return (
                <tr key={product.slug}>
                  <td className="border px-4 py-2">{product.slug}</td>
                  <td className="border px-4 py-2">{product.quantity}</td>
                  <td className="border px-4 py-2">₹{product.price}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Footer />
    </>
  );
}
