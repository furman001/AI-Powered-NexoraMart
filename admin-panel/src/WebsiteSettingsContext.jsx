import { createContext, useContext, useEffect, useState } from "react";
import api from "./api";




const WebsiteSettingsContext = createContext(null);




export function WebsiteSettingsProvider({ children }) {
  const [siteSettings, setSiteSettings] = useState({
    site_name: "NexoraMart",
    logo_url: null,
  });




  async function loadSiteSettings() {
    try {
      const response = await api.get(
        "/settings/public"
      );



      setSiteSettings(response.data);
    } catch (settingsError) {
      console.error(settingsError);
    }
  }




  useEffect(() => {
    loadSiteSettings();
  }, []);




  return (
    <WebsiteSettingsContext.Provider
      value={{
        siteSettings,
        loadSiteSettings,
      }}
    >
      {children}
    </WebsiteSettingsContext.Provider>
  );
}




export function useWebsiteSettings() {
  const context = useContext(
    WebsiteSettingsContext
  );



  if (!context) {
    throw new Error(
      "useWebsiteSettings must be used inside WebsiteSettingsProvider"
    );
  }



  return context;
}