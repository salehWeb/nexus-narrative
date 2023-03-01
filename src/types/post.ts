export interface ICreatePostData {
    title: string
    content: string
    slug: string
    category: string
    description: string
    images: {
        base64: string
        preViewUrl: string
    }[]
    tags: string[]
    backgroundImage: {
        base64: string
    }
};

export interface IUpdatePostData {
    title: string
    content: string
    category: string
    images: {
        base64: string
        preViewUrl: string
    }[]
    tags: string[]
};


export interface IPostProps {
    backgroundImage: string;
    title: string;
    slug: string;
    description: string;
    createdAt: Date;
    author: {
      blogName: string;
    };
}


export interface IBLogProps {
    content: string;
    about: string;
    email: string;
    title: string;
    description: string;
    blogName: string;
    backgroundImage: string;
    name: string;
    AvatarUrl: string;
    createdAt: string;
    tags: {
        name: string;
    }[];
    category: string;
    postId: number;

    id: number;
    slug: string;
    posts: IPostProps[];
    PostsRelated: IPostProps[];
    authorId: number;
}

export type SortByType = "CreateAt" | "Views" | "Likes"
