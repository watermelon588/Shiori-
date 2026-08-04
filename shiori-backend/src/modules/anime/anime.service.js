import { anilistClient } from "./anime.client.js";

const SEARCH_ANIME_QUERY = `

query($search:String){

    Page(perPage:10){

        media(
            search:$search,
            type:ANIME
        ){

            id

            title{
                romaji
                english
                native
            }

            episodes

            status

            genres

            coverImage{
                large
            }

        }

    }

}

`;
export const searchAnime = async (search) => {


  const response =
    await anilistClient.post(
      "",
      {
        query: SEARCH_ANIME_QUERY,

        variables: {
          search
        }
      }
    );


  return response.data.data.Page.media;

};