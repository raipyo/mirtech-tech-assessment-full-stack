import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "../utils/api";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      api.get(`/products?skip=${Number(id) - 1}&limit=1`).then((res) => {
        setProduct(res.data[0]);
      });
    }
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
    </div>
  );
}