import { TextInput, Select, Button } from 'flowbite-react'
import React, { useEffect, useState } from 'react'

import { useNavigate, useLocation } from 'react-router-dom'
import PostCard from '../components/PostCard';
import "../styles/Search.css"
import { getAllPosts, getPost, getQueryLimitPost } from "../api/postApi"

export default function Search() {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarData, setSiderbarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'all'
    })
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(true);
    const [limit, setLimit] = useState(10);
    const [limitPost, setLimitPost] = useState([]);
    const [sort, setSort] = useState(1);
    const [category, setcategory] = useState("all");


    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);

        const serachTermFromUrl = urlParams.get('searchTerm');
        const sortFromUrl = urlParams.get('sort');
        const categoryFromUrl = urlParams.get('category');
        if (serachTermFromUrl || sortFromUrl || categoryFromUrl) {
            setSiderbarData({
                ...sidebarData,
                searchTerm: serachTermFromUrl,
                sort: sortFromUrl,
                category: categoryFromUrl
            })
        }
        const fetchPost = async () => {
            setLoading(true);
            const serachQuery = urlParams.toString();
            console.log(serachQuery);
            const res = await fetch(`/api/post/getposts?${serachQuery}`);
            if (!res.ok) {
                setLoading(false);
                return;
            }
            else {
                const data = await res.json();
                setPosts(data.posts);
                setLoading(false);
                if (data.post < 9) {
                    setShowMore(false);
                }
                else {
                    setShowMore(true);
                }
            }

        }
        fetchPost();
    }, [location.search]);

    useEffect(() => {
        const fetchLimitPost = async () => {
            const res = await getQueryLimitPost(limit);
            console.log(res);
            setLimitPost(res.data);
        }
        fetchLimitPost();
    }, [])


    const handleChange = (e) => {
        if (e.target.id == 'searchTerm') {
            setSiderbarData({ ...sidebarData, searchTerm: e.target.value });

        }
        if (e.target.id === 'sort') {
            const order = e.target.value || 'desc';
            setSiderbarData({ ...sidebarData, sort: order })
        }
        if (e.target.id === 'category') {
            const category = e.target.value === "null" ? '' : e.target.value;
            setSiderbarData({ ...sidebarData, category: category })
        }
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);

        urlParams.set('term', sidebarData.searchTerm);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('category', sidebarData.category === "null" ? 'all' : sidebarData.category);
        const searchQuery = urlParams.toString();
        console.log(searchQuery)
        // console.log();

        navigate(`/search?${searchQuery}`);
    }

    const handleShowMore = async () => {
        const startIndex = posts.length;
        try {
            const res = await fetch(`/api/post/getposts?startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setPosts((prev) => [...prev, ...data.posts]);
                if (data.posts.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className='search flex flex-col md:flex-row'>
            <div className='p-7 border-t border-b md:border-r md:min-h-screen border-gray-500'>
                <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>Search Term: </label>
                        <TextInput placeholder='Serach..' id='searchTerm' style={{ "padding": "0.5rem" }} type='text' value={sidebarData.searchTerm} onChange={handleChange} />
                    </div>
                    <div className='flex items-center gap-2'>
                        <label htmlFor="" className='whitespace-nowrap font-semibold'>Sort:</label>
                        <Select onChange={handleChange} value={sidebarData.sort} id='sort' style={{ padding: "0.5rem" }}>
                            <option value="desc">Latest</option>
                            <option value="asc">Oldest</option>
                        </Select>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label htmlFor="" className='whitespace-nowrap font-semibold'>Category:</label>
                        <Select onChange={handleChange} value={sidebarData.category} id='category' style={{ padding: "0.5rem" }}>
                            <option value="" className='p-4'>Select a Category</option>
                            <option value="uncategorized">Uncategorized</option>
                            <option value="sports">Sports</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="raipur">Raipur</option>
                            <option value="bilaspur">Bilaspur</option>
                            <option value="india">india</option>
                            <option value="foregin">foregin</option>
                        </Select>

                    </div>
                    <button type='submit' className='text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-base px-5 py-2.5 text-center my-5 dark:bg-blue-600 dark:hover:bg-blue-700 mx-2 dark:focus:ring-blue-800' onClick={handleSubmit}>Search</button>
                </form>
            </div>



            <div className='w-full'>
                <h1 className='text-3xl font-semibold sm: bodrder-b border-gray=500 p-3 mt-5'>POST RESULTS:</h1>
                <div className="p-7 flex flex-wrap max-w-7xl">
                    {
                        !loading && posts.length === 0 && (<p className='text-xl text-gray-500'>No Post found.</p>)
                    }
                    {
                        posts.length == 0 && (
                            <div className="flex flex-wrap mt-5 max-w-7xl">
                                {
                                    limitPost && limitPost.map((post) => (
                                        <PostCard key={post._id} post={post} />
                                    ))
                                }
                            </div>

                        )
                    }
                    {
                        !loading && posts && posts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))
                    }
                    {
                        showMore && <button className='text-teal-500 text-lg hover:underline p-7 w-full' onClick={handleShowMore}>show more</button>
                    }
                </div>
            </div>
        </div>
    )
}