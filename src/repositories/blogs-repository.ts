import {blog, db} from '../db/db';
import {BlogInputModel, BlogViewModel} from '../types/types';

export const blogsRepository = {

    getBlogs() {
        return db.blogs
    },

    createBlog(body: BlogInputModel) {
        const newBlog: BlogViewModel = {
            id: (Date.now() + Math.random()).toString(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
        }

        db.blogs.push(newBlog)
        return newBlog
    },

    deleteBlog(blogId: string) {
        const blogIndex = db.blogs.findIndex(blog => blog.id === blogId);

        if (blogIndex === -1) {
            return false;
        }

        db.blogs.splice(blogIndex, 1);
        return true;
    }
}