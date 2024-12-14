import {db} from '../db/db'
import {PostInputModel, PostViewModel} from '../types/types'

export const postsRepository = {

    getPosts() {
        return db.posts;
    },

    createPost(body: PostInputModel) {
        const newPost: PostViewModel = {
            id: (Date.now() + Math.random()).toString(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: db.blogs.find(blog => blog.id === body.blogId)?.name || 'Unknown Blog'
        };

        db.posts.push(newPost);
        return newPost;
    },

    deletePost(postId: string) {
        const postIndex = db.posts.findIndex(post => post.id === postId);

        if (postIndex === -1) {
            return false;
        }

        db.posts.splice(postIndex, 1);
        return true;
    }
};
