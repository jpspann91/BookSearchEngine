import {gql} from '@apollo/client'

export const QUERY_ME = gql`
{
    me{
        _id
        username
        email
        savedBooks{
            bookId
            authoers
            image
            description
            title
            link
        }
    }
}
`;