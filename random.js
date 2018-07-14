const MessageType = new GraphQLObjectType({
    name: 'Message',
    fields: () => ({
        id:{type:GraphQLID},
        author: {
            type: AuthorType,
            async resolve(parent, args) {
                if (parent.author.account === 'guard') {
                    return await queries.findEmployeeByEmployeeId(parent.author.id).then(guard => {
                        return {
                            username: `${guard.first_name} ${guard.last_name}`,
                            profile_picture: guard.profile_picture
                        }
                    })
                } else if (parent.author.account === 'admin') {
                    return {
                        username: 'Administrator',
                        profile_picture: 'default.jpg'
                    }
                }
            }
        },
    //other fields
    })
})