import { Route, Routes, useNavigate } from "react-router-dom";
import About from "./About";
import Footer from "./Footer";
import Header from "./Header";
import Home from "./Home";
import Missing from "./Missing";
import Nav from "./Nav";
import NewPost from "./NewPost";
import PostPage from "./PostPage";
// import Post from "./Post";
// import PostLayout from "./PostLayout";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import api from "./api/posts";
import EditPost from "./EditPost";
import useWindowSize from "./hooks/useWindowSize";

function App() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [editBody, setEditBody] = useState('');
  const navigate = useNavigate()
  const {width} = useWindowSize()
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        setPosts(response.data);
      } catch (err) {
        if (err.response) {
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else {
          console.log(`Error: ${err.message}`);
        }
      }
    }

    fetchPosts();
  }, [])


  useEffect(() => {
    const filteredResults = posts.filter((post) => 
    ((post.body).toLowerCase()).includes(search.toLowerCase()) 
     || ((post.title).toLowerCase()).includes(search.toLowerCase()));

    setSearchResult(filteredResults.reverse());
  }, [posts, search])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const newPost = { id, title: postTitle, datetime, body: postBody };
    try{
      const response = await api.post('/posts', newPost)
      const allPost = [...posts, response.data];
      setPosts(allPost);
      setPostTitle('');
      setPostBody('');
      navigate('/')
    } catch (err) {
        console.log(`Error: ${err.message}`);
      }
  }

  const handleEdit = async (id) => {
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const updatedPost = { id, title: editTitle, datetime, body: editBody };
    try{
      const response = await api.put(`/posts/${id}`, updatedPost);
      setPosts(posts.map(post => post.id === id ? { ...response.data } : post));
      setEditTitle('');
      setEditBody('');
      navigate('/')
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }

  const handledelete = async (id) => {
    try{
      await api.delete(`/posts/${id}`)
      const postList = posts.filter(post => post.id !== id);
      setPosts(postList);
      navigate('/')
    }catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }
  return (
    <div className="App">
      
      <Header title="Social Media" width={width} />
      <Nav 
        search={search}
        setSearch={setSearch}
      />
      <Routes>
      <Route path="/" element= {<Home 
        posts ={searchResult}/>} /> 
     <Route path ="/post"> 
     <Route index element = { <NewPost 
       handleSubmit={handleSubmit}
       postTitle={postTitle}
       setPostTitle={setPostTitle}
       postBody={postBody}
       setPostBody={setPostBody}
      />} />
     <Route path=":id" element= { <PostPage 
      posts = {posts}
      handledelete = {handledelete} /> } /> 
      </Route> 
    <Route path= "/edit/:id" element = {<EditPost
     posts={posts}
     handleEdit={handleEdit} 
     editBody={editBody}
     setEditBody ={setEditBody}
     editTitle={editTitle}
     setEditTitle={setEditTitle}/>}/> 
     <Route path="/about" element = { <About /> } />
     <Route path="*" element= { <Missing /> } />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;


 /* <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/postpage">PostPage</Link></li>
        </ul>
      </nav> 
      <Routes>
        <Route path="/" element= {<Home />} />
        <Route path="/about" element= {<About />} />
        <Route path="/newpost" element= {<NewPost />} />

        <Route path="/postpage" element ={<PostLayout />} >
        <Route index element= {<PostPage />} />

        <Route path=":id" element= {<Post />} />
        
        <Route path="newpost" element= {<NewPost />} />
        </Route>
        <Route path="*" element= {<Missing />} />
      </Routes>
      */