let db = {
    users: [
        {
            userId: 'd2i1rj2afj283afhap9',
            email: 'user@email.com',
            handle: 'user',
            createdAt: '2021-12-19T14:01:00.018Z',
            imageUrl: 'image/asdfea24rar32ra3/a2fa2f3afgrsfasd',
            bio: 'Hello, my name is user, nice to meet you!',
            website: 'https://user.com',
            location: 'Sofia, BG'
        }
    ],
    posts: [
        {
            userHandle: 'user',
            body: 'this is the post body',
            createdAt: '2021-12-18T14:01:00.018Z',
            likeCount: 5,
            commentCount: 2
        }
    ],
    comments: [
      {
        userHandle: 'user',
        postId: 'kdjsfgdksuufhgkdsufky',
        body: 'nice one mate!',
        createdAt: '2021-12-19T10:59:52.798Z'
      }
    ],
}

const userDetails = {
    // Redux data
    credentials: {
      userId: 'ALIHFEAF78578AFGAEGF1452FA',
      email: 'user@email.com',
      handle: 'user',
      createdAt: '2021-12-19T10:59:52.798Z',
      imageUrl: 'image/asdfea24rar32ra3/a2fa2f3afgrsfasd',
      bio: 'Hello, my name is user, nice to meet you!',
      website: 'https://user.com',
      location: 'Lonodn, UK'
    },
    likes: [
      {
        userHandle: 'user',
        postId: 'AGEAGAEaer532tqfe3TY'
      },
      {
        userHandle: 'user',
        postId: 'aeg523WR35yeFEAey4gr'
      }
    ]
  };