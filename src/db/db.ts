import { BlogViewModelType, DBType, PostViewModelType } from "../types/types"

export const db: DBType = {
  blogs: [
    {
      id: "1",
      name: "Serzh",
      description: "description",
      websiteUrl: "https://live.com",
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
    },
  ],
}

/*export const blog: BlogViewModelType = {
  id: "1",
  name: "live",
  description: "beautiful",
  websiteUrl: "https://live.com",
}

export const post: PostViewModelType = {
  id: "2",
  title: "Back",
  shortDescription: "beautiful",
  content: "belissimo",
  blogId: "1",
  blogName: "live",
}*/

// функция для быстрой очистки/заполнения базы данных для тестов
export const setDB = (dataset?: Partial<DBType>) => {
  if (!dataset) {
    // если в функцию ничего не передано - то очищаем базу данных
    db.blogs = []
    db.posts = []
    return
  }

  // если что-то передано - то заменяем старые значения новыми
  db.blogs = dataset.blogs || db.blogs
  db.posts = dataset.posts || db.posts
}
