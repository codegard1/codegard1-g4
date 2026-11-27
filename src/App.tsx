import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import {
  BlogListPage,
  PostsIndexPage,
  TagPostsPage,
  TagsIndexPage,
} from "./pages/BlogListPages";
import BlogPostPage from "./pages/BlogPostPage";
import { GalleryCollectionPage, GalleryIndexPage } from "./pages/GalleryPages";
import HomePage from "./pages/HomePage";
import MusicPage from "./pages/MusicPage";
import NotFoundPage from "./pages/NotFoundPage";
import SearchPage from "./pages/SearchPage";
import { BlackjackPage, ContactPage } from "./pages/StaticPages";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<Navigate to="/blog/1" replace />} />
          <Route path="/blog/posts" element={<PostsIndexPage />} />
          <Route path="/posts" element={<Navigate to="/blog/posts" replace />} />
          <Route path="/blog/tags" element={<TagsIndexPage />} />
          <Route path="/blog/tags/:tag" element={<TagPostsPage />} />
          <Route path="/blog/search" element={<SearchPage />} />
          <Route path="/blog/:page" element={<BlogListPage />} />
          <Route path="/gallery" element={<GalleryIndexPage />} />
          <Route path="/gallery/:collection" element={<GalleryCollectionPage />} />
          <Route path="/music" element={<MusicPage />} />
          <Route path="/blackjack" element={<BlackjackPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/collection" element={<Navigate to="/" replace />} />
          <Route path="/:slug" element={<BlogPostPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
