import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  Filter, 
  Search, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  XCircle 
} from "lucide-react";
import OfferCard from "../components/OfferCard";
import Navbar from "../components/Navbar";

const JobOffers = () => {
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const { user } = useAuth();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        setError(null);
        const userId = user?.userId;
        if (!userId) throw new Error("User ID is not available");
        const response = await fetch(`http://localhost:3500/offer/getOffer/${userId}`);
        const data = await response.json();
        const offs = data || [];
        setOffers(offs);
        setFilteredOffers(offs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user?.userId) {
      fetchOffers();
    }
  }, [user]);

  useEffect(() => {
    const filterOffers = () => {
      let filtered = offers;
      // Filter by Status
      if (filterStatus !== "All") {
        filtered = filtered.filter((offer) => offer.status === filterStatus);
      }
      // Search by userName
      if (searchQuery.trim() !== "") {
        filtered = filtered.filter((offer) =>
          offer.company.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      setFilteredOffers(filtered);
    };
    filterOffers();
  }, [filterStatus, searchQuery, offers]);

  const statusIcons = {
    Pending: <Clock className="text-amber-400" />,
    Accepted: <CheckCircle className="text-emerald-400" />,
    Rejected: <XCircle className="text-rose-400" />
  };

  const statusColors = {
    All: "bg-lavender-100 text-lavender-600",
    Pending: "bg-amber-50 text-amber-600",
    Accepted: "bg-emerald-50 text-emerald-600",
    Rejected: "bg-rose-50 text-rose-600"
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-center text-rose-500">{error}</div>;

  return (
    <div className="bg-lavender-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-10 mt-16">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-lavender-800 flex items-center gap-3">
              <Filter className="text-lavender-600" />
              My Job Offers
            </h1>
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterStatus("All");
              }}
              className="text-lavender-600 hover:bg-lavender-100 p-2 rounded-full transition-colors"
            >
              <RefreshCw />
            </button>
          </div>

          {/* Filters and Search */}
          <div className="flex justify-between items-center mb-8">
            {/* Status Filters */}
            <div className="flex space-x-4">
              {["All", "Pending", "Accepted", "Rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full 
                    transition-all duration-300 
                    ${filterStatus === status 
                      ? `${statusColors[status]} font-bold` 
                      : "text-gray-500 hover:bg-lavender-100"
                    }
                  `}
                >
                  {statusIcons[status] || <Filter className="text-lavender-400" />}
                  {status}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-lavender-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search offers by company"
                className="
                  w-full pl-10 pr-4 py-2 
                  border border-lavender-200 
                  rounded-full 
                  bg-lavender-50 
                  text-lavender-800 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-lavender-300
                "
              />
            </div>
          </div>

          {/* Offers Grid */}
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.length > 0 ? (
              filteredOffers.map((offer, idx) => (
                <OfferCard offer={offer} newStatus={offer.status} key={idx} />
              ))
            ) : (
              <div className="col-span-full text-center text-lavender-500 py-8">
                No offers found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobOffers;