export interface CreatePostMediaItemDto {
    url: string;
    mimeType: string;
}

export interface CreatePostWithMediaRequestDto {
    siteId: string;
    title: string;
    body: string;
    media: Array<CreatePostMediaItemDto>;
}

