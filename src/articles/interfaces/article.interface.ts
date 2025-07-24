export interface Author {
  username: string;
  bio: string | null;
  image: string | null;
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  author: Author;
}

export interface ArticleResponse {
  article: Article;
}

export interface DeleteArticleResponse {
  message: string;
}