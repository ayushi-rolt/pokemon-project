import { useEffect, useState } from "react";
import "./index.css";
import { PokemonCards } from "./PokemonCards";

export const Pokemon = () => {
const [pokemon , setPokemon] = useState([]);
const [Loading , setLoading] = useState(true);
const [error , setError] = useState(null);
const [search , setSearch] = useState("");

// pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonsPerPage] = useState(12); // fixed number

 const API= "https://pokeapi.co/api/v2/pokemon?limit=124";


const fetchPokemon = async() =>{
try {
    const res = await fetch(API);
    const data = await res.json();
   

    const deatiledPokemonData = data.results.map(async (curPokemon) =>
        {
       const res = await fetch(curPokemon.url);
       const data = await res.json();
       return data ;
    });
   

    const detailedResponses =await  Promise.all(deatiledPokemonData) ;
    console.log(detailedResponses);
    setPokemon(detailedResponses);
    setLoading(false);
    }
catch (error) {
    console.log(error)
    setLoading(false);
    setError(error);
  }
};


useEffect(()=>{
    fetchPokemon();
},[]);
      
// search functionality
const filteredPokemon = pokemon.filter((curPokemon) =>
  curPokemon.name.toLowerCase().includes(search.toLowerCase())
);

// pagination logic
const indexOfLastPokemon = currentPage * pokemonsPerPage;
const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
const currentPokemons = filteredPokemon.slice(
  indexOfFirstPokemon,
  indexOfLastPokemon
);

const totalPages = Math.ceil(filteredPokemon.length / pokemonsPerPage);


if(Loading){
    return(<div>
        <h1>Loading ...</h1>
    </div>
    );
}

if(error){
    return(<div>
        <h1>{error.message}</h1>
    </div>
    );
}

    return (
    <>
    <section className="container">
        {/* Pokeball animation */}
      <div className="pokeball"></div>
        <header><h1>lets catch pokemon</h1></header>
        <div className="pokemon-search">
            <input type="text" placeholder="search Pokemon"
             value={search} 
             onChange={(e)=> setSearch(e.target.value)}/>
        </div>
        <div>
            <ul className="cards">
             {currentPokemons.map((curPokemon)=> {
                 return(
                 <PokemonCards key={curPokemon.id} pokemonData={curPokemon}/>
                ) ;
                }) }
            </ul>
        </div>
        {/* Pagination controls */}
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
    </section>
    </>
   );
};
