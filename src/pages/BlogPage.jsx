import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import BlogHero from "../components/BlogHero.jsx";
import MainContainer from "../components/Containers/MainContainer.jsx";
import BlogPageBanner from "../components/BlogPageBanner.jsx";

export default function BlogPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(
          `https://bansaltimber.com/api/get_blog.php?slug=${slug}`
        );

        if (!res.ok) throw new Error("Blog not found or server error");

        const data = await res.json();
        setBlog(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, [slug]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        Loading blog...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <div className="bg-white text-gray-900">
      <Navbar />

      {/* Hero: add top margin so it's not behind navbar */}
      <div className="mt-20 md:mt-32">
        <BlogHero title={blog.title} />
      </div>

      <MainContainer>
        <article className="prose max-w-none lg:prose-lg prose-img:rounded-xl prose-headings:font-semibold mt-8 md:mt-12">
          {/* Blog featured image */}
          {blog.image && (
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full max-h-[500px] object-cover rounded-xl mb-6"
            />
          )}

          {/* Excerpt */}
          <p className="text-gray-500 italic mb-6">{blog.excerpt}</p>

          {/* Body (main content) */}
          <div
            className="mt-4 space-y-6"
            dangerouslySetInnerHTML={{ __html: blog.body }}
          />

          {/* Metadata */}
          <div className="mt-8 text-sm text-gray-400">
            Published on:{" "}
            {new Date(blog.published_at).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </article>
      </MainContainer>

      {/* Banner above footer */}
      <MainContainer>
        <div className="mt-12">
          <BlogPageBanner />
        </div>
      </MainContainer>

      <Footer />
    </div>
  );
}

