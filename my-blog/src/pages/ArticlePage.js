import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useUser from "../hooks/useUser";
import axios from 'axios';
import articles from "./article-content";
import PageNotFound from "./PageNotFound";
import CommentsList from "../components/CommentsList";
import AddCommentForm from '../components/AddCommentForm';

const ArticlePage = () => {
  const [ articleInfo , setArticleInfo ] = useState({upvotes: 0, comments: [], canUpvote: false});
  const { canUpvote } = articleInfo;
  const params = useParams();
  const { user, isLoading } = useUser();
  const { articleId } = params;
  const article = articles.find(article => article.name === articleId);

  useEffect(() => {
    const loadArticleInfo = async () => {
      const token = user && await user.getIdToken();
      const headers = token ? {authToken: token} : {};
      const response = await axios.get(`/api/articles/${articleId}`, {
        headers
      });
      const newArticleInfo = response.data;
      setArticleInfo(newArticleInfo);
    }
    if (!isLoading) {
      loadArticleInfo();
    }
  }, [user, isLoading])

  const addUpvote = async () => {
    const token = user && await user.getIdToken();
    const headers = token ? {authToken: token} : {};
    const response = await axios.put(`/api/articles/${articleId}/upvote`, null,  {
      headers
    });
    const updatedArticle = response.data;
    setArticleInfo(updatedArticle)
  }

  if (!article) {
    return <PageNotFound />
  }

  return (
    <>
    <h1>{article.title}</h1>
    <div className="upvotes-section">
      {user ? 
      <>
        <button onClick={addUpvote}>{canUpvote ? 'Upvote' : 'Already upvoted'}</button>
        <p>This article has {articleInfo.upvotes} upvote(s)</p>
      </>
      : <button>Login to upvote</button>
      }
    </div>
    {article.content.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
    ))}
    { user ?  
    <AddCommentForm articleName={articleId} onArticleUpdated={updatedArticle => setArticleInfo(updatedArticle)}/>
    : <button>Login to upvote</button> }
    <CommentsList comments={articleInfo.comments} />
    </>
  );
};

export default ArticlePage;
