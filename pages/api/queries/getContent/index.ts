import { gql } from '@apollo/client'
import { createApolloClient } from '../../../../utility/GraphQLApolloClient'
import { AllSevensResponse, Seven, SevenResponse } from '../../../../interfaces/seven';


const contentQuery = gql`
    query{
     allSitecoreseven{
      results{
        id
        title
        description
        media
     }
    }
   } 
`

export const getAllSevens = async (): Promise<Partial<Seven>[] | null> => {
  try {
  const myclient = createApolloClient(false).getClient()
  const  results : AllSevensResponse = (await myclient.query({ query: contentQuery })) as AllSevensResponse
  
  const sevens: Partial<Seven>[] = [];
    results.data.allSitecoreseven.results.forEach((seven: Partial<Seven>) => {
    sevens.push({
      id: seven.id,
      title: seven.title,
      description: seven.description,
      media: seven.media,
    });
  });

  return sevens;
}  catch {
    return null;
    }
  }

  const getSevenByIdQuery = (id: string) =>{
    return gql`
    query{
      sitecoreseven(id: "${id}"){ 
        id
        title
        description
        media
     }
    } 
`
  }

  export const getSevenById = async (id: string): Promise<Partial<Seven> | null> => {
    try {
      const myclient = createApolloClient(false).getClient()
      const sevenResponse: SevenResponse = (await myclient.query({ query: getSevenByIdQuery(id) })) as SevenResponse
  
      return sevenResponse.data.sitecoreseven;
    } catch {
      return null;
    }
  };