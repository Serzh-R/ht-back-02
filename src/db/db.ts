import { DBType } from "../types/types"

export const db: DBType = {
  blogs: [
    {
      id: "1",
      name: "Serzh",
      description: "description",
      websiteUrl: "https://live.com",
      createdAt: new Date().toISOString(),
      isMembership: false,
    },
  ],
  posts: [
    {
      id: "1",
      title: "Back",
      shortDescription: "shortDescription",
      content: "content",
      blogId: "1",
      blogName: "Serzh",
      createdAt: new Date().toISOString(),
    },
  ],
}

export const setDB = (dataset?: Partial<DBType>) => {
  if (!dataset) {
    db.blogs = []
    db.posts = []
    return
  }

  db.blogs = dataset.blogs || db.blogs
  db.posts = dataset.posts || db.posts
}

////////////////////////////////////////////////////////////

/*export const blog: BlogViewModelType = {
  id: "1",
  name: "live",
  description: "beautiful",
  websiteUrl: "https://live.com",
  createdAt: new Date().toISOString(),
  isMembership: false,
}*/

/*export const post: PostViewModelType = {
  id: "2",
  title: "Back",
  shortDescription: "beautiful",
  content: "belissimo",
  blogId: "1",
  blogName: "live",
  createdAt: new Date().toISOString(),
}*/
