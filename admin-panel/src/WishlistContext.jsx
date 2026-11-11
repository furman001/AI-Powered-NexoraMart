import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";




const WishlistContext = createContext(null);




export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);




  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem(
        "nexoramart-wishlist"
      );


      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);


        setWishlistItems(
          Array.isArray(parsedWishlist) ? parsedWishlist : []
        );
      }
    } catch (wishlistError) {
      console.error(
        "Could not load wishlist",
        wishlistError
      );


      setWishlistItems([]);
    }
  }, []);




  useEffect(() => {
    try {
      localStorage.setItem(
        "nexoramart-wishlist",
        JSON.stringify(wishlistItems)
      );
    } catch (wishlistError) {
      console.error(
        "Could not save wishlist",
        wishlistError
      );
    }
  }, [wishlistItems]);




  function addToWishlist(product) {
    if (!product || !product.id) {
      return;
    }


    setWishlistItems((currentItems) => {
      const alreadySaved = currentItems.some(
        (item) => item.id === product.id
      );


      if (alreadySaved) {
        return currentItems;
      }


      return [
        ...currentItems,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image_url: product.image_url,
          stock: product.stock,
        },
      ];
    });
  }




  function removeFromWishlist(productId) {
    setWishlistItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== productId
      )
    );
  }




  function isInWishlist(productId) {
    return wishlistItems.some(
      (item) => item.id === productId
    );
  }




  function clearWishlist() {
    setWishlistItems([]);
  }




  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}




export function useWishlist() {
  const context = useContext(WishlistContext);


  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }


  return context;
}