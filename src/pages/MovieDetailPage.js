import React from "react";
import { useParams } from "react-router-dom";
import MovieDetails from "../components/MovieDetails";

function MovieDetailPage() {
  const { id } = useParams();

  return <MovieDetails movieId={id} />;
}

export default MovieDetailPage;
