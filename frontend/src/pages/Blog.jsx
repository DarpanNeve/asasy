import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  User, 
  Eye, 
  ArrowRight, 
  Search,
  Filter,
  Star,
  Clock
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { api } from "../services/api";
import toast from "react-hot-toast";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    fetchFeaturedPosts();
  }, [currentPage]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/blog/posts?post_type=blog&page=${currentPage}&limit=9`);
      setPosts(response.data.posts);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedPosts = async () => {
    try {
      const response = await api.get("/blog/posts?post_type=blog&featured_only=true&limit=3");
      setFeaturedPosts(response.data.posts);
    } catch (error) {
      console.error("Failed to fetch featured posts:", error);
    }
  };

  const handlePostClick = (slug) => {
    navigate(`/blog/${slug}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && posts.length === 0) {
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
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
              Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto">
              Insights, trends, and expert perspectives on technology transfer, 
              innovation commercialization, and the future of research.
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-12">
              <Star className="h-6 w-6 text-yellow-500 mr-2" />
              <h2 className="text-3xl font-bold text-neutral-900">Featured Articles</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <article
                  key={post.id}
                  className="group cursor-pointer bg-white rounded-xl shadow-sm border border-neutral-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => handlePostClick(post.slug)}
                >
                  {post.image_url && (
                    <div className="aspect-w-16 aspect-h-9 mb-4">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-t-xl"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-neutral-500 mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(post.published_at)}
                      <span className="mx-2">•</span>
                      <User className="h-4 w-4 mr-1" />
                      {post.author_name}
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-neutral-600 mb-4 line-clamp-3">
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-neutral-500">
                        <Eye className="h-4 w-4 mr-1" />
                        {post.view_count} views
                      </div>
                      <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-12">Latest Articles</h2>
          
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-neutral-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No articles found</h3>
              <p className="text-neutral-600">
                {searchTerm ? "Try adjusting your search terms" : "No blog posts available yet"}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="group cursor-pointer bg-white rounded-xl shadow-sm border border-neutral-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    onClick={() => handlePostClick(post.slug)}
                  >
                    {post.image_url && (
                      <div className="aspect-w-16 aspect-h-9 mb-4">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-t-xl"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center text-sm text-neutral-500 mb-3">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(post.published_at)}
                        <span className="mx-2">•</span>
                        <User className="h-4 w-4 mr-1" />
                        {post.author_name}
                      </div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-neutral-600 mb-4 line-clamp-3">
                        {post.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-neutral-500">
                          <Eye className="h-4 w-4 mr-1" />
                          {post.view_count} views
                        </div>
                        <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                          Read More
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