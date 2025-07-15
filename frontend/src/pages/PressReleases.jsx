import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  User, 
  Eye, 
  ArrowRight, 
  Search,
  Megaphone,
  ExternalLink
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { api } from "../services/api";
import toast from "react-hot-toast";

export default function PressReleases() {
  const [pressReleases, setPressReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPressReleases();
  }, [currentPage]);

  const fetchPressReleases = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/blog/posts?post_type=press_release&page=${currentPage}&limit=12`);
      setPressReleases(response.data.posts);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error("Failed to fetch press releases:", error);
      toast.error("Failed to load press releases");
    } finally {
      setLoading(false);
    }
  };

  const handlePressReleaseClick = (slug) => {
    navigate(`/press-releases/${slug}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredPressReleases = pressReleases.filter(release =>
    release.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    release.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && pressReleases.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6">
              <Megaphone className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
              Press{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Releases
              </span>
            </h1>
            <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto">
              Stay updated with the latest news, announcements, and milestones 
              from Asasy and the technology transfer industry.
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search press releases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPressReleases.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-neutral-400 mb-4">
                <Megaphone className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No press releases found</h3>
              <p className="text-neutral-600">
                {searchTerm ? "Try adjusting your search terms" : "No press releases available yet"}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-8">
                {filteredPressReleases.map((release) => (
                  <article
                    key={release.id}
                    className="group cursor-pointer bg-white rounded-xl shadow-sm border border-neutral-200 hover:shadow-lg transition-all duration-300 p-8"
                    onClick={() => handlePressReleaseClick(release.slug)}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8">
                      {release.image_url && (
                        <div className="lg:w-1/3 mb-6 lg:mb-0">
                          <img
                            src={release.image_url}
                            alt={release.title}
                            className="w-full h-48 lg:h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      
                      <div className={`${release.image_url ? 'lg:w-2/3' : 'w-full'}`}>
                        <div className="flex items-center text-sm text-neutral-500 mb-3">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(release.published_at)}
                          <span className="mx-2">•</span>
                          <User className="h-4 w-4 mr-1" />
                          {release.author_name}
                          <span className="mx-2">•</span>
                          <Eye className="h-4 w-4 mr-1" />
                          {release.view_count} views
                        </div>
                        
                        <h2 className="text-2xl font-bold text-neutral-900 mb-3 group-hover:text-blue-600 transition-colors">
                          {release.title}
                        </h2>
                        
                        <p className="text-neutral-600 mb-4 line-clamp-2">
                          {release.description}
                        </p>
                        
                        <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                          Read Full Release
                          <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 border rounded-lg ${
                            currentPage === page
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}