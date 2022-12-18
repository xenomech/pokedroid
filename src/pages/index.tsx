import React, { useMemo, useState } from "react";
import { GetStaticProps } from "next";
import debounce from "lodash.debounce";
import usePageNumber from "@hooks/usePageNumber";
import { Card } from "@components";

type allPokemonType = {
  name: string;
  url: string;
};
type Props = {
  allPokemons: [allPokemonType];
};
const Home = ({ allPokemons }: Props) => {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber, numberOfPages, startIndex, lastIndex] =
    usePageNumber(allPokemons.length);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    //reset slice on search
    if (e.target.value.length > 0) {
      setPageNumber(1);
    }
    setQuery(e.target.value);
  };
  const debouncedResults = useMemo(() => {
    return debounce(handleQueryChange, 300);
  }, []);
  return (
    <div className="">
      <div className="sticky top-0 p-4 bg-white bg-opacity-20 backdrop-blur-md rounded drop-shadow-lg lg:bg-transparent lg:backdrop-blur-none lg:drop-shadow-none">
        <div className="flex justify-center align-middle my-6 text-5xl ">
          <h1 className="origin-center -rotate-6 neubrutal-borders neubrutal-borders-shadow p-4 m-4 bg-white">
            Poké Card
          </h1>
        </div>
        <div className="max-w-5xl mx-auto flex justify-center align-middle ">
          <input
            className="neubrutal-borders p-2 w-full"
            placeholder="Search for your favorite Pokémons here!"
            onChange={debouncedResults}
          />
        </div>
      </div>
      <div className="max-w-5xl mx-4 lg:mx-auto">
        <div className="md:grid md:grid-cols-3 lg:grid-cols-4 flex justify-center align-middle flex-wrap gap-6 my-6">
          {allPokemons
            .filter((item) =>
              item.name.toLowerCase().includes(query.toLocaleLowerCase())
            )
            .slice(startIndex, lastIndex)
            .map((item) => {
              return (
                <>
                  <Card item={item} />
                </>
              );
            })}
        </div>
        <div className="flex justify-center flex-wrap align-middle">
          <button
            className="p-2 px-3 mx-2 text-sm neubrutal-borders "
            onClick={() => {
              if (pageNumber > 1) {
                setPageNumber(pageNumber - 1);
              }
            }}
          >
            Prev
          </button>
          <p className="text-sm p-3 mx-2">
            Page {pageNumber} of {numberOfPages}
          </p>
          <button
            className="p-2 px-3 mx-2 text-sm neubrutal-borders "
            onClick={() => {
              if (pageNumber < numberOfPages) {
                setPageNumber(pageNumber + 1);
              }
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<{
  allPokemons: allPokemonType;
}> = async (context) => {
  const res = await fetch("https://pokeapi.co/api/v2/generation/1");
  const allPokemons = await res.json();
  return {
    props: {
      allPokemons: allPokemons.pokemon_species,
    },
  };
};
