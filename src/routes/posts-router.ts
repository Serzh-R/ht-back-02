import {NextFunction, Router, Request, Response} from 'express';
import {postsRepository} from '../repositories/posts-repository';
import {HTTP_STATUSES} from '../settings';
import {PostInputModel} from '../types/types';

export const postRouter = Router();

export const postController = {

    getPosts(req: Request, res: Response, next: NextFunction) {
        const posts = postsRepository.getPosts();
        res.status(HTTP_STATUSES.OK_200).json(posts);
    },

    createPost(req: Request, res: Response, next: NextFunction) {
        const postData: PostInputModel = req.body;

        // Validate the incoming data
        /*if (!postData.title || !postData.content || !postData.blogId) {
            return res.status(HTTP_STATUSES.BAD_REQUEST_400).json({ error: 'Title, content, and blogId are required.' });
        }*/

        try {
            const newPost = postsRepository.createPost(postData);
            res.status(HTTP_STATUSES.CREATED_201).json(newPost);
        } catch (error) {
            next(error);
        }
    },

    deletePost(req: Request, res: Response, next: NextFunction) {
        const postId = req.params.id;

        try {
            const isDeleted = postsRepository.deletePost(postId);
            if (isDeleted) {
                res.status(HTTP_STATUSES.NO_CONTENT_204).send();
            } else {
                res.status(HTTP_STATUSES.NOT_FOUND_404).json({ error: 'Post not found.' });
            }
        } catch (error) {
            next(error);
        }
    },
};

// Route definitions
postRouter.get('/', postController.getPosts);
postRouter.post('/', postController.createPost);
postRouter.delete('/:id', postController.deletePost);
