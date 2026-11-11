import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";




const CartContext = createContext(null);




export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("nexoramart_cart");


      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Could not load cart", error);


      return [];
    }
  });




  useEffect(() => {
    try {
      localStorage.setItem(
        "nexoramart_cart",
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error("Could not save cart", error);
    }
  }, [cartItems]);




  function addToCart(product) {
    if (!product || !product.id) {
      return;
    }


    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === product.id
      );


      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }


      return [
        ...currentItems,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: Number(product.price || 0),
          image_url:
            product.image_url ||
            product.images?.[0] ||
            null,
          quantity: 1,
        },
      ];
    });
  }




  function removeFromCart(productId) {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== productId
      )
    );
  }




  function updateQuantity(productId, quantity) {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }


    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }




  function clearCart() {
    setCartItems([]);
  }




  const cartTotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price || 0) * item.quantity,
    0
  );


  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );




  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}




export function useCart() {
  const context = useContext(CartContext);


  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }


  return context;
}