import {  useEffect, useState } from 'react';
import { MessageCircle, Search,  ThumbsUp, MessageSquare, Clock, Send, Award, Bookmark, BookOpen, X, ChevronUp, ChevronDown } from 'lucide-react';
import { CLIENT_API } from '../../utilities/axios/Axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { IDiscussion } from '../../types/IDiscussion';
import placeHolder from '../../assets/commonPages/placeHolder.png'

const DiscussionForum = () => {
  const {courseId} = useParams<{courseId: string}>();
  const [discussions, setDiscussions] = useState<IDiscussion[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('recent');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [page, setPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  const user = useSelector((state:RootState)=>state.auth.data)
  const [upvotedDiscussions, setUpvotedDiscussions] = useState<Set<string>>(new Set());
  const [newReplies, setNewReplies] = useState<{ [key: string]: string }>({});
  const [expandedDiscussions, setExpandedDiscussions] = useState<Set<string>>(new Set());
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    courseId,
    tags: ''
  });

 
  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await CLIENT_API.get('/discussion', {
          params: {
            courseId,
            search: searchQuery,
            sort: sortOption,
            page:1,
            limit: 10,
          },
        });
        console.log('response',response.data)
        if (response.data.success) {
          setDiscussions(response.data.discussions);
          setPage(page)
          // setTotalPages(response.data.pages);
        } else {
          toast.error('Failed to load discussions');
        }
      } catch (error) {
        console.error('Error fetching discussions:', error);
        toast.error('An error occurred while fetching discussions');
      }
    };

    if (courseId) {
      fetchDiscussions();
    }
  }, [courseId, searchQuery, sortOption, page]);


  // Handle upvote action
  const handleUpvote = async (discussionId: string) => {
    if (!user?._id) {
      toast.error('Please log in to upvote');
      return;
    }

    if (upvotedDiscussions.has(discussionId)) {
      toast.info('You have already upvoted this discussion');
      return;
    }

    try {
      const response = await CLIENT_API.patch(`/discussion/upvote/${discussionId}`);
      if (response.data.success) {
        // Update discussions state with new upvote count
        setDiscussions((prev) =>
          prev.map((d) =>
            d._id === discussionId ? { ...d, upvotes: (d.upvotes || 0) + 1 } : d
          )
        );
        // Mark discussion as upvoted
        setUpvotedDiscussions((prev) => new Set(prev).add(discussionId));
        toast.success('Upvoted successfully!');
      } else {
        toast.error('Failed to upvote discussion');
      }
    } catch (error) {
      console.error('Error upvoting discussion:', error);
      toast.error('An error occurred while upvoting');
    }
  };
 

  const toggleReplies = (discussionId: string) => {
    setExpandedDiscussions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(discussionId)) {
        newSet.delete(discussionId);
      } else {
        newSet.add(discussionId);
      }
      return newSet;
    });
  };

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = 
      discussion?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    

    
    return matchesSearch ;
  });

  // Sort discussions based on selected option
  const sortedDiscussions = [...filteredDiscussions].sort((a, b) => {
    if (sortOption === 'recent') {
      return new Date(b?.createdAt?? 0).getTime() - new Date(a?.createdAt ??0).getTime();
    } else if (sortOption === 'popular') {
      return (b.upvotes ??0) - (a.upvotes??0);
    } else if (sortOption === 'most-replies') {
      return (b.replies ??0) - (a.replies ??0);
    }
    return 0;
  });

  // Format date to relative time
  const formatRelativeTime = (dateString:Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };


  const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try { 
      const payload = {
        title: newPost.title,
        content: newPost.content,
        courseId, 
        tags: newPost.tags ? newPost.tags.split(',').map((tag) => tag.trim()) : [], 
        
      };

      // Make the API call
      const response = await CLIENT_API.post(
        '/discussion', payload,);
        console.log('response',response)
      // Handle success
      if (response.data.success) {
        setDiscussions((prev) => [response.data.discussion, ...prev]);
        toast.success('Discussion created successfully!');
        setShowCreateModal(false); 
        setNewPost({ title: '', content: '', courseId: '', tags: '' }); // Reset form
      
      }
    } catch (error:unknown) {
      const message =  'Failed to create discussion';
      toast.error(message);
      console.error('Error creating discussion:', error);
    }
  };


    const handleReplySubmit = async (e: React.FormEvent, discussionId: string) => {
      e.preventDefault();
      if (!user?._id) {
        toast.error('Please log in to reply');
        return;
      }
      const content = newReplies[discussionId]?.trim();
      if (!content) {
        toast.error('Reply content cannot be empty');
        return;
      }
  
      try {
        const response = await CLIENT_API.post(
          '/discussion/reply',
          { content, discussionId },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );
        if (response.data.success) {
          setDiscussions((prev) =>
            prev.map((d) => (d._id === discussionId ? response.data.discussion : d))
          );
          setNewReplies((prev) => ({ ...prev, [discussionId]: '' }));
          toast.success('Reply posted successfully!');
        } else {
          toast.error('Failed to post reply');
        }
      } catch (error: any) {
        console.error('Error posting reply:', error);
        toast.error(error.response?.data?.message || 'An error occurred while posting reply');
      }
    };


    // Calculate top contributors from discussions
  const topContributors = discussions
  .reduce((acc, discussion) => {
    const author = discussion.author;
    if (!author?._id) return acc;

    const existing = acc.find(c => c._id === author._id);
    if (existing) {
      existing.postCount += 1;
    } else {
      acc.push({
        _id: author._id,
        userName: author.userName || '',
        profile: { avatar: author?.profile?.avatar ?? placeHolder },
        postCount: 1,
      });
    }
    return acc;
  }, [] as { _id: string; userName: string; profile: { avatar?: string }; postCount: number }[])
  .sort((a, b) => b.postCount - a.postCount)
  .slice(0, 3);

      // Calculate dynamic stats
  const activeDiscussions = discussions.length;
  const solvedQuestions = discussions.filter(d => d.isResolved).length;
  return (
    <div className="flex min-h-screen bg-gray-50">
      
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Discussion Forum</h1>
              <p className="text-gray-600">Ask questions, share knowledge, and connect with other learners</p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start a Discussion
            </button>
          </div>
          
          
          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="most-replies">Most Replies</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Discussion List */}
          <div className="space-y-4">
            {sortedDiscussions.length > 0 ? (
              sortedDiscussions.map(discussion => (
                <div 
                  key={discussion._id} 
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className={`text-xs font-medium px-3 py-1 rounded-full ${discussion.isResolved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} mr-2`}>
                            {discussion.isResolved ? 'Solved' : 'Open'}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center">
                            <BookOpen className="w-3 h-3 mr-1" /> 
                            {discussion?.course?.title}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {discussion?.title}
                        </h3>
                        
                        <p className="text-gray-600 line-clamp-2 mb-3">
                          {discussion.content}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(discussion?.tags ?? []).map(tag => (
                            <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center">
                          <img 
                            src={discussion?.author?.profile?.avatar || placeHolder} 
                            alt={discussion.author?.userName} 
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <div className="mr-4">
                            <span className="text-sm font-medium text-gray-900 block leading-none">
                              {discussion.author?.userName}
                            </span>
                            {/* {discussion.author.badge && (
                              <span className="inline-flex items-center text-xs text-gray-500">
                                <Award className="w-3 h-3 mr-1 text-blue-500" />
                                {discussion.author.badge}
                              </span>
                            )} */}
                          </div>
                          {discussion?.createdAt &&(
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {/* {formatRelativeTime(discussion?.createdAt)} */}
                          </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center space-y-3 pl-4 ml-4 border-l border-gray-200">
                        <div className="flex flex-col items-center">
                        <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click navigation
                              handleUpvote(discussion._id);
                            }}
                            className={`flex items-center justify-center w-8 h-8 rounded-full ${
                              upvotedDiscussions.has(discussion._id)
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-blue-500 hover:bg-blue-50'
                            }`}
                          >
                            <ThumbsUp className="w-5 h-5" />
                          </button>
                          {/* <ThumbsUp className="w-5 h-5 text-blue-500" /> */}
                          <span className="text-sm font-medium">{discussion.upvotes}</span>
                          <span className="text-xs text-gray-500">Votes</span>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <MessageSquare className="w-5 h-5 text-green-500" />
                          <span className="text-sm font-medium">{discussion.replies}</span>
                          <span className="text-xs text-gray-500">Replies</span>
                        </div>
                      </div>
                    </div>


                            {/* Replies Toggle and List */}
                    <div className="mt-4">
                      <button
                        onClick={() => toggleReplies(discussion._id)}
                        className="flex items-center text-blue-600 hover:underline"
                      >
                        {expandedDiscussions.has(discussion._id) ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-1" />
                            Hide Replies ({discussion.replies})
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-1" />
                            Show Replies ({discussion.replies})
                          </>
                        )}
                      </button>

                      {expandedDiscussions.has(discussion._id) && (
                        <div className="mt-4">
                          {discussion.repliesList && discussion.repliesList.length > 0 ? (
                            discussion.repliesList.map((reply) => (
                              <div key={reply._id} className="border-t border-gray-200 pt-4 mt-4">
                                <div className="flex items-start">
                                  <img
                                    src={reply?.author?.profile?.avatar ?? placeHolder}
                                    alt={reply.author?.userName}
                                    className="w-6 h-6 rounded-full mr-2"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center mb-1">
                                      <span className="text-sm font-medium text-gray-900">
                                        {reply?.author?.userName}
                                      </span>
                                      <span className="text-xs text-gray-500 ml-2">
                                        <Clock className="w-3 h-3 inline mr-1" />
                                        {reply?.createdAt ? formatRelativeTime(new Date(reply.createdAt)) : 'Just now'}
                                      </span>
                                    </div>
                                    <p className="text-gray-600">{reply.content}</p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-600">No replies yet. Be the first to respond!</p>
                          )}

                          {/* Reply Form */}
                          <form
                            onSubmit={(e) => handleReplySubmit(e, discussion._id)}
                            className="mt-4"
                          >
                            <textarea
                              placeholder="Write your reply..."
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[80px]"
                              value={newReplies[discussion._id] || ''}
                              onChange={(e) =>
                                setNewReplies((prev) => ({ ...prev, [discussion._id]: e.target.value }))
                              }
                            />
                            <div className="flex justify-end mt-2">
                              <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                              >
                                <Send className="w-4 h-4 mr-2" />
                                Post Reply
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>


                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No discussions found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery ? 'Try adjusting your search or filters' : 'Be the first to start a discussion'}
                </p>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Start a Discussion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Create Discussion Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Start a New Discussion</h2>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleCreatePost}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    placeholder="What's your question or topic?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    placeholder="Provide details about your question or topic..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[150px]"
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                    <input
                      type="text"
                      placeholder="React, Redux, API"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={newPost.tags}
                      onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Post Discussion
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Quick Stats/Popular Tags Sidebar (hidden on small screens) */}
      <div className="hidden xl:block w-72 bg-white shadow-md p-6 h-screen sticky top-0 overflow-y-auto">
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-600 text-2xl font-bold">{activeDiscussions}</p>
              <p className="text-sm text-gray-600">Active Discussions</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-600 text-2xl font-bold">{solvedQuestions}</p>
              <p className="text-sm text-gray-600">Solved Questions</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-purple-600 text-2xl font-bold">128</p>
              <p className="text-sm text-gray-600">Community Members</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-orange-600 text-2xl font-bold">24h</p>
              <p className="text-sm text-gray-600">Avg Response Time</p>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Contributors</h3>
          <div className="space-y-3">
            {topContributors.length > 0 ? (
              topContributors.map((contributor) => (
                <div key={contributor._id} className="flex items-center p-2 rounded-lg hover:bg-gray-50">
                  <img
                    src={contributor.profile?.avatar || placeHolder}
                    alt={contributor.userName}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{contributor.userName}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Award className="w-3 h-3 mr-1 text-blue-500" />
                      <span>Contributor • {contributor.postCount} posts</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">No contributors yet.</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Bookmarked Discussions</h3>
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg flex items-start">
              <Bookmark className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-800">How to implement JWT authentication with Node.js and Express</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg flex items-start">
              <Bookmark className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-800">Best practices for responsive design in 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionForum;