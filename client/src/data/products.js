/**
 * FarmFresh Product Data
 * Static product catalog for the e-commerce product listing.
 * Each product contains: id, name, price, image, category, description, unit, and organic flag.
 */

const products = [
  {
    id: 1,
    name: "Fresh Organic Tomatoes",
    price: 45,
    image: "/images/tomato.png",
    category: "vegetables",
    description: "Naturally grown, vibrant red tomatoes straight from the farm. Rich in vitamins and perfect for salads and curries.",
    unit: "kg",
    organic: true,
    farmer: "Ramesh Kumar",
    location: "Nashik, Maharashtra"
  },
  {
    id: 2,
    name: "Baby Spinach Leaves",
    price: 35,
    image: "/images/spinach.png",
    category: "vegetables",
    description: "Tender baby spinach leaves, harvested fresh daily. Loaded with iron, calcium, and antioxidants.",
    unit: "bunch",
    organic: true,
    farmer: "Sunita Devi",
    location: "Pune, Maharashtra"
  },
  {
    id: 3,
    name: "Alphonso Mangoes",
    price: 320,
    image: "/images/mango.png",
    category: "fruits",
    description: "Premium Alphonso mangoes, the king of fruits. Sweet, aromatic, and bursting with tropical flavor.",
    unit: "dozen",
    organic: false,
    farmer: "Vijay Patil",
    location: "Ratnagiri, Maharashtra"
  },
  {
    id: 4,
    name: "Basmati Rice Premium",
    price: 150,
    image: "/images/rice.png",
    category: "grains",
    description: "Long-grain premium basmati rice with a rich aroma. Perfect for biryanis, pulao, and everyday meals.",
    unit: "kg",
    organic: false,
    farmer: "Anil Sharma",
    location: "Dehradun, Uttarakhand"
  },
  {
    id: 5,
    name: "Farm Fresh Milk",
    price: 65,
    image: "/images/milk.png",
    category: "dairy",
    description: "Pure, pasteurized cow milk delivered fresh from the farm every morning. No added preservatives.",
    unit: "litre",
    organic: true,
    farmer: "Gopal Singh",
    location: "Anand, Gujarat"
  },
  {
    id: 6,
    name: "Wild Forest Honey",
    price: 450,
    image: "/images/honey.png",
    category: "herbs",
    description: "100% pure wild forest honey, unprocessed and unfiltered. Natural sweetener packed with health benefits.",
    unit: "500g jar",
    organic: true,
    farmer: "Tribal Collective",
    location: "Coorg, Karnataka"
  }
];

export default products;
