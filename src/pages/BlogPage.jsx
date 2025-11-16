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

  // Reading Time calc
  const getReadingTime = (html) => {
    const text = html.replace(/<[^>]+>/g, " ");
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(
          `https://bansaltimber.com/api/blogs/get_blog.php?slug=${slug}`
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

  // Inject SEO tags
  useEffect(() => {
    if (!blog) return;

    document.title = blog.meta_title || blog.title;

    const desc = blog.meta_description || blog.excerpt || "";

    let descTag = document.querySelector("meta[name='description']");
    if (!descTag) {
      descTag = document.createElement("meta");
      descTag.name = "description";
      document.head.appendChild(descTag);
    }
    descTag.content = desc;

    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `https://bansaltimber.com/blogs/${blog.slug}`;
  }, [blog]);

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

      <div className="mt-20 md:mt-32">
        <BlogHero title={blog.title} />
      </div>

      <MainContainer>

        <article className="prose max-w-none lg:prose-lg prose-img:rounded-xl prose-headings:font-semibold mt-8 md:mt-12">

          {/* Metadata First */}
          <div className="text-sm text-gray-500 mb-4">
            Published on{" "}
            {new Date(blog.published_at).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {" • "}
            {getReadingTime(blog.body)} min read
          </div>

          {/* Featured Image */}
          {blog.image && (
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full max-h-[500px] object-cover rounded-xl mb-6"
            />
          )}

          {/* Excerpt */}
          <p className="text-gray-500 italic mb-6">{blog.excerpt}</p>

          {/* Body */}
          <div className="mt-4 space-y-6" dangerouslySetInnerHTML={{ __html: blog.body }} />
        </article>

      </MainContainer>

      <MainContainer>
        <div className="mt-12">
          <BlogPageBanner />
        </div>
      </MainContainer>

      <Footer />
    </div>
  );
}

