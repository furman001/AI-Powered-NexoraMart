import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";
import { useWebsiteSettings } from "./WebsiteSettingsContext";




export default function WebsiteSettingsPage() {
  const [siteName, setSiteName] = useState("");
  const [logoUrl, setLogoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { loadSiteSettings } = useWebsiteSettings();




  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await api.get(
          "/settings/public"
        );



        setSiteName(response.data.site_name);
        setLogoUrl(response.data.logo_url);
      } catch (loadError) {
        setError(
          loadError.response?.data?.detail ||
            "Could not load website settings"
        );
      } finally {
        setLoading(false);
      }
    }



    loadSettings();
  }, []);




  async function handleUpdateName(event) {
    event.preventDefault();



    setError("");
    setSuccess("");
    setSaving(true);



    try {
      const response = await api.patch(
        "/settings/admin/update",
        {
          site_name: siteName,
        }
      );



      setSiteName(response.data.site_name);
      setSuccess(
        "Website name updated successfully."
      );
      await loadSiteSettings();
    } catch (updateError) {
      setError(
        updateError.response?.data?.detail ||
          "Could not update website name"
      );
    } finally {
      setSaving(false);
    }
  }




  async function handleLogoUpload(event) {
    const file = event.target.files[0];



    if (!file) return;



    setError("");
    setSuccess("");
    setUploading(true);



    const formData = new FormData();
    formData.append("file", file);



    try {
      const response = await api.post(
        "/settings/admin/logo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );



      setLogoUrl(response.data.logo_url);
      setSuccess("Logo uploaded successfully.");
      await loadSiteSettings();
    } catch (uploadError) {
      setError(
        uploadError.response?.data?.detail ||
          "Could not upload logo"
      );
    } finally {
      setUploading(false);
    }
  }




  async function handleDeleteLogo() {
    const confirmed = window.confirm(
      "Are you sure you want to delete the website logo?"
    );



    if (!confirmed) return;



    setError("");
    setSuccess("");



    try {
      const response = await api.delete(
        "/settings/admin/logo"
      );



      setLogoUrl(response.data.logo_url);
      setSuccess("Logo deleted successfully.");
      await loadSiteSettings();
    } catch (deleteError) {
      setError(
        deleteError.response?.data?.detail ||
          "Could not delete logo"
      );
    }
  }




  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-white">
        Loading website settings...
      </div>
    );
  }




  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            to="/dashboard"
            className="text-2xl font-black"
          >
            NexoraMart Admin
          </Link>


          <Link
            to="/dashboard"
            className="rounded-xl bg-white/10 px-5 py-2 font-semibold text-white transition hover:bg-white/20"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>




      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-purple-400 bg-clip-text text-4xl font-black text-transparent">
          Website Settings
        </h1>



        <p className="mt-3 text-slate-400">
          Change your website name and manage the logo displayed on the
          customer storefront.
        </p>



        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}



        {success && (
          <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300">
            {success}
          </div>
        )}




        <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h2 className="text-2xl font-black text-white">
            Website Name
          </h2>



          <form
            onSubmit={handleUpdateName}
            className="mt-6 space-y-5"
          >
            <input
              value={siteName}
              onChange={(event) =>
                setSiteName(event.target.value)
              }
              placeholder="Enter website name"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
              required
            />


            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-fuchsia-600 py-4 font-bold text-white transition hover:scale-[1.02] disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : "Update Website Name"}
            </button>
          </form>
        </section>




        <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h2 className="text-2xl font-black text-white">
            Website Logo
          </h2>



          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Website logo"
                className="size-28 rounded-2xl border border-white/10 object-cover"
              />
            ) : (
              <div className="flex size-28 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl font-black">
                N
              </div>
            )}


            <div className="w-full">
              <label className="mb-2 block text-sm font-bold text-slate-300">
                Upload or change logo
              </label>


              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleLogoUpload}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-600 file:px-5 file:py-2 file:font-bold file:text-white"
              />


              <p className="mt-3 text-xs text-slate-500">
                Supported formats: JPG, PNG, WEBP, and SVG.
              </p>
            </div>
          </div>



          <button
            type="button"
            onClick={handleDeleteLogo}
            disabled={!logoUrl}
            className="mt-6 w-full rounded-2xl bg-red-600/20 py-3 font-bold text-red-300 transition hover:bg-red-600/30 disabled:opacity-40"
          >
            Delete Logo
          </button>
        </section>
      </main>
    </div>
  );
}