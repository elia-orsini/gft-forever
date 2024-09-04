export default function parseFilmName(filmName: string): string {
  filmName = filmName.toLowerCase();

  filmName = filmName.replace("preview: ", "");
  filmName = filmName.replace("+ q&a", "");
  filmName = filmName.replace("+ recorded q&a", "");
  filmName = filmName.replace(" (subtitled)", "");
  filmName = filmName.replace(" (dubbed)", "");
  filmName = filmName.replace(/\(.*\)/, "");
  filmName = filmName.replace(/\-.*th anniversary/, "");
  filmName = filmName.replace("youth screening: ", "");
  filmName = filmName.replace("massive presents - preview:", "");
  filmName = filmName.replace(" + introduction", "");

  // remove all different formats
  filmName = filmName.replace("take 2: ", "");
  filmName = filmName.replace("visible cinema: ", "");
  filmName = filmName.replace("access film club: ", "");
  filmName = filmName.replace("movie memories: ", "");

  return filmName;
}
