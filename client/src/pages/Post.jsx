import React from 'react'
import { useState, useEffect } from 'react';
import { getAllPosts } from '../api/postApi';
import PostCard from '../components/PostCard';
import { CiSearch } from "react-icons/ci";
import { Link, useNavigate } from 'react-router-dom';

export default function Post() {
  const [recentPosts, setRecentPost] = useState(null);
  const [userLogged, setUserlogged] = useState(localStorage.getItem('token'))
  // const [showMore,setShowMore] = useState(true);

  useEffect(() => {
    getAllPosts()
      .then((response) => setRecentPost(response.data))
      .catch((error) => console.log(error));
  }, []);

  // const handleShowMore = async () => { }
  const [isAdmin, setIsAdmin] = useState(true)
  const navigate = useNavigate();

  const handleUpdatePost = () => {
    navigate('/create-post')
  }

  return (
    <>
      <main className='p-3 flex flex-col min-h-screen max-w-7x items-center mx-auto'>
        <div className='text-5xl justify-center items-center pt-8'>
          <div className='flex justify-center items-center'>ROBOTIX CLUB BLOG</div>
          <div className="blogIcons flex justify-end gap-3">
            <Link
              className="px-4 py-2  bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200 left-0 text-base flex justify-center items-center"
              to='/search'
            >
              <CiSearch />
            </Link>
            <div className='flex items-center text-base justify-end'>
              {userLogged ? <button
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200 left-0"
                onClick={() => handleUpdatePost()}
              >
                +
              </button> : <div></div>}
            </div>
          </div>
          <div className="flex flex-wrap mt-5 max-w-7xl">
            {
              recentPosts && recentPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            }
          </div>
          {/* {showMore && (
            <button onClick ={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>Show More</button>
          )
          } */}
        </div>
      </main>
    </>
  )
}

// TODO:
//   1. Show More Functionality